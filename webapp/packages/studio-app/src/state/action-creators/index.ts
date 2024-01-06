import {ActionType} from "../action-types";
import {
  Action,
  ApiRequestFailedAction,
  ApiRequestStartAction,
  ApiRequestSuccessAction,
  ApiFlowReset,
  CreateFileAction,
  CreateProjectAction,
  DeleteCellAction,
  DeleteFileAction,
  DeleteFilesAction,
  DeleteProjectAction,
  Direction,
  InsertCellAfterAction,
  MoveCellAction,
  ResetApplicationAction,
  ResetBundlesAction,
  ResetProjectsAction,
  SetCurrentProjectAction,
  UpdateApplicationAction,
  UpdateCellAction,
  UpdateFileAction,
  UpdateProjectAction,
  UserAddAction,
  UserDeleteAction,
  UserRequestFailedAction,
  UserRequestStartAction,
  UserRequestSuccessAction,
  UserUpdateAction,
} from '../actions';
import {Cell, CellTypes} from '../cell';
import {Dispatch} from "react";
import {bundleCodeStr, bundleFilePath, initializeEsbuildBundler} from "../../bundler";

import {RootState} from "../reducers";
import {
  PackageConfig,
  ReactToolchains,
  ReduxCreateProjectPartial,
  ReduxDeleteProjectPartial,
  ReduxProject,
  ReduxUpdateProjectPartial,
  StartConfigType
} from "../project";
import {ReduxCreateFilePartial, ReduxDeleteFilePartial, ReduxFile, ReduxUpdateFilePartial} from "../file";
import {generateLocalId} from "../id";
import {
  debugAuth,
  debugAxios,
  debugBundler,
  debugPlugin,
  debugRedux,
  enableDiffForFileUpdate,
  enableLocalStorageAuth,
  serverMediaBaseUrl
} from "../../config/global";
import {createFileFromString} from "../../utils/file";
import {ReduxUpdateUserPartial, ReduxUser, UserFlowType} from "../user";
import {axiosApiInstance, setAxiosAuthToken, unsetAxiosAuthToken} from "../../api/axiosApi";
import {
  fetchAuthFromLocalStorage,
  removeAuthFromLocalStorage,
  saveAuthToLocalStorage
} from "../../local-storage/local-storage";
import {AxiosError} from "axios";
import {BundleLanguage, BundleResult, pathToBundleLanguage} from "../bundle";
import {pathToCodeLanguage} from "../language";
import {axiosErrorToErrorList, axiosResponseToStringList} from "../../api/api";
import {
  FileContentType,
  getFileContentType,
  getFileType,
  getFileTypeFromPath,
  getImportLookupPath,
  joinFileParts
} from "../../utils/path";
import * as esbuild from "esbuild-wasm";
import {getLoadResult} from "../../bundler/plugins/loadFile";
import {ApiFlowOperation, ApiFlowResource} from "../api";
import {ApplicatonStatePartial} from "../application";
import {delayTimer} from "../../utils/delay";
import {convertStrToUint8, getZipBlobSync} from "../../utils/zip";
import {createDiff} from "../../utils/diff";
import {getProjectEntryPath, getProjectFromLocalId} from "../helpers/project-helpers";
import {PackageDetectResult} from "../../bundler/plugins/package";
import {getPkgServer} from "../../api/servers";
import {getRegexMatches} from "../../utils/regex";
import {htmlNoScript} from "../../components/preview-section/preview-iframe/markup";
import {getProjectFiles, getProjectFilesForPath} from "../helpers/file-helpers";
import {deleteScriptEntryPathFromHtml} from "../../utils/markup";

const apiForceDelay = false;
const apiDelayMs = 1000;

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

export const createCellBundle = (cellId:string, input:string, bundleLanguage: BundleLanguage, treeShaking: boolean, minify: boolean) => {
  return async (dispatch:Dispatch<Action>) => {
      dispatch({
          type: ActionType.CELL_BUNDLE_START,
          payload: {
              cellId,
          }
      });

      const result = await bundleCodeStr(cellId, input, bundleLanguage, treeShaking, minify);

      dispatch({
          type: ActionType.CELL_BUNDLE_COMPLETE,
          payload: {
              cellId,
              bundle: result
          }
      });
  };
}


export const resetBundles = ():ResetBundlesAction => {
  return {
    type: ActionType.RESET_BUNDLES
  }
}

export const initializeBundler = () => {
  return async (dispatch:Dispatch<Action>, getState:() => RootState) => {
    await initializeEsbuildBundler();
    dispatch(updateApplication({bundlerReady: true}));
  }
}

export const bundleProject = (localId:string) => {
  return async (dispatch:Dispatch<Action>, getState:() => RootState) => {
    const reduxProject = getProjectFromLocalId(getState().projects, localId);

    if (!getState().application.bundlerReady ) {
      console.log(`Error! could not build project '${reduxProject.title.padEnd(20)}', bundler is not ready`);
      return;
    }

    const currentUser = getState().auth.currentUser;

    dispatch(updateProject({localId: reduxProject.localId, bundleLocalId: reduxProject.localId}));

    const entryFile = getState().files.data[reduxProject.entryFileLocalId];
    if (!entryFile) {
      console.log(`entry file not found for project '${reduxProject.title}'`);
      return;
    }
    if (debugRedux) {
      console.log(`bundleProject(): `, reduxProject, entryFile);
    }

    // Earlier entryPath was reduxProject.entry_path
    const entryPath = entryFile.path;


    // We have used entry_path as it is the path on the server that matters!
    const bundleLanguage = pathToBundleLanguage(entryPath)

    if (bundleLanguage !== BundleLanguage.UNKNOWN) {
      if (currentUser) {
        // The project entry path is hard coded for media folder. Need to make it more flexible when need arises.
        // TBD: Remove the hardcoding of the project path
        const projectPath = `mediafiles/user_${currentUser.pkid}/${reduxProject.folder}`;
        // TBD: The entry_path should come from the front-end as now it lags behind

        // In case the bundling has been initiated due to file name change of entry file then we need local.
        console.log("bundleProject: ", reduxProject)

        createProjectBundle(reduxProject, projectPath, `${entryPath}`, bundleLanguage, reduxProject.treeShaking, reduxProject.minify)(dispatch, getState);
      }
    } else {
      console.error(`Error! file type ${getFileTypeFromPath(entryPath)} not supported`)
    }

  }
}

// Example params:
// projectDirPath: 'mediafiles/user_72/first'
// entryFile: 'src/index.jsx'
export const createProjectBundle = (
    reduxProject: ReduxProject,
    projectDirPath:string,
    entryFile:string,
    bundleLanguage: BundleLanguage,
    treeShaking: boolean,
    minify: boolean,
) => {
  return async (dispatch:Dispatch<Action>, getState:() => RootState) => {

    if (debugBundler || debugRedux) {
      console.log(`createProjectBundle: projectDirPath:'${projectDirPath}' entryFile:'${entryFile}'`);
    }

    const filesLocalIdMap = getState().files.data;
    const projectFileMap = Object.fromEntries(
        Object.entries(filesLocalIdMap)
            .filter(([k, v]) => v.projectLocalId === reduxProject.localId)
            .map(([k, v]) => {
              const lookupPath = getImportLookupPath(v.path);
              return [lookupPath, v]
            })
    );
    if (debugPlugin || debugRedux || false) {
      console.log(`projectFileMap:`, projectFileMap);
    }

    // We define a function closure as it needs getState() from getting files for project
    const getLoadResultFromRedux = async (url:string):Promise<esbuild.OnLoadResult|null> => {
      if (debugPlugin || debugRedux || false) {
        console.log(`getFileContentsFromRedux: url:`, url);
      }

      // Create a new map based on filepath instead of id
      // We use projectDirPath e.g. 'mediafiles/user_72/first' as separator
      // So for  http://api.local.webappstarter.com/mediafiles/user_72/first/src/index.jsx
      // we will get [' http://api.local.webappstarter.com/', 'src/index.jsx']
      const fileParts = url.split(projectDirPath + '/');

      // Example: http://api.local.webappstarter.com/mediafiles/user_67/react-project/src/index.js
      // ['http://api.local.webappstarter.com/', 'src/index.js']
      const reduxFilePath = fileParts[1];
      const lookupPath = getImportLookupPath(reduxFilePath);
      const reduxFile = projectFileMap[lookupPath];

      let result: esbuild.OnLoadResult | null = null;
      if (reduxFile) {
        if (debugPlugin || debugRedux || false) {
          console.log(`${reduxFilePath}: File:`, reduxFile);
          console.log(`${reduxFilePath}: File Contents:`, reduxFile.content);
        }

        let content = reduxFile.content;
        let resolveDir = new URL('./', url).pathname;

        if (content === null) {
          // const {data, request} = await axiosInstance.get(url);
          // We should be using cache here or we should be using loadFileUrl
          // We can make fetchFileContents to use loadFileUrl
          const responses = await fetchFileContents([reduxFile.localId])(dispatch, getState);

          if (responses) {
            responses.forEach(({response, reduxFile}) => {
              const {request} = response;

              if (request.responseText) {
                content = request.responseText;
              }

              resolveDir = new URL('./', request.responseURL).pathname;
              // console.log(`getLoadResultFromRedux(): resolveDir:`, resolveDir);
              dispatch(updateFile({localId: reduxFile.localId, resolveDir}));
            })
          }
        } else {
          if (reduxFile.resolveDir) {
            resolveDir = reduxFile.resolveDir;
          }
        }

        const fileType = getFileType(reduxFile.path);
        if (content) {
          result = getLoadResult(content, fileType, reduxFile);
          result.resolveDir = resolveDir;
        }

        if (debugPlugin || false) {
          console.log(`[lookupPath:${lookupPath}] [${reduxFilePath}] result:`, result);
        }
      } else {
        console.log(`File path ${reduxFilePath} not found in redux. This condition leads to error generated by bundler`);
      }

      return result;
    }

    // This should be read in the fileFetchContents
    let packageDependencyMap;
    if (reduxProject.packageConfig) {
      packageDependencyMap = reduxProject.packageConfig.dependencies;
    } else {
      // console.log(`Package Dependency map not available`);
    }

    if (debugPlugin || debugRedux) {
      console.log(`Package Dependency Map:`, packageDependencyMap);
    }

    const getPackageVersion = (pkgPath:string):PackageDetectResult => {
      // console.log(`getPackageVersion: pkgName:${pkgName}`);
      let pkgDetectionResult = {url: `${getPkgServer()}/${pkgPath}`} as PackageDetectResult;

      if (packageDependencyMap) {
        for (const k of Object.keys(packageDependencyMap)) {
          // We look for patterns "react", "react-dom" etc or "react-dom/client" etc as well
          const pkgLookupRegex = new RegExp(`${k}(?:\/(.*))?$`);
          const matches = getRegexMatches(pkgLookupRegex, pkgPath);

          // We have found the package
          if (matches) {
            const [fullPath, suffixPath] = matches;
            // console.log(`pkgLookup: matches:`, fullPath, suffixPath);

            const version = packageDependencyMap[k];
            // console.log(`getPackageVersion(): found '${k}' version '${version}'`);

            pkgDetectionResult = {
              name: k,
              version,
            } as PackageDetectResult;

            if (k === pkgPath) {
              pkgDetectionResult.url = `${getPkgServer()}/${k}@${version}`;
            } else {
              const suffixPath = pkgPath.substring(k.length);
              pkgDetectionResult.url = `${getPkgServer()}/${k}@${version}${suffixPath}`;
              pkgDetectionResult.suffixPath = suffixPath;
            }
          }
        }
      }

      return pkgDetectionResult;
    };

    const setPackageVersion = (pkgName:string, version:string) => {
      // console.log(`setPackageVersion: pkg:${pkgName} version:`, version);
      if (packageDependencyMap) {
        if (!packageDependencyMap[pkgName]) {
          packageDependencyMap = {...packageDependencyMap, [pkgName]: version};
        }
      }
    };

    dispatch({
        type: ActionType.PROJECT_BUNDLE_START,
        payload: {
            projectLocalId: reduxProject.localId,
        }
    });

    // console.log(`serverMediaBaseUrl:`, serverMediaBaseUrl);
    const projectRootUrl = (new URL(projectDirPath, serverMediaBaseUrl)).toString();
    // console.log(`projectUrl:`, projectRootUrl);
    const entryUrl = (new URL(joinFileParts(projectDirPath, entryFile), serverMediaBaseUrl)).toString();
    // console.log(`entryUrl:`, entryUrl);

    const result:BundleResult = await bundleFilePath(
        reduxProject.title,
        entryUrl,
        bundleLanguage,
        treeShaking,
        minify,
        getLoadResultFromRedux,
        getPackageVersion,
        setPackageVersion,
        projectRootUrl
    );

    dispatch({
        type: ActionType.PROJECT_BUNDLE_COMPLETE,
        payload: {
            projectLocalId: reduxProject.localId,
            bundle: result
        }
    });

    if (debugPlugin || debugRedux) {
      console.log(`Package Dependency Map Post Bundling:`, packageDependencyMap);
    }

    dispatch(updateProject({localId:reduxProject.localId, bundleDirty:false, bundleResult:result}));
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


// Called from ProjectListGrid
export const fetchProjectsAndFiles = () => {
  return async (dispatch: Dispatch<Action>, getState: () => RootState) => {
    // console.log(getState().auth);
    try {
      const projects = await fetchProjects()(dispatch, getState);
      // console.log(`fetchProjectsAndFiles: projects:`, projects);
      if (projects) {
        // Adding await here delay the program start by around 5 seconds
        fetchFiles()(dispatch, getState);
      }
    } catch (err) {
      console.log(`fetchProjectsAndFiles: err:`, err);
    }
  };
}

export const fetchProjects = () => {
  return async (dispatch: Dispatch<Action>, getState: () => RootState) => {
    dispatch({type:ActionType.FETCH_PROJECTS_START, payload:{reset:true}})
    try {
      const {data:projects}: {data: ReduxProject[]} = await axiosApiInstance.get(`/projects/`, );
      dispatch({
        type: ActionType.FETCH_PROJECTS_COMPLETE,
        payload: projects
      });
      dispatch({type: ActionType.UPDATE_APPLICATION, payload: {projectsLoaded: true}});
      return projects;
    } catch (err) {
      // console.log(`fetchProjects: err({message, response})`, err.message, err.response);
      if (err.response.status === 401) {
        const currentUser = getState().auth.currentUser;
        console.log(`fetchProjects: We need to auth using refreshToken or login page`);
        dispatch(userUpdate(currentUser.localId, {tokenExpired: true} as ReduxUpdateUserPartial));
      }
      if (err instanceof Error) {
        dispatch({
          type: ActionType.FETCH_PROJECTS_ERROR,
          payload: err.message
        });
      }
    }
  };
}

export const resetProjects = ():ResetProjectsAction => {
  return {
    type: ActionType.RESET_PROJECTS
  }
}

export const createProjectOnServer = (projectPartial: ReduxCreateProjectPartial) => {
  return async (dispatch: Dispatch<Action>, getState: () => RootState) => {
    const reqId = generateLocalId();
    dispatch(apiRequestStart(reqId, ApiFlowResource.PROJECT, ApiFlowOperation.POST));

    // We need to create form-data as we are supporting upload zip file as well
    const {localId} = projectPartial;

    const formData = new FormData();
    formData.append("title", projectPartial.title);
    formData.append("description", projectPartial.description);

    if (projectPartial.startConfigType === StartConfigType.PROJECT_ZIP) {
      if (!projectPartial.file) {
        console.error(`upload file is ${projectPartial.file} for startConfigType ${projectPartial.startConfigType}`);
      }
      formData.append("file", projectPartial.file);
    }

    formData.append("template", projectPartial.template);
    formData.append("framework", projectPartial.framework);
    formData.append("toolchain", projectPartial.toolchain);

    try {
      const response = await axiosApiInstance.post(`${gApiUri}/projects/`, formData, {headers: __rm__gHeaders});
      const {files, ...rest} = response.data

      if (debugAxios) {
        console.log(response.data);
      }
      const messages = [response.data.detail];
      dispatch(apiRequestSuccess(reqId, messages));

      // TBD: For now we will hard code the entry_html_path to 'index.html'
      dispatch(updateProject({localId, ...rest, entry_html_path: 'index.html', synced:true, confirmed: true}));

      const updatedProject = getProjectFromLocalId(getState().projects, localId);
      await fetchFiles(updatedProject)(dispatch, getState);
    } catch (err) {
      if (err instanceof AxiosError) {
        if (debugRedux ||true) {
          console.error(`Error! activate unsuccessful err:`, err);
        }
        let errors = ['API Failed']
        if (err.response) {
          errors = axiosResponseToStringList(err.response);
          if (debugRedux||true) {
            console.error(`Error! activate unsuccessful errors:`, errors);
          }
        }
        dispatch(apiRequestFailed(reqId, errors))
      } else {
        console.error(err);
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

export const downloadProjectBuildZip = (localId:string) => {
  return async (dispatch: Dispatch<Action>, getState: () => RootState) => {
    const projectState = getState().projects.data[localId];
    if (!projectState) {
      console.error(`Error! project id '${localId}' not found in store`)
    }

    dispatch(updateProject({localId, downloadingZip: true, zipBlob: null}));

    if (apiForceDelay) {
      await delayTimer(apiDelayMs);
    }

    // Here we need to build the projectBuildMap
    // We need a list of files that is to be bundled. This is typically specified in package.json
    // So there is going to be a shadow package.json
    // So now we would be using package.json[files] apart from package.json[dependencies]
    // If the files is not specified then the default would be
    // For create-react-app:
    // build/*
    // The static files are in build/static and they are hashed
    // For vite react:
    // dist/*
    // The static files are in dist/assets and they are hashed

    // So it becomes important for us that we detect the template.
    // In case we can't detect the template then we ask the user to select.
    // In case the user doesn't adhere to the template then we inform him about the faced errors.

    // There is different html that is used for the source and the build
    // The one used with build has the hashes.
    const getHtmlContent = (indexJsPath) => {
      return `
<html>
  <head></head>
  <body>
    <div id="root"></div>
    <script src="${indexJsPath}"></script>
  </body>
</html>`;
    }

    const getBuildHtmlContent = (htmlContent, indexJsPath) => {
      return htmlContent.replace('</body>', `  <script src="${indexJsPath}"></script>\n</body>`);
    }

    // We shall have a common and well accepted layout for the files
    const fileHash = generateLocalId();
    const indexJsPath = `dist/index-${fileHash}.js`;

    // We should be taking the specified html file and injecting the line to add the script.
    // const indexHtmlContent = getHtmlContent(indexJsPath);
    const projectEntryPath = getProjectEntryPath(projectState);
    const resultHtml = deleteScriptEntryPathFromHtml(projectState.htmlContent, projectEntryPath, 'build-zip');
    const indexHtmlContent = getBuildHtmlContent(resultHtml, indexJsPath);
    const indexJsContent = projectState.bundleResult.code;

    let buildFiles = [
      ['index.html', convertStrToUint8(indexHtmlContent)],
      [indexJsPath, convertStrToUint8(indexJsContent)]
    ];

    const includePaths = ['public/'];

    for (const incPath of includePaths) {
      const publicFolderFiles = getProjectFilesForPath(getState().files, localId, incPath);
      console.log(`publicFolderFiles:`, publicFolderFiles);
      publicFolderFiles.forEach(([k,v]) => {
        const filePath = v.path.substring(incPath.length);
        let fileContent = v.content || '';

        if (getFileContentType(v.path) === FileContentType.IMAGE) {
          buildFiles.push([filePath, fileContent])
        } else {
          // We have already put the index.html
          if (filePath !== 'index.html') {
            buildFiles.push([filePath, convertStrToUint8(fileContent)])
          }
        }
      });
    }

    const projectBuildFilepathContentMap = Object.fromEntries(buildFiles);
    const compressed = getZipBlobSync(projectBuildFilepathContentMap);
    const zipBlob = new Blob([compressed.buffer], { type: 'application/octet-stream' });

    dispatch(updateProject({localId, downloadingZip: false, zipBlob}));
  }
}

export const downloadProjectSourceZip = (localId:string, zipLocal:boolean = false) => {
  return async (dispatch: Dispatch<Action>, getState: () => RootState) => {
    const projectState = getState().projects.data[localId];
    if (!projectState) {
      console.error(`Error! project id '${localId}' not found in store`)
    }

    dispatch(updateProject({localId, downloadingZip: true, zipBlob: null}));

    const {pkid} = projectState;

    let zipBlob:Blob|null = null;
    try {
      if (!zipLocal) {
        const response = await axiosApiInstance.get(
            `/projects/${pkid}/download/`,
            {responseType: 'blob'}
        );
        if (debugRedux) {
          console.log(response);
        }
        zipBlob = response.data;
      } else {
        if (apiForceDelay) {
          await delayTimer(apiDelayMs);
        }

        // Create filepathContentPath where key in file.path and value is file.content
        const projectFilepathContentMap = Object.fromEntries(
            // Get files that belong to project and then provide [file.path, file.content] item
            getProjectFiles(getState().files, localId).map(([k,v]) => {
              // if (!v.content) {
              //   console.log(`file ${k} contents are`, v);
              // }
              let fileContent:any = v.content || '';
              if (getFileContentType(v.path) !== FileContentType.IMAGE) {
                fileContent = convertStrToUint8(fileContent);
              }

              return [v.path, fileContent];
            })
        );

        if (debugRedux) {
          Object.entries(projectFilepathContentMap).map(([k, v]) => console.log(k, v));
        }

        // const bytes = fflate.strToU8("I can be a huge file");
        // const compressed = fflate.gzipSync(bytes, {level:6});
        // const compressed = getSampleZipBlobSync();

        const compressed = getZipBlobSync(projectFilepathContentMap);
        zipBlob = new Blob([compressed.buffer], { type: 'application/octet-stream' });
      }

      dispatch(updateProject({localId, downloadingZip: false, zipBlob}));
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

export const deleteFile = (localId:string): DeleteFileAction => {
  return {
    type: ActionType.DELETE_FILE,
    payload: localId
  }
}

//
export const fetchFiles = (project?:ReduxProject) => {
  return async (dispatch: Dispatch<Action>, getState: () => RootState) => {
    try {
      const fetchFilesPayload = {reset:true};
      if (project) {
        fetchFilesPayload['projectLocalId'] = project.localId
      }
      dispatch({type: ActionType.FETCH_FILES_START, payload:fetchFilesPayload});

      // Later we can created a combined object
      let params:{[k:string]:string|number} = {};
      if (project) {
        params['project'] = project.pkid;
      }
      const {data}:{data:ReduxFile[]} = await axiosApiInstance.get(`/files/`, {params});

      // console.log(getState().projects.data);
      const projectsPkidToLocalIdMap:{[n: number]:string} = Object.entries(getState().projects.data).reduce((acc:{[n:number]:string}, [localId,project]) => {
        acc[project.pkid] = localId;
        return acc;
      }, {});
      // console.log(projectsPkidToLocalIdMap);


      // We need to do change this once we create a combined or server object
      const projectsFound = [];

      const files = data.map((file) => {
        file.localId = generateLocalId();

        // file.project is the project pkid
        if (file.project) {
          file.projectLocalId = projectsPkidToLocalIdMap[file.project]; // This should be projectLocalId
          if (file.projectLocalId) {
            projectsFound.push(file.projectLocalId);
          }

          file.isEntryPoint = file.is_entry_point;
          file.bundleLanguage = pathToBundleLanguage(file.path);
          file.language = pathToCodeLanguage(file.path);

          // TBD: The dispatches should be combined
          if (file.isEntryPoint) {
            dispatch(updateProject({localId: file.projectLocalId, entryFileLocalId: file.localId}));
          }

          // TBD: Hardcoding to be removed entry_html_path hardcoding
          if (file.path === 'index.html') {
            dispatch(updateProject({localId: file.projectLocalId, entryHtmlFileLocalId: file.localId, toolchain: ReactToolchains.VITE}));
          } else if (file.path === "public/index.html") {
            dispatch(updateProject({localId: file.projectLocalId, entryHtmlFileLocalId: file.localId, toolchain: ReactToolchains.CREATE_REACT_APP}));
          } else if (file.path === 'webapp.json') {
            dispatch(updateProject({localId: file.projectLocalId, packageFileLocalId: file.localId}));
          }
        }
        return file;
      });

      dispatch({
        type: ActionType.FETCH_FILES_COMPLETE,
        payload: files,
      });

      projectsFound.forEach(projectLocalId => {
        dispatch(updateProject({localId:projectLocalId, filesSynced:true}));
      })

      if (!project) {
        dispatch({type: ActionType.UPDATE_APPLICATION, payload: {filesLoaded: true}});
      } else {
        const projectLocalId = projectsPkidToLocalIdMap[project.pkid];
        dispatch(updateProject({localId:projectLocalId, filesSynced:true}));
      }
    } catch (err) {
      throw err;
      if (err instanceof Error) {
        dispatch({
          type: ActionType.FETCH_FILES_ERROR,
          payload: err.message
        });
      }
    }
  };
}

export const deleteFiles = (projectLocalId?:string):DeleteFilesAction => {
  return {
    type: ActionType.DELETE_FILES,
    payload: {
      projectLocalId
    }
  }
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
      const _createFilePartial:ReduxCreateFilePartial = {...fileState};

      // We generate blob when the fileState has content
      if (Object.keys(_createFilePartial).includes('content')) {
        _createFilePartial.localFile = createFileFromString(fileState.content || '', fileState.localId);
      }

      createFileOnServer(_createFilePartial)(dispatch, getState);
    } else {
      if (fileState.modifiedKeys.length > 0) {
        const _updateFilePartial: ReduxUpdateFilePartial = {localId};

        for (const key of fileState.modifiedKeys) {
          if (key !== 'content') {
            // @ts-ignore
            _updateFilePartial[key] = fileState[key];
          } else {
            if (enableDiffForFileUpdate) {
              if (fileState.prevContent && fileState.content) {
                const diffText = createDiff(fileState.prevContent, fileState.content);
                if (debugRedux) {
                  console.log(`diffText:\n`, diffText);
                }
                _updateFilePartial.contentDiff = diffText;
              }
            }
            _updateFilePartial.localFile = createFileFromString(fileState.content || '', fileState.localId);
          }
        }

        updateFileOnServer(pkid, _updateFilePartial)(dispatch, getState);
      }
    }
  }
}

export const makeProjectIdeReady = (localId: string) => {
  return async (dispatch: Dispatch<Action>, getState: () => RootState) => {
    const reduxProject = getProjectFromLocalId(getState().projects, localId);

    if (debugRedux) {
      console.log(`makeProjectIdeReady(): reduxProject:`, reduxProject);
    }

    let projectUpdatePartial:ReduxUpdateProjectPartial = {localId};

    const ideFiles = [
      reduxProject.entryFileLocalId
    ];

    if (reduxProject.entryHtmlFileLocalId) {
      ideFiles.push(reduxProject.entryHtmlFileLocalId);
    } else {
      projectUpdatePartial.htmlContent = htmlNoScript;
    }

    if (reduxProject.packageFileLocalId) {
      ideFiles.push(reduxProject.packageFileLocalId);
    }

    const responses = await fetchFileContents(ideFiles)(dispatch, getState);
    if (responses) {
      responses.forEach(({response, reduxFile}) => {
        // console.log(response, reduxFile);

        if (reduxProject.entryHtmlFileLocalId === reduxFile.localId) {
          projectUpdatePartial.htmlContent = response.data;
        }
        if (reduxProject.packageFileLocalId === reduxFile.localId) {
          const pkgConfig = JSON.parse(response.request.responseText) as PackageConfig;
          // console.log(JSON.stringify(pkgConfig, null, 2));
          projectUpdatePartial.packageConfig = pkgConfig;
        }
        projectUpdatePartial.ideReady = true;

        dispatch(updateProject(projectUpdatePartial));
      });
    } else {
      console.error(`Error downloading files`);
    }
  }
}

export const removeFile = (localId:string) => {
  return async (dispatch: Dispatch<Action>, getState: () => RootState) => {
    if (debugRedux) {
      console.log(`removeFile:`, localId);
    }

    const fileState = getState().files.data[localId];
    if (!fileState) {
      console.error(`Error! file id '${localId}' not found in store`)
      return;
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


const fetchContent = (reduxFile) => {
  return new Promise((resolve, reject) => {
    const options = {};
    if (getFileContentType(reduxFile.path) === FileContentType.IMAGE) {
      options['responseType'] = 'arraybuffer';
    }
    axiosApiInstance.get(reduxFile.file!.replace('localhost', 'localhost:8080'), options)
        .then(response => resolve({response, reduxFile}))
        .catch(reject);
  })
}

// Download File
export const fetchFileContents = (localIds: string[]) => {
  // console.log(`fetchFileContents:`, localIds);

  return async (dispatch: Dispatch<Action>, getState: () => RootState) => {
    if (debugRedux) {
      console.log(`fetchFileContents: ${localIds[0]}`);
    }

    if (!localIds || localIds.length < 1) {
      console.log('fetchFileIds(): No ids specified');
      return;
    }

    const reduxFiles = Object.entries(getState().files.data).filter(([k,v]) => localIds.includes(k)).map(([k, v]) => v);
    // console.log(`reduxFiles:`, reduxFiles);
    // const reduxFile = reduxFiles[0];

    reduxFiles.forEach(rFile => {
      dispatch({
        type: ActionType.UPDATE_FILE,
        payload: {
          localId: rFile.localId,
          requestInitiated: true,
        }
      });
    })


    try {
      const responses = await Promise.all(reduxFiles.map(rFile => fetchContent(rFile)))

      responses.forEach(({response, reduxFile}, index) => {
        const {request, data} = response;

        if (debugRedux || false) {
          console.log(`fetchFileContents: `, response, response.headers['content-type']);
        }


        let content;
        if (getFileContentType(reduxFile.path) === FileContentType.IMAGE) {
          content = new Uint8Array(data);
        } else {
          content = request.responseText;
        }

        if (debugRedux || false) {
          console.log(`fetchFileContents: ${reduxFile.path}`, typeof(content), content.length);
        }


        dispatch({
          type: ActionType.UPDATE_FILE,
          payload: {
            localId: reduxFile.localId,
            content,
            prevContent: content,
            contentSynced: true,
            isServerResponse: true,
            requestInitiated: false,
          }
        });
      });

      return responses;
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
    if (debugRedux) {
      console.log(`fileCreatePartial:`, fileCreatePartial);
    }

    const {localId} = fileCreatePartial;

    const formData = new FormData();
    formData.append("path", fileCreatePartial.path || '');
    formData.append("file", fileCreatePartial.localFile!);
    formData.append("language", fileCreatePartial.language);
    formData.append("is_entry_point", fileCreatePartial.isEntryPoint! as unknown as string);

    if (fileCreatePartial.projectLocalId) {
      const project = getState().projects.data[fileCreatePartial.projectLocalId];
      if (debugRedux && false) {
        console.log(project)
      }
      if (project.pkid > 0) {
        formData.append("project", project.pkid as unknown as string); // We could use pkid as well
      }
    }

    const reqId = generateLocalId();
    dispatch(apiRequestStart(reqId, ApiFlowResource.FILE, ApiFlowOperation.POST));

    try {
      const response = await axiosApiInstance.post(`${gApiUri}/files/`, formData, {headers: __rm__gHeaders});
      if (debugRedux) {
        console.log(response);
      }

      const fileState = getState().files.data[localId] as ReduxFile;

      // const {id, pkid} = response.data
      // We are putting pkid in the id
      // We can put a field here response t
      dispatch(updateFile({
        localId,
        isServerResponse: true,
        synced:true,
        prevContent: fileState.content,
        language: pathToCodeLanguage(response.data.path), // Need to be fixed
        ...response.data
      })); //

      const messages = ["File created"];
      dispatch(apiRequestSuccess(reqId, messages));

      const {projectLocalId, isEntryPoint, path}  = fileCreatePartial;
      if (projectLocalId) {
        if (isEntryPoint) {
          if (debugRedux) {
            console.log(`file['${localId}'] path:${path} is an entry point for project['${projectLocalId}']`);
          }

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
      if (err instanceof AxiosError) {
        console.error(`Error! ${err.message}`);
        dispatch(deleteFile(localId))

        let errors = ['API Failed'];
        if (err.response) {
          errors = axiosResponseToStringList(err.response);
          if (debugRedux||true) {
            console.error(`Error! activate unsuccessful errors:`, errors);
          }
        }
        dispatch(apiRequestFailed(reqId, errors));
      }
    }
  }
}


export const updateFileOnServer = (pkid:number, updateFilePartial: ReduxUpdateFilePartial) => {
  return async (dispatch: Dispatch<Action>, getState: () => RootState) => {
    if (debugRedux) {
      console.log('updateFilePartial:', updateFilePartial);
    }

    const formData = new FormData();
    if (Object.keys(updateFilePartial).includes('path')) {
      formData.append("path", updateFilePartial.path!);
    }
    if (Object.keys(updateFilePartial).includes('localFile')) {
      formData.append("file", updateFilePartial.localFile!);
    }
    if (Object.keys(updateFilePartial).includes('language')) {
      formData.append("language", updateFilePartial.language!);
    }
    if (Object.keys(updateFilePartial).includes('isEntryPoint')) {
      formData.append("is_entry_point", updateFilePartial.isEntryPoint! as unknown as string);
    }
    if (Object.keys(updateFilePartial).includes('contentDiff')) {
      formData.append("content_diff", updateFilePartial.contentDiff!);
    }

    const {localId} = updateFilePartial;

    const reqId = generateLocalId();
    dispatch(apiRequestStart(reqId, ApiFlowResource.FILE, ApiFlowOperation.PATCH));

    try {
      const response = await axiosApiInstance.patch(`${gApiUri}/files/${pkid}/`, formData, {headers: __rm__gHeaders});
      if (debugRedux) {
        console.log(response);
      }

      const messages = ["File updated"];
      dispatch(apiRequestSuccess(reqId, messages));

      const fileState = getState().files.data[localId] as ReduxFile;

      // const {id, pkid} = response.data
      // We are putting pkid in the id
      // We can put a field here response t
      dispatch(updateFile({
        localId,
        isServerResponse: true,
        synced:true,
        prevContent: fileState.content,
        ...response.data
      })); //


      const {is_entry_point, path} = updateFilePartial;

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
      if (err instanceof AxiosError) {
        console.error(`Error! ${err.message}`);

        let errors = ['API Failed'];
        if (err.response) {
          errors = axiosResponseToStringList(err.response);
          if (debugRedux||true) {
            console.error(`Error! activate unsuccessful errors:`, errors);
          }
        }
        dispatch(apiRequestFailed(reqId, errors));
      }
    }
  }
}

export const deleteFileFromServer = (pkid:number, deleteFilePartial: ReduxDeleteFilePartial) => {
  return async (dispatch: Dispatch<Action>, getState: () => RootState) => {
    if (debugRedux) {
      console.log('deleteFilePartial:', deleteFilePartial);
    }

    const {localId} = deleteFilePartial;
    const reqId = generateLocalId();
    dispatch(apiRequestStart(reqId, ApiFlowResource.FILE, ApiFlowOperation.DELETE));

    try {
      const response = await axiosApiInstance.delete(`${gApiUri}/files/${pkid}/`,{headers: __rm__gHeaders});
      if (debugRedux) {
        console.log(response);
      }

      const messages = ["File updated"];
      dispatch(apiRequestSuccess(reqId, messages));
      
      // const {id, pkid} = response.data
      // We are putting pkid in the id
      // We can put a field here response t
      dispatch(deleteFile(localId)); //

    } catch (err) {
      if (err instanceof AxiosError) {
        console.error(`Error! ${err.message}`);

        let errors = ['API Failed'];
        if (err.response) {
          errors = axiosResponseToStringList(err.response);
          if (debugRedux||true) {
            console.error(`Error! activate unsuccessful errors:`, errors);
          }
        }
        dispatch(apiRequestFailed(reqId, errors));
      }
    }
  }
}

// In case we decide to allow multiple requests of same requestType then the request
// instance shall be identified by requestId.
export const userRequestStart = (localRequestId:string, requestType:UserFlowType): UserRequestStartAction => {
  return {
    type: ActionType.USER_REQUEST_START,
    payload: {
      id: localRequestId,
      type: requestType
    }
  }
}

// messages is used in simple APIs which don't return json but a simple string
export const userRequestSuccess = (localRequestId:string, messages:string[]): UserRequestSuccessAction => {
  return {
    type: ActionType.USER_REQUEST_SUCCESS,
    payload: {
      id: localRequestId,
      messages
    }
  }
}

// messages is used in simple APIs which don't return json but a simple string
export const userRequestFailed = (localRequestId:string, errors:string[]): UserRequestFailedAction => {
  return {
    type: ActionType.USER_REQUEST_FAILED,
    payload: {
      id: localRequestId,
      errors
    }
  }
}

// The localId for user plays a part in case we want to use multiple users in frontend
export const userAdd = (localId:string, user: ReduxUser): UserAddAction => {
  return {
    type: ActionType.USER_ADD,
    payload: user
  }
}

// The localId for user plays a part in case we want to use multiple users in frontend
export const userUpdate = (localId:string, userPartial: ReduxUpdateUserPartial): UserUpdateAction => {
  return {
    type: ActionType.USER_UPDATE,
    payload: userPartial
  }
}

// The localId for user plays a part in case we want to use multiple users in frontend
export const userDelete = (localId:string): UserDeleteAction => {
  return {
    type: ActionType.USER_DELETE,
    payload: localId
  }
}

export const reAuthenticateUserNotSupported = () => {
  console.log(`reAuthenticateUser(): `);
  // We need to fix this via a callback
  // removeAuthFromLocalStorage();
}

export const passwordResetUser = (email:string) => {
  return async (dispatch: Dispatch<Action>, getState: () => RootState) => {
    const reqId = generateLocalId();
    dispatch(userRequestStart(reqId, UserFlowType.PASSWORD_RESET))

    try {
      const response = await axiosApiInstance.post(
          `/auth/password/reset/`,
          {email}
      );

      if (debugAxios) {
        console.log(response.data);
      }
      const messages = [response.data.detail];
      console.log(messages);

      dispatch(userRequestSuccess(reqId, messages))
    } catch (err) {
      if (err instanceof AxiosError) {
        if (debugRedux ||true) {
          console.error(`Error! activate unsuccessful err:`, err);
        }
        let errors = ['Activation Failed']
        if (err.response) {
          errors = axiosResponseToStringList(err.response);
          if (debugRedux||true) {
            console.error(`Error! activate unsuccessful errors:`, errors);
          }
        }
        dispatch(userRequestFailed(reqId, errors))
      } else {
        console.error(err);
      }
    }
  };
}

export const passwordChange = (new_password1:string, new_password2:string, old_password: string) => {
  return async (dispatch: Dispatch<Action>, getState: () => RootState) => {
    // dispatch(activateRequestStart(key));
    const reqId = generateLocalId();
    dispatch(userRequestStart(reqId, UserFlowType.PASSWORD_RESET_CONFIRM));

    try {
      const response = await axiosApiInstance.post(
          `/auth/password/change/`,
          {new_password1, new_password2, old_password}
      );

      if (debugAxios) {
        console.log(response.data);
      }
      const messages = [response.data.detail];
      console.log(messages);

      // dispatch(activateRequestSuccess(messages));
      dispatch(userRequestSuccess(reqId, messages));
    } catch (err) {
      if (err instanceof AxiosError) {
        if (debugRedux || true) {
          console.error(`Error! activate unsuccessful err:`, err);
        }
        let errors = ['Activation Failed']
        if (err.response) {
          errors = axiosErrorToErrorList(err, true);
          if (debugRedux || true) {
            console.error(`Error! activate unsuccessful errors:`, errors);
          }
        }
        // dispatch(activateRequestFailed(errors));
        dispatch(userRequestFailed(reqId, errors));
      } else {
        console.error(err);
      }
    }
  };
}

export const passwordResetConfirmUser = (uid:string, token:string, new_password1:string, new_password2:string) => {
  return async (dispatch: Dispatch<Action>, getState: () => RootState) => {
    // dispatch(activateRequestStart(key));
    const reqId = generateLocalId();
    dispatch(userRequestStart(reqId, UserFlowType.PASSWORD_RESET_CONFIRM));

    try {
      const response = await axiosApiInstance.post(
          `/auth/password/reset/confirm/`,
          {uid, token, new_password1, new_password2}
      );

      if (debugAxios) {
        console.log(response.data);
      }
      const messages = [response.data.detail];
      console.log(messages);

      // dispatch(activateRequestSuccess(messages));
      dispatch(userRequestSuccess(reqId, messages));
    } catch (err) {
      if (err instanceof AxiosError) {
        if (debugRedux ||true) {
          console.error(`Error! activate unsuccessful err:`, err);
        }
        let errors = ['Activation Failed']
        if (err.response) {
          errors = axiosErrorToErrorList(err, true);
          if (debugRedux||true) {
            console.error(`Error! activate unsuccessful errors:`, errors);
          }
        }
        // dispatch(activateRequestFailed(errors));
        dispatch(userRequestFailed(reqId, errors));
      } else {
        console.error(err);
      }
    }
  };
}

export const activateUser = (key:string) => {
  return async (dispatch: Dispatch<Action>, getState: () => RootState) => {
      // dispatch(activateRequestStart(key));
      const activateReqLocalId = generateLocalId();
      dispatch(userRequestStart(activateReqLocalId, UserFlowType.CONFIRM_EMAIL));

      try {
        const response = await axiosApiInstance.post(`/auth/registration/verify-email/`, {key});

        const messages = ['API user activation successful'];

        // await authenticationSuccess(reduxUser, messages)(dispatch, getState);
        dispatch(userRequestSuccess(activateReqLocalId, messages));
      } catch (err) {
        if (err instanceof AxiosError) {
          if (debugRedux ||true) {
            console.error(`Error! activate unsuccessful err:`, err);
          }
          let errors = ['Activation Failed']
          if (err.response) {
            errors = axiosResponseToStringList(err.response);
            if (debugRedux||true) {
              console.error(`Error! activate unsuccessful errors:`, errors);
            }
          }

          dispatch(userRequestFailed(activateReqLocalId, errors));
        } else {
          console.error(err);
        }
      }
  };
}


// We need to fix the flow in this now.
// There are too many functions. Also the resend email API doesn't return failure for non-existent emails
export const resendActivationEmail = (email:string) => {
  return async (dispatch: Dispatch<Action>, getState: () => RootState) => {
    // dispatch(activateRequestStart(key));
    const resendReqLocalId = generateLocalId();
    dispatch(userRequestStart(resendReqLocalId, UserFlowType.RESEND_CONFIRMATION_EMAIL));

    try {
      const response = await axiosApiInstance.post(`/auth/registration/resend-email/`, {email});

      // console.log(response);

      // dispatch(activateRequestSuccess(messages));
      const messages = ["Activation email sent"];
      dispatch(userRequestSuccess(resendReqLocalId, messages))
    } catch (err) {
      if (err instanceof AxiosError) {
        if (debugRedux ||true) {
          console.error(`Error! activate unsuccessful err:`, err);
        }
        let errors = ['Activation Failed']
        if (err.response) {
          errors = axiosResponseToStringList(err.response);
          if (debugRedux||true) {
            console.error(`Error! activate unsuccessful errors:`, errors);
          }
        }
        // dispatch(activateRequestFailed(errors));
        dispatch(userRequestFailed(resendReqLocalId, errors))
      } else {
        console.error(err);
      }
    }
  };
}


export const authenticationSuccess = (user:ReduxUser, messages:string[]) => {
  return async (dispatch: Dispatch<Action>, getState: () => RootState) => {
    if (debugRedux || debugAuth) {
      console.log(`Login successful messages:`, messages, user);
    }

    setAxiosAuthToken(user.accessToken);

    // isAuthenticated should be set at the end
    const userLocalId = generateLocalId();
    dispatch(userAdd(userLocalId, user));
  }
}

// TBD: Actually this should not be here
export const authenticateUserFromLocalStorage = () => {
  return async (dispatch: Dispatch<Action>, getState: () => RootState) => {
    if (enableLocalStorageAuth) {
      const user = fetchAuthFromLocalStorage();
      if (debugAuth) {
        console.log(user);
      }
      if (user) {
        const messages = ['LocalStorage user retrieved successfully'];
        await authenticationSuccess(user, messages)(dispatch, getState);
      }
    }
  }
}


export const authenticateUser = (email:string, password:string) => {
  return async (dispatch: Dispatch<Action>, getState: () => RootState) => {
    const loginReqLocalId = generateLocalId();
    // dispatch(loginRequestStart(email, password));
    dispatch(userRequestStart(loginReqLocalId, UserFlowType.LOGIN_USER));
    try {
      const response = await axiosApiInstance.post(`/auth/login/`, {email, password});
      const {refresh_token, access_token, user} = response.data;
      if (debugAxios) {
        console.log(refresh_token, access_token, user);
      }

      const reduxUser: ReduxUser = {
        localId: generateLocalId(),
        pkid: user.pk,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        is_anonymous: user.is_anonymous,
        accessToken: access_token,
        refreshToken: refresh_token,
        tokenExpired: false,
      };

      const messages = ['API authentication successful'];

      await authenticationSuccess(reduxUser, messages)(dispatch, getState);
      dispatch(userRequestSuccess(loginReqLocalId, messages));

      if (enableLocalStorageAuth) {
        saveAuthToLocalStorage(reduxUser);
      }
    } catch (err) {
      if (err instanceof AxiosError) {
        if (debugRedux ||true) {
          console.error(`Error! login unsuccessful err:`, err);
        }
        let errors = ['Authentication Failed']
        if (err.response) {
          errors = axiosResponseToStringList(err.response);
          if (debugRedux) {
            console.error(`Error! login unsuccessful errors:`, errors);
          }
        }
        // dispatch(loginRequestFailed(errors));
        dispatch(userRequestFailed(loginReqLocalId, errors))
      } else {
        console.error(err);
      }
    }
  };
}

export const logoutUser = (localId:string) => {
  return async (dispatch: Dispatch<Action>, getState: () => RootState) => {
    dispatch(resetBundles());
    dispatch(deleteFiles());
    dispatch(resetProjects());
    removeAuthFromLocalStorage();
    dispatch(userDelete(localId));
    unsetAxiosAuthToken()
    dispatch(resetApplication());
    // dispatch(logoutRequestStart());
    // TBD: We need to do this properly by calling API
  };
}

export const deleteUser = (localId:string) => {
  return async (dispatch: Dispatch<Action>, getState: () => RootState) => {
    const response = await axiosApiInstance.delete(`/auth/delete/`);
    if (response.status === 204) {
      logoutUser(localId)(dispatch, getState);
    }
  };
}

// export const updateUser = (userPartial: ReduxUpdateUserPartial): UpdateUserAction => {
//   // console.log(`updateUser: ${JSON.stringify(userPartial)}`);
//   return {
//     type: ActionType.UPDATE_USER,
//     payload: userPartial
//   }
// }

export const registerUser = (
    email:string,
    password1:string,
    password2: string,
    first_name: string,
    last_name: string,
) => {
  return async (dispatch: Dispatch<Action>, getState: () => RootState) => {
    const registerReqLocalId = generateLocalId();
    dispatch(userRequestStart(registerReqLocalId, UserFlowType.REGISTER_USER));

    try {
      const response = await axiosApiInstance.post(
          `/auth/registration/`,
          {email, password1, password2, first_name, last_name}
      );
      if (debugRedux) {
        console.log(`registerUser(): response:`, response);
      }
      const messages = axiosResponseToStringList(response, false);
      if (debugRedux) {
        console.log(`registerUser(): messages:`, messages);
      }
      // dispatch(registerRequestSuccess(messages));
      dispatch(userRequestSuccess(registerReqLocalId, messages))
    } catch (err) {
      if (err instanceof AxiosError) {
        if (debugRedux) {
          console.error(`Error! registration unsuccessful err:`, err);
        }
        const errors = axiosErrorToErrorList(err, false);
        if (debugRedux) {
          console.error(`Error! registration unsuccessful errors:`, errors);
        }
        // dispatch(registerRequestFailed(errors));
        dispatch(userRequestFailed(registerReqLocalId, errors));
      } else {
        console.error(err);
      }
    }
  }
}

export const apiFlowReset = (): ApiFlowReset => {
  return {
    type: ActionType.API_FLOW_RESET
  }
}

// In case we decide to allow multiple requests of same requestType then the request
// instance shall be identified by requestId.
export const apiRequestStart = (localRequestId:string, resource:ApiFlowResource, operation:ApiFlowOperation): ApiRequestStartAction => {
  return {
    type: ActionType.API_REQUEST_START,
    payload: {
      id: localRequestId,
      resource,
      operation
    }
  }
}

// messages is used in simple APIs which don't return json but a simple string
export const apiRequestSuccess = (localRequestId:string, messages:string[]): ApiRequestSuccessAction => {
  return {
    type: ActionType.API_REQUEST_SUCCESS,
    payload: {
      id: localRequestId,
      messages
    }
  }
}

// messages is used in simple APIs which don't return json but a simple string
export const apiRequestFailed = (localRequestId:string, errors:string[]): ApiRequestFailedAction => {
  return {
    type: ActionType.API_REQUEST_FAILED,
    payload: {
      id: localRequestId,
      errors
    }
  }
}

export const updateApplication = (applicationStatePartial:ApplicatonStatePartial):UpdateApplicationAction => {
  return {
    type: ActionType.UPDATE_APPLICATION,
    payload: applicationStatePartial
  }
}

export const resetApplication = ():ResetApplicationAction => {
  return {
    type: ActionType.RESET_APPLICATION
  }
}