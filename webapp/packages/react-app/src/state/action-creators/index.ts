import {ActionType} from "../action-types";
import {
  Action,
  AddFilesToListAction,
  CreateFileAction,
  CreateProjectAction,
  DeleteCellAction,
  DeleteFileAction,
  DeleteProjectAction,
  Direction,
  InsertCellAfterAction,
  MoveCellAction,
  SetCurrentProjectAction,
  UpdateCellAction,
  UpdateFileAction,
  UpdateProjectAction
} from '../actions';
import {Cell, CellTypes} from '../cell';
import {Dispatch} from "react";
import {bundleCodeStr, bundleFilePath} from "../../bundler";
import axios from 'axios';
import {RootState} from "../reducers";
import {ReduxProject, ProjectFrameworks, ReduxProjectPartial} from "../project";
import {FileTypes, ReduxFile, ReduxFilePartial} from "../file";
import {randomIdGenerator} from "../id";


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

export const createCellBundle = (cellId:string, input:string) => {
  return async (dispatch:Dispatch<Action>) => {
      dispatch({
          type: ActionType.CELL_BUNDLE_START,
          payload: {
              cellId,
          }
      });

      const result = await bundleCodeStr(input);

      dispatch({
          type: ActionType.CELL_BUNDLE_COMPLETE,
          payload: {
              cellId,
              bundle: result
          }
      });
  };
}


export const createProjectBundle = (projectLocalId:string, input:string) => {
    return async (dispatch:Dispatch<Action>) => {
        dispatch({
            type: ActionType.PROJECT_BUNDLE_START,
            payload: {
                projectLocalId: projectLocalId,
            }
        });

        const result = await bundleFilePath(input);
  
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
            const {data}: {data: Cell[]} = await axios.get('/cells');

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
            await axios.post('/cells', { cells });
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

export const createProject = (localId: string, title:string, framework: ProjectFrameworks): CreateProjectAction => {
    return {
        type: ActionType.CREATE_PROJECT,
        payload: {
            localId,
            title,
            framework
        }
    }
}

export const updateProject = (projectPartial: ReduxProjectPartial): UpdateProjectAction => {
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

export const createAndSetProject = (localId: string, title:string, framework: ProjectFrameworks) => {
    return async (dispatch: Dispatch<Action>, getState: () => RootState) => {
        dispatch(createProject(localId, title, framework));
        const { projects } = getState();

        const firstProject:[string, ReduxProject] = Object.entries(projects.data)[0];
        dispatch(setCurrentProjectId(firstProject[0]));
    }
}

const gApiUri = 'http://localhost:8080/api/v1';
const gJwtToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjg5NTg5MjE0LCJpYXQiOjE2ODk1MDI4MTQsImp0aSI6IjRjYTVkN2Y5Njk2ZTQwNjk5NDgxYjg1YWY5NWZkZTFhIiwidXNlcl9pZCI6ImE1MTU3MWNjLWY5YjMtNGY0ZC1iMTEwLWJjNGE1NWE1MGI0YiJ9.Aykj64dnf4IVgzKK6IlipdW5d1rEXS4YsEZHkr67KKU";
const gHeaders = {
  Authorization: `Bearer ${gJwtToken}`
}


export const fetchProjectsAndFiles = () => {
  return async (dispatch: Dispatch<Action>, getState: () => RootState) => {
    try {
      const {data:projects}: {data: ReduxProject[]} = await axios.get(`${gApiUri}/projects/`, {headers: gHeaders});
      dispatch({
        type: ActionType.FETCH_PROJECTS_COMPLETE,
        payload: projects
      });

      fetchFiles()(dispatch, getState);
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

export const fetchProjects = () => {
  return async (dispatch: Dispatch<Action>) => {
    try {
      const {data}: {data: ReduxProject[]} = await axios.get(`${gApiUri}/projects/`, {headers: gHeaders});

      dispatch({
        type: ActionType.FETCH_PROJECTS_COMPLETE,
        payload: data
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


export const createProjectOnServer = (localId:string, title:string, description:string) => {
  return async (dispatch: Dispatch<Action>, getState: () => RootState) => {
    const data = {
      title,
      description
    };

    try {
      const response = await axios.post(`${gApiUri}/projects/`, data, {headers: gHeaders});
      const {id, pkid, folder} = response.data
      // We are putting pkid in the id.
      dispatch(updateProject({localId, id, pkid, folder, synced:true}));
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
      const response = await axios.get(`${gApiUri}/projects/${project.pkid}/`,{headers: gHeaders});
      console.log(`fetchProjectFromServer:${JSON.stringify(response.data, null, 2)}`);

      const {entry_file, entry_path} = response.data;
      dispatch(updateProject({localId, entry_file, entry_path}));
    } catch (err) {
      if (err instanceof Error) {
        console.error(`Error! ${err.message}`);
      }
    }
  }
}

export const createFile = (
    localId: string,
    path:string,
    localFile:File,
    type: FileTypes,
    projectLocalId?: string,
    isEntryPoint?: boolean,
): CreateFileAction => {
  return {
    type: ActionType.CREATE_FILE,
    payload: {
      localId,
      path,
      localFile,
      type,
      projectLocalId,
      isEntryPoint,
    }
  }
}

export const updateFile = (filePartial: ReduxFilePartial): UpdateFileAction => {
  return {
    type: ActionType.UPDATE_FILE,
    payload: filePartial
  }
}

export const deleteFile = (localId:string): DeleteFileAction => {
  return {
    type: ActionType.DELETE_FILE,
    payload: localId
  }
}

export const addFilesToList = (files: ReduxFile[]): AddFilesToListAction => {
  return {
    type: ActionType.ADD_FILES_TO_LIST,
    payload: {
      files
    }
  }
}

export const deleteFilesFromList = (files: (ReduxFile|string)[]) => {
  return {
    type: ActionType.DELETE_FILES_FROM_LIST,
    payload: {
      files
    }
  }
}

//
export const fetchFiles = () => {
  return async (dispatch: Dispatch<Action>, getState: () => RootState) => {
    try {
      // Later we can created a combined object
      const {data}:{data:ReduxFile[]} = await axios.get(`${gApiUri}/files/`, {headers: gHeaders});

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

          // We check if this is entry file for the project
          // const project = getState().projects.data[file.projectLocalId];
          // if (project.entry_file === file.pkid) {
          //   console.log(`file: '${file.localId}' is entry point for project '${project.localId}'`);
          //   project.entryFileLocalId = file.localId;
          // }
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

export const fetchFileContents = ([localIds]: [string]) => {
  return async (dispatch: Dispatch<Action>, getState: () => RootState) => {
    if (!localIds || localIds.length < 1) {
      console.log('fetchFileIds(): No ids specified');
      return;
    }

    const fileStates = Object.entries(getState().files.data).filter(([k,v]) => localIds.includes(k)).map(([k, v]) => v);
    // console.log(`fileStates:`, fileStates);

    try {
      const {data}: {data: string} = await axios.get(fileStates[0].file!.replace('localhost', 'localhost:8080'));

      dispatch({
        type: ActionType.UPDATE_FILE,
        payload: {
          localId: fileStates[0].localId,
          content: data,
          contentSynced: true,
          isServerResponse: true,
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


// This action is dispatched from the persistMiddleware.
export const createFileOnServer = (
    localId: string,
    path:string,
    localFile:File,
    type: FileTypes,
    projectLocalId?: string|null,
    isEntryPoint?: boolean
) => {
  return async (dispatch: Dispatch<Action>, getState: () => RootState) => {
    const formData = new FormData();
    formData.append("path", path);
    formData.append("file", localFile);
    formData.append("is_entry_point", isEntryPoint as unknown as string);

    if (projectLocalId) {
      const project = getState().projects.data[projectLocalId];
      console.log(project)
      if (project.pkid > 0) {
        formData.append("project", project.pkid as unknown as string); // We could use pkid as well
      }
    }

    try {
      const response = await axios.post(`${gApiUri}/files/`, formData, {headers: gHeaders});
      console.log(response);

      // const {id, pkid} = response.data
      // We are putting pkid in the id
      // We can put a field here response t
      dispatch(updateFile({
        localId,
        synced:true,
        isServerResponse: true,
        ...response.data
      })); //

      if (projectLocalId) {
        if (isEntryPoint) {
          console.log(`file['${localId}'] path:${path} is an entry point for project['${projectLocalId}']`);
          dispatch(updateProject({
            localId: projectLocalId,
            entryFileLocalId: localId,
            entryPath: path,
            isServerResponse: true,
          }))

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
export const updateFileOnServer = (
    localId: string,
    pkid: number,
    path?:string,
    localFile?:File,
    type?: FileTypes,
    projectLocalId?: string|null,
    isEntryPoint?: boolean
) => {
  return async (dispatch: Dispatch<Action>, getState: () => RootState) => {
    const formData = new FormData();
    if (path) {
      console.log(`Added path: ${path}`)
      formData.append("path", path);
    }
    if (localFile) {
      formData.append("file", localFile);
    }
    if (isEntryPoint) {
      formData.append("is_entry_point", isEntryPoint as unknown as string);
    }
    if (projectLocalId) {
      const project = getState().projects.data[projectLocalId];
      console.log(project)
      if (project.pkid > 0) {
        formData.append("project", project.pkid as unknown as string); // We could use pkid as well
      }
    }

    try {
      const response = await axios.patch(`${gApiUri}/files/${pkid}/`, formData, {headers: gHeaders});
      console.log(response);

      // const {id, pkid} = response.data
      // We are putting pkid in the id
      // We can put a field here response t
      dispatch(updateFile({
        localId,
        synced:true,
        isServerResponse: true,
        ...response.data
      })); //

      if (projectLocalId) {
        if (isEntryPoint) {
          console.log(`file['${localId}'] path:${path} is an entry point for project['${projectLocalId}']`);
          dispatch(updateProject({
            localId: projectLocalId,
            entryFileLocalId: localId,
            entryPath: path,
            isServerResponse: true,
          }))

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