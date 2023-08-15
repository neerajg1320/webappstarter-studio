import {ActionType} from "../action-types";
import {
  Action,
  CreateFileAction,
  CreateProjectAction,
  DeleteCellAction,
  DeleteFileAction,
  DeleteProjectAction,
  Direction,
  InsertCellAfterAction, LoginRequestFailedAction,
  LoginRequestStartAction, LoginRequestSuccessAction, LogoutRequestAction,
  MoveCellAction,
  SetCurrentProjectAction,
  UpdateCellAction,
  UpdateFileAction,
  UpdateFileSavePartialAction,
  UpdateProjectAction, UpdateUserAction
} from '../actions';
import {Cell, CellTypes} from '../cell';
import {Dispatch} from "react";
import {bundleCodeStr, bundleFilePath} from "../../bundler";

import {RootState} from "../reducers";
import {
  ReduxCreateProjectPartial,
  ReduxDeleteProjectPartial,
  ReduxProject,
  ReduxUpdateProjectPartial
} from "../project";
import {
  ReduxCreateFilePartial,
  ReduxDeleteFilePartial,
  ReduxFile,
  ReduxSaveFilePartial,
  ReduxUpdateFilePartial
} from "../file";
import {randomIdGenerator} from "../id";
import {debugAuth, debugAxios, debugRedux, serverApiBaseUrl} from "../../config/global";
import {createFileFromString} from "../../utils/file";
import {ReduxUpdateUserPartial, ReduxUser} from "../user";
import {axiosApiInstance, setAxiosAuthToken} from "../../api/axiosApi";
import {
  fetchAuthFromLocalStorage,
  removeAuthFromLocalStorage,
  saveAuthToLocalStorage
} from "../../local-storage/local-storage";
import {AuthInfo} from "../auth";
import {AxiosHeaders} from "axios";
import {BundleLanguage, pathToBundleLanguage} from "../bundle";


export const updateCell = (id: string, content: string, filePath: string): UpdateCellAction => {
  return {
      type: ActionType.UPDATE_CELL,
      payload: {
          id,
          content, 
          filePath
      }
  }
};

export const deleteCell = (id: string): DeleteCellAction => {
  return {
      type: ActionType.DELETE_CELL,
      payload: id
  }
};


export const moveCell = (id: string, direction: Direction): MoveCellAction => {
  return {
      type: ActionType.MOVE_CELL,
      payload: {
          id,
          direction
      }
  }
};

export const insertCellAfter = (id: string | null, cellType: CellTypes): InsertCellAfterAction => {
  return {
      type: ActionType.INSERT_CELL_AFTER,
      payload: {
          id,
          type: cellType
      }
  }
};

export const createCellBundle = (cellId:string, input:string, bundleLanguage: BundleLanguage) => {
  return async (dispatch:Dispatch<Action>) => {
      dispatch({
          type: ActionType.CELL_BUNDLE_START,
          payload: {
              cellId,
          }
      });

      const result = await bundleCodeStr(input, bundleLanguage);

      dispatch({
          type: ActionType.CELL_BUNDLE_COMPLETE,
          payload: {
              cellId,
              bundle: result
          }
      });
  };
}


export const createProjectBundle = (projectLocalId:string, input:string, bundleLanguage: BundleLanguage) => {
    return async (dispatch:Dispatch<Action>) => {
        dispatch({
            type: ActionType.PROJECT_BUNDLE_START,
            payload: {
                projectLocalId: projectLocalId,
            }
        });

        const result = await bundleFilePath(input, bundleLanguage);
  
        dispatch({
            type: ActionType.PROJECT_BUNDLE_COMPLETE,
            payload: {
                projectLocalId,
                bundle: result
            }
        });
    };
  }
  

// We will use thunk here as we use a network request which is asynchronous
export const fetchCells = () => {
    return async (dispatch: Dispatch<Action>) => {
        dispatch({
            type: ActionType.FETCH_CELLS
        })

        try {
            const {data}: {data: Cell[]} = await axiosApiInstance.get('/cells');

            dispatch({
                type: ActionType.FETCH_CELLS_COMPLETE,
                payload: data
            });
        } catch (err) {
            if (err instanceof Error) {
                dispatch({
                    type: ActionType.FETCH_CELLS_ERROR,
                    payload: err.message
                });
            }
        }
    };
}

export const saveCells = () => {
    return async (dispatch: Dispatch<Action>, getState: () => RootState) => {
        const { cells: {data, order}} = getState();

        const cells = order.map(id => data[id]);
        // console.log(`cells=`, cells);
        try {
            await axiosApiInstance.post('/cells', { cells });
        } catch (err) {
            if (err instanceof Error) {
                dispatch({
                    type: ActionType.SAVE_CELLS_ERROR,
                    payload: err.message
                });
            }
        }
    }
}

export const createProject = (projectPartial: ReduxCreateProjectPartial): CreateProjectAction => {
    return {
        type: ActionType.CREATE_PROJECT,
        payload: projectPartial
    }
}

export const updateProject = (projectPartial: ReduxUpdateProjectPartial): UpdateProjectAction => {
  // console.log(`updateProject: ${JSON.stringify(projectPartial)}`);
  return {
      type: ActionType.UPDATE_PROJECT,
      payload: projectPartial
  }
}

export const deleteProject = (localId:string): DeleteProjectAction => {
    return {
        type: ActionType.DELETE_PROJECT,
        payload: localId
    }
}

export const setCurrentProjectId = (localId: string): SetCurrentProjectAction => {
    return {
        type: ActionType.SET_CURRENT_PROJECT,
        payload: localId
    }
}

export const createAndSetProject = (projectPartial: ReduxCreateProjectPartial) => {
    return async (dispatch: Dispatch<Action>, getState: () => RootState) => {
        dispatch(createProject(projectPartial));
        // const { projects } = getState();

        // const firstProject:[string, ReduxProject] = Object.entries(projects.data)[0];
        dispatch(setCurrentProjectId(projectPartial.localId));
    }
}


const gApiUri = '';
const __rm__gHeaders = {
}


export const fetchProjectsAndFiles = () => {
  return async (dispatch: Dispatch<Action>, getState: () => RootState) => {
    // console.log(getState().auth);
    await fetchProjects()(dispatch, getState);
    fetchFiles()(dispatch, getState);
  };
}

export const fetchProjects = () => {
  return async (dispatch: Dispatch<Action>, getState: () => RootState) => {
    try {
      const {data:projects}: {data: ReduxProject[]} = await axiosApiInstance.get(`/projects/`, );
      dispatch({
        type: ActionType.FETCH_PROJECTS_COMPLETE,
        payload: projects
      });
    } catch (err) {
      if (err instanceof Error) {
        dispatch({
          type: ActionType.FETCH_PROJECTS_ERROR,
          payload: err.message
        });
      }
    }
  };
}


export const createProjectOnServer = (projectPartial: ReduxCreateProjectPartial) => {
  return async (dispatch: Dispatch<Action>, getState: () => RootState) => {
    try {
      const response = await axiosApiInstance.post(`${gApiUri}/projects/`, projectPartial, {headers: __rm__gHeaders});
      const {id, pkid, folder} = response.data
      // We are putting pkid in the id.
      dispatch(updateProject({localId:projectPartial.localId, id, pkid, folder, synced:true}));
    } catch (err) {
      if (err instanceof Error) {
        console.error(`Error! ${err.message}`);
        // dispatch({
        //   type: ActionType.SAVE_CELLS_ERROR,
        //   payload: err.message
        // });
      }
    }
  }
}

export const updateProjectOnServer = (pkid: number, projectPartial: ReduxCreateProjectPartial) => {
  return async (dispatch: Dispatch<Action>, getState: () => RootState) => {
    const {title, description, framework} = projectPartial;
    // We select the fields which are sent to the server
    const projectUpdatePartial = {title, description, framework} as ReduxUpdateProjectPartial;
    console.log(`Temporary: updating`, projectUpdatePartial);

    try {
      const response = await axiosApiInstance.patch(`${gApiUri}/projects/${pkid}/`, projectUpdatePartial);
      const {folder} = response.data
      // We are putting pkid in the id.
      dispatch(updateProject({localId:projectPartial.localId, folder, synced:true}));
    } catch (err) {
      if (err instanceof Error) {
        console.error(`Error! ${err.message}`);
        // dispatch({
        //   type: ActionType.SAVE_CELLS_ERROR,
        //   payload: err.message
        // });
      }
    }
  }
}

// This is invoked when we create a file with is_entry_point set
export const fetchProjectFromServer = (localId:string) => {
  return async (dispatch: Dispatch<Action>, getState: () => RootState) => {
    const project = getState().projects.data[localId];
    try {
      const response = await axiosApiInstance.get(`${gApiUri}/projects/${project.pkid}/`,{headers: __rm__gHeaders});
      if (debugRedux) {
        console.log(`fetchProjectFromServer:${JSON.stringify(response.data, null, 2)}`);
      }

      const {entry_file, entry_path} = response.data;
      dispatch(updateProject({localId, entry_file, entry_path}));
    } catch (err) {
      if (err instanceof Error) {
        console.error(`Error! ${err.message}`);
      }
    }
  }
}

export const deleteProjectFromServer = (pkid:number, deleteProjectPartial: ReduxDeleteProjectPartial) => {
  return async (dispatch: Dispatch<Action>, getState: () => RootState) => {
    // console.log('deleteProjectFromServer:', deleteProjectPartial);

    const {localId} = deleteProjectPartial;

    try {
      const {status} = await axiosApiInstance.delete(`${gApiUri}/projects/${pkid}/`,{headers: __rm__gHeaders});
      // We need to watch this if the following check is sufficient
      if (status === 204) {
        dispatch(deleteProject(localId));
      }
    } catch (err) {
      if (err instanceof Error) {
        console.error(`Error! ${err.message}`);
        // dispatch({
        //   type: ActionType.SAVE_CELLS_ERROR,
        //   payload: err.message
        // });
      }
    }
  }
}

export const removeProject = (localId:string) => {
  return async (dispatch: Dispatch<Action>, getState: () => RootState) => {
    if (debugRedux) {
      console.log(`removeProject:`, localId);
    }

    const projectState = getState().projects.data[localId];
    if (!projectState) {
      console.error(`Error! project id '${localId}' not found in store`)
    }

    const {pkid} = projectState;
    if (pkid && pkid > 0) {
      dispatch(updateProject({localId, deleteMarked: true}));
      deleteProjectFromServer(pkid, {localId})(dispatch, getState);
    } else {
      dispatch(deleteProject(localId));
    }
  }
}

export const downloadFetchProjectZip = (localId:string) => {
  return async (dispatch: Dispatch<Action>, getState: () => RootState) => {
    const projectState = getState().projects.data[localId];
    if (!projectState) {
      console.error(`Error! project id '${localId}' not found in store`)
    }

    const {pkid} = projectState;

    fetch(`${serverApiBaseUrl}/projects/${pkid}/download/`,
        { headers: { Authorization: `Bearer ${getState().auth.jwtToken}` }})
        .then((res) => {

          const header = res.headers.get('Content-Disposition');
          console.log(`header`, header);

          // const parts = header!.split(';');
          // filename = parts[1].split('=')[1];
          return res.blob();
        }).then((blob) => {
          // Use `filename` here e.g. with file-saver:
          // saveAs(blob, filename);
        });
  }
}

export const downloadProjectZip = (localId:string) => {
  return async (dispatch: Dispatch<Action>, getState: () => RootState) => {
    const projectState = getState().projects.data[localId];
    if (!projectState) {
      console.error(`Error! project id '${localId}' not found in store`)
    }

    const {pkid} = projectState;

    try {
      // const {headers, data}:{headers:AxiosHeaders, data:Blob}
      const response = await axiosApiInstance.get(
          `/projects/${pkid}/download/`,
          {responseType: 'blob'}
      );
      console.log(response);
      const contentDisposition = response.headers['content-disposition'];
      console.log(contentDisposition);

      dispatch(updateProject({
        localId,
        zipBlob: response.data
      }));
    } catch (err) {
      if (err instanceof Error) {
        // dispatch({
        //   type: ActionType.DOWNLOAD_PROJECT_COMPLETE,
        //   payload: err.message
        // });
      }
    }
  }
}

// See if we can call this from fetchFiles
export const createFile = (filePartial:ReduxCreateFilePartial): CreateFileAction => {
  return {
    type: ActionType.CREATE_FILE,
    payload: filePartial
  }
}

export const updateFile = (filePartial:ReduxUpdateFilePartial): UpdateFileAction => {
  return {
    type: ActionType.UPDATE_FILE,
    payload: filePartial
  }
}

export const updateFileSavePartial = (saveFilePartial: ReduxSaveFilePartial): UpdateFileSavePartialAction => {
  return {
    type: ActionType.UPDATE_FILE_SAVE_PARTIAL,
    payload: saveFilePartial
  }
}

export const deleteFile = (localId:string): DeleteFileAction => {
  return {
    type: ActionType.DELETE_FILE,
    payload: localId
  }
}

//
export const fetchFiles = () => {
  return async (dispatch: Dispatch<Action>, getState: () => RootState) => {
    try {
      // Later we can created a combined object
      const {data}:{data:ReduxFile[]} = await axiosApiInstance.get(`/files/`);

      // console.log(getState().projects.data);
      const projectsPkidToLocalIdMap:{[n: number]:string} = Object.entries(getState().projects.data).reduce((acc:{[n:number]:string}, [localId,project]) => {
        acc[project.pkid] = localId;
        return acc;
      }, {});
      // console.log(projectsPkidToLocalIdMap);

      // We need to do change this once we create a combined or server object
      const files = data.map((file) => {
        file.localId = randomIdGenerator();

        // file.project is the project pkid
        if (file.project) {
          file.projectLocalId = projectsPkidToLocalIdMap[file.project]
          file.isEntryPoint = file.is_entry_point;
          file.bundleLanguage = pathToBundleLanguage(file.path);

          dispatch(updateProject({localId: file.projectLocalId, entryFileLocalId: file.localId}));
        }
        return file;
      });

      dispatch({
        type: ActionType.FETCH_FILES_COMPLETE,
        payload: files,
      });
    } catch (err) {
      if (err instanceof Error) {
        dispatch({
          type: ActionType.FETCH_FILES_ERROR,
          payload: err.message
        });
      }
    }
  };
}

export const saveProject = (localId: string) => {
  return async (dispatch: Dispatch<Action>, getState: () => RootState) => {
    const projectState = getState().projects.data[localId];

    if (!projectState) {
      console.error(`Error! project id '${localId}' not found in store`)
    }

    // Here we can use member based type narrowing
    const {pkid} = projectState;
    if (!pkid || pkid < 0) {
      createProjectOnServer(projectState)(dispatch, getState);
    } else {
      updateProjectOnServer(pkid, projectState)(dispatch, getState);
    }
  }
}

export const saveFile = (localId: string) => {
  return async (dispatch: Dispatch<Action>, getState: () => RootState) => {
    const fileState = getState().files.data[localId];

    if (!fileState) {
      console.error(`Error! file id '${localId}' not found in store`)
    }

    // Here we can use member based type narrowing
    const {pkid} = fileState;
    if (!pkid || pkid < 0) {
      let _createFilePartial:ReduxCreateFilePartial = {...fileState};
      if (Object.keys(_createFilePartial).includes('content')) {
        _createFilePartial['localFile'] = createFileFromString(fileState.content || '', fileState.localId);
      }
      createFileOnServer(_createFilePartial)(dispatch, getState);
    } else {
      let _saveFilePartial = {...fileState.saveFilePartial};

      if (Object.keys(_saveFilePartial).length < 2) {
        console.log(`Warning! nothing needs to be saved. Disable save controls`);
        return;
      }

      if (Object.keys(_saveFilePartial).includes('content')) {
        _saveFilePartial['file'] = createFileFromString(fileState.content || '', fileState.localId);
      }
      updateFileOnServer(pkid, _saveFilePartial)(dispatch, getState);
    }
  }
}

export const removeFile = (localId:string) => {
  return async (dispatch: Dispatch<Action>, getState: () => RootState) => {
    console.log(`removeFile:`, localId);

    const fileState = getState().files.data[localId];
    if (!fileState) {
      console.error(`Error! file id '${localId}' not found in store`)
    }

    const {pkid} = fileState;
    if (pkid && pkid > 0) {
      dispatch(updateFile({localId, deleteMarked: true}));
      deleteFileFromServer(pkid, {localId})(dispatch, getState);
    } else {
      dispatch(deleteFile(localId));
    }
  }
}

export const fetchFileContents = (localIds: [string]) => {
  return async (dispatch: Dispatch<Action>, getState: () => RootState) => {
    if (debugRedux) {
      console.log(`fetchFileContents: ${localIds[0]}`);
    }

    if (!localIds || localIds.length < 1) {
      console.log('fetchFileIds(): No ids specified');
      return;
    }

    const fileStates = Object.entries(getState().files.data).filter(([k,v]) => localIds.includes(k)).map(([k, v]) => v);
    // console.log(`fileStates:`, fileStates);

    dispatch({
      type: ActionType.UPDATE_FILE,
      payload: {
        localId: fileStates[0].localId,
        requestInitiated: true,
      }
    });

    try {
      const {data}: {data: string} = await axiosApiInstance.get(fileStates[0].file!.replace('localhost', 'localhost:8080'));

      dispatch({
        type: ActionType.UPDATE_FILE,
        payload: {
          localId: fileStates[0].localId,
          content: data,
          contentSynced: true,
          isServerResponse: true,
          requestInitiated: false,
          saveFilePartial: {localId:fileStates[0].localId}
        }
      });
    } catch (err) {
      if (err instanceof Error) {
        dispatch({
          type: ActionType.FETCH_FILES_ERROR,
          payload: err.message,
        });
      }
    }
  }
}

// We can set following to true in case we do not want to wait for the project to get updated from server
// when the entrypoint status or path changes on the entryfile of a project.
// We set it to false that so that we are always in sync with server
const projectLocalUpdate = false;

// This action is dispatched from the persistMiddleware.
export const createFileOnServer = (fileCreatePartial: ReduxCreateFilePartial) => {
  return async (dispatch: Dispatch<Action>, getState: () => RootState) => {
    console.log(`fileCreatePartial:`, fileCreatePartial);

    const {localId} = fileCreatePartial;

    const formData = new FormData();
    formData.append("path", fileCreatePartial.path || '');
    formData.append("file", fileCreatePartial.localFile!);
    // formData.append("language", fileCreatePartial.bundleLanguage);
    formData.append("is_entry_point", fileCreatePartial.isEntryPoint! as unknown as string);

    if (fileCreatePartial.projectLocalId) {
      const project = getState().projects.data[fileCreatePartial.projectLocalId];
      console.log(project)
      if (project.pkid > 0) {
        formData.append("project", project.pkid as unknown as string); // We could use pkid as well
      }
    }

    try {
      const response = await axiosApiInstance.post(`${gApiUri}/files/`, formData, {headers: __rm__gHeaders});
      console.log(response);

      // const {id, pkid} = response.data
      // We are putting pkid in the id
      // We can put a field here response t
      dispatch(updateFile({
        localId,
        synced:true,
        isServerResponse: true,
        // language: pathToBundleLanguage(response.data.path), // Need to be fixed
        ...response.data
      })); //

      const {projectLocalId, isEntryPoint, path}  = fileCreatePartial;
      if (projectLocalId) {
        if (isEntryPoint) {
          console.log(`file['${localId}'] path:${path} is an entry point for project['${projectLocalId}']`);
          if (projectLocalUpdate) {
            dispatch(updateProject({
              localId: projectLocalId,
              entryFileLocalId: localId,
              entryPath: path,
              isServerResponse: true,
            }));
          }

          // This will ensure the dispatch from middleware
          await fetchProjectFromServer(projectLocalId)(dispatch,getState);
        }
      }
    } catch (err) {
      if (err instanceof Error) {
        console.error(`Error! ${err.message}`);
        // dispatch({
        //   type: ActionType.SAVE_CELLS_ERROR,
        //   payload: err.message
        // });
      }
    }
  }
}

// This action is dispatched from the persistMiddleware.
export const updateFileOnServer = (pkid:number, saveFilePartial: ReduxSaveFilePartial) => {
  return async (dispatch: Dispatch<Action>, getState: () => RootState) => {
    if (debugRedux) {
      console.log('saveFilePartial:', saveFilePartial);
    }


    const formData = new FormData();
    if (Object.keys(saveFilePartial).includes('path')) {
      formData.append("path", saveFilePartial.path!);
    }
    if (Object.keys(saveFilePartial).includes('file')) {
      formData.append("file", saveFilePartial.file!);
    }
    // if (Object.keys(saveFilePartial).includes('language')) {
    //   formData.append("language", saveFilePartial.bundleLanguage!);
    // }
    if (Object.keys(saveFilePartial).includes('is_entry_point')) {
      formData.append("is_entry_point", saveFilePartial.is_entry_point! as unknown as string);
    }

    const {localId} = saveFilePartial;

    try {
      const response = await axiosApiInstance.patch(`${gApiUri}/files/${pkid}/`, formData, {headers: __rm__gHeaders});
      if (debugRedux) {
        console.log(response);
      }

      // const {id, pkid} = response.data
      // We are putting pkid in the id
      // We can put a field here response t
      dispatch(updateFile({
        localId,
        synced:true,
        isServerResponse: true,
        saveFilePartial: {localId},
        // language: pathToBundleLanguage(response.data.path), // Need to be fixed
        ...response.data
      })); //

      // TBD: We need to fix this logic
      // We have to resolve the syncing problem most probably outside this.
      const {is_entry_point, path} = saveFilePartial;
      const fileState = getState().files.data[localId] as ReduxFile;

      if (is_entry_point !== undefined || (path !== undefined && fileState.isEntryPoint)) {
        if (fileState.projectLocalId) {

          if (projectLocalUpdate) {
            console.log(`file['${localId}'] path:${fileState.path} is an entry point for project['${fileState.projectLocalId}']`);
            const projectState = getState().projects.data[fileState.projectLocalId] as ReduxProject;

            if (projectState) {
              if (fileState.isEntryPoint) {
                // We short circuit the entry_path so that we don't wait for fetch
                dispatch(updateProject({
                  localId: fileState.projectLocalId,
                  entryFileLocalId: localId,
                  entry_path: fileState.path,
                }));
              } else {
                if (projectState.entryFileLocalId === localId) {
                  console.log(`We need to unset the entryFile`);
                  dispatch(updateProject({
                    localId: fileState.projectLocalId,
                    entryFileLocalId: null,
                    entry_path: undefined,
                  }));
                } else {
                  console.error(`File '${localId}' is not entry point for project '${fileState.projectLocalId}'`);
                }
              }
            } else {
              console.error(`Project state not found for localId '${fileState.projectLocalId}'`);
            }
          }

          // This will make sure that the project is in sync with server
          await fetchProjectFromServer(fileState.projectLocalId)(dispatch,getState);

        } else {
          console.log(`File state not found for localId '${localId}'`);
        }
      }
    } catch (err) {
      if (err instanceof Error) {
        console.error(`Error! ${err.message}`);
        // dispatch({
        //   type: ActionType.SAVE_CELLS_ERROR,
        //   payload: err.message
        // });
      }
    }
  }
}

export const deleteFileFromServer = (pkid:number, deleteFilePartial: ReduxDeleteFilePartial) => {
  return async (dispatch: Dispatch<Action>, getState: () => RootState) => {
    console.log('saveFilePartial:', deleteFilePartial);

    const {localId} = deleteFilePartial;

    try {
      const response = await axiosApiInstance.delete(`${gApiUri}/files/${pkid}/`,{headers: __rm__gHeaders});
      console.log(response);

      // const {id, pkid} = response.data
      // We are putting pkid in the id
      // We can put a field here response t
      dispatch(deleteFile(localId)); //

    } catch (err) {
      if (err instanceof Error) {
        console.error(`Error! ${err.message}`);
        // dispatch({
        //   type: ActionType.SAVE_CELLS_ERROR,
        //   payload: err.message
        // });
      }
    }
  }
}

export const loginRequestStart = (email:string, password:string): LoginRequestStartAction => {
  return {
    type: ActionType.LOGIN_REQUEST_START,
    payload: {
      email,
      password
    }
  };
}

export const loginRequestSuccess = (authInfo: AuthInfo): LoginRequestSuccessAction => {
  return {
    type: ActionType.LOGIN_REQUEST_SUCCESS,
    payload: authInfo
  };
}

export const loginRequestFailed = (errors: string[]): LoginRequestFailedAction => {
  return {
    type: ActionType.LOGIN_REQUEST_FAILED,
    payload: {
      non_field_errors: errors
    }
  };
}

export const logoutRequestStart = (): LogoutRequestAction => {
  return {
    type: ActionType.LOGOUT_REQUEST,
    payload: null
  };
}

export const reAuthenticateUser = () => {
  console.log(`reAuthenticateUser(): Reauthenticating the user`)

  const authInfo:AuthInfo|null = fetchAuthFromLocalStorage();
  if (authInfo) {
    removeAuthFromLocalStorage();
  }

  authenticateUser('neeraj76@yahoo.com', 'Local123');
}

export const activateUser = (key:string) => {
  return async (dispatch: Dispatch<Action>, getState: () => RootState) => {
      const {status, data} = await axiosApiInstance.post(`/auth/registration/verify-email/`, {key});
      if (status === 200) {
        const {refresh_token, access_token, user} = data;
        if (debugAxios) {
          console.log(refresh_token, access_token, user);
        }
        console.log(`user activation successful`);
      } else {
        const {non_field_errors} = data;
        dispatch(loginRequestFailed(non_field_errors));
      }
  };
}

export const authenticateUser = (email:string, password:string) => {
  return async (dispatch: Dispatch<Action>, getState: () => RootState) => {
    let authInfo:AuthInfo|null = fetchAuthFromLocalStorage();
    if (debugAuth) {
      console.log(authInfo);
    }

    // If not found in storage then we authenticate with the server
    if (!authInfo) {
      dispatch(loginRequestStart(email, password));

      const {status, data} = await axiosApiInstance.post(`/auth/login/`, {email, password});
      if (status === 200) {
        const {refresh_token, access_token, user} = data;
        if (debugAxios) {
          console.log(refresh_token, access_token, user);
        }

        const reduxUser:ReduxUser = {
          pkid: user.pk,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name
        };
        authInfo = {accessToken:access_token, refreshToken:refresh_token, user: reduxUser};

        dispatch(loginRequestSuccess(authInfo));
        saveAuthToLocalStorage(authInfo);
      } else {
        const {non_field_errors} = data;
        dispatch(loginRequestFailed(non_field_errors));
      }
    }

    // Set the Axios and redux storage after successful authentication
    if (authInfo) {
      dispatch(loginRequestSuccess(authInfo));
      setAxiosAuthToken(authInfo.accessToken);
    } 
  };
}

export const logoutUser = () => {
  return async (dispatch: Dispatch<Action>, getState: () => RootState) => {
    removeAuthFromLocalStorage();
    dispatch(logoutRequestStart());
  };
}

export const updateUser = (userPartial: ReduxUpdateUserPartial): UpdateUserAction => {
  // console.log(`updateUser: ${JSON.stringify(userPartial)}`);
  return {
    type: ActionType.UPDATE_USER,
    payload: userPartial
  }
}

export const registerUser = (
    email:string,
    password1:string,
    password2: string,
    first_name: string,
    last_name: string,
) => {
  return async (dispatch: Dispatch<Action>, getState: () => RootState) => {
    try {
      const {status} = await axiosApiInstance.post(
          `/auth/registration/`,
          {email, password1, password2, first_name, last_name}
      );
      if (status !== 201) {
        console.error(`Error! status=${status}`);
      }
    } catch (err) {
      if (err instanceof Error) {
        console.error(`Error! ${err.message}`);
        // dispatch({
        //   type: ActionType.SAVE_CELLS_ERROR,
        //   payload: err.message
        // });
      }
    }
  }
}