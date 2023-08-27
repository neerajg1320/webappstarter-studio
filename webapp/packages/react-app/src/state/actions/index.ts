import { ActionType } from "../action-types";
import { CellTypes, Cell } from "../cell";
import {ReduxProject, ProjectFrameworks, ReduxUpdateProjectPartial, ReduxCreateProjectPartial} from "../project";
import {ReduxCreateFilePartial, ReduxFile, ReduxSaveFilePartial, ReduxUpdateFilePartial} from "../file";
import {ReduxUpdateUserPartial, ReduxUser} from "../user";
import {UserRequestStart, UserRequestSuccess, UserRequestFailed} from "../user";
import {ApiRequestFailed, ApiRequestStart, ApiRequestSuccess} from "../api";

export type Direction = 'up' | 'down';

export interface MoveCellAction {
    type: ActionType.MOVE_CELL;
    payload: {
        id: string;
        direction: Direction;
    }
}

export interface DeleteCellAction {
    type: ActionType.DELETE_CELL;
    payload: string
}

export interface InsertCellAfterAction {
    type: ActionType.INSERT_CELL_AFTER;
    payload: {
        id: string | null;
        type: CellTypes;
        content?: string;
        filePath?: string;
    }
}

export interface UpdateCellAction {
    type: ActionType.UPDATE_CELL
    payload: {
        id: string;
        content: string;
        filePath: string;
    }
}

export interface CellBundleStartAction {
    type: ActionType.CELL_BUNDLE_START,
    payload: {
        cellId: string,
    }
}

export interface CellBundleCompleteAction {
    type: ActionType.CELL_BUNDLE_COMPLETE,
    payload: {
        cellId: string,
        bundle: {
            code: string;
            err: string;
        }
    }
}

export interface ProjectBundleStartAction {
    type: ActionType.PROJECT_BUNDLE_START,
    payload: {
        projectLocalId: string,
    }
}

export interface ProjectBundleCompleteAction {
    type: ActionType.PROJECT_BUNDLE_COMPLETE,
    payload: {
        projectLocalId: string,
        bundle: {
            code: string;
            err: string;
        }
    }
}

export interface FetchCellsAction {
    type: ActionType.FETCH_CELLS
}

export interface FetchCellsCompleteAction {
    type: ActionType.FETCH_CELLS_COMPLETE,
    payload: Cell[]
}

export interface FetchCellsErrorAction {
    type: ActionType.FETCH_CELLS_ERROR,
    payload: string
}

export interface SaveCellsErrorAction {
    type: ActionType.SAVE_CELLS_ERROR,
    payload: string
}

export interface CreateProjectAction {
    type: ActionType.CREATE_PROJECT,
    payload: ReduxCreateProjectPartial
}

export interface UpdateProjectAction {
    type: ActionType.UPDATE_PROJECT,
    payload: ReduxUpdateProjectPartial
}

export interface DeleteProjectAction {
    type: ActionType.DELETE_PROJECT,
    payload: string
}

export interface DownloadProjectStart {
  type: ActionType.DOWNLOAD_PROJECT_START,
  payload: string
}

export interface DownloadProjectComplete {
  type: ActionType.DOWNLOAD_PROJECT_COMPLETE,
  payload: any
}

export interface FetchProjectsCompleteAction {
  type: ActionType.FETCH_PROJECTS_COMPLETE,
  payload: ReduxProject[]
}

export interface FetchProjectsErrorAction {
  type: ActionType.FETCH_PROJECTS_ERROR,
  payload: string
}


export interface SetCurrentProjectAction {
    type: ActionType.SET_CURRENT_PROJECT,
    payload: string
}


export interface CreateFileAction {
  type: ActionType.CREATE_FILE,
  payload: ReduxCreateFilePartial
}

export interface UpdateFileAction {
  type: ActionType.UPDATE_FILE,
  payload: ReduxUpdateFilePartial
}

export interface UpdateFileSavePartialAction {
  type: ActionType.UPDATE_FILE_SAVE_PARTIAL,
  payload: ReduxSaveFilePartial
}

export interface DeleteFileAction {
  type: ActionType.DELETE_FILE,
  payload: string
}


export interface FetchFilesCompleteAction {
  type: ActionType.FETCH_FILES_COMPLETE,
  payload: ReduxFile[]
}

export interface FetchFilesErrorAction {
  type: ActionType.FETCH_FILES_ERROR,
  payload: string
}

export interface UserRequestStartAction {
  type: ActionType.USER_REQUEST_START,
  payload: UserRequestStart
}

export interface UserRequestSuccessAction {
  type: ActionType.USER_REQUEST_SUCCESS,
  payload: UserRequestSuccess
}

export interface UserRequestFailedAction {
  type: ActionType.USER_REQUEST_FAILED,
  payload: UserRequestFailed
}

export interface UserAddAction {
  type: ActionType.USER_ADD,
  payload: ReduxUser
}

export interface UserUpdateAction {
  type: ActionType.USER_UPDATE,
  payload: ReduxUpdateUserPartial
}

export interface UserDeleteAction {
  type: ActionType.USER_DELETE,
  payload: string
}

export interface ApiRequestStartAction {
  type: ActionType.API_REQUEST_START,
  payload: ApiRequestStart
}

export interface ApiRequestSuccessAction {
  type: ActionType.API_REQUEST_SUCCESS,
  payload: ApiRequestSuccess
}

export interface ApiRequestFailedAction {
  type: ActionType.API_REQUEST_FAILED,
  payload: ApiRequestFailed
}

export type Action =
    | MoveCellAction
    | DeleteCellAction
    | InsertCellAfterAction
    | UpdateCellAction
    | CellBundleStartAction
    | CellBundleCompleteAction
    | ProjectBundleStartAction
    | ProjectBundleCompleteAction
    | FetchCellsAction
    | FetchCellsCompleteAction
    | FetchCellsErrorAction
    | SaveCellsErrorAction
    | CreateProjectAction
    | UpdateProjectAction
    | DeleteProjectAction
    | DownloadProjectStart
    | DownloadProjectComplete
    | FetchProjectsCompleteAction
    | FetchProjectsErrorAction
    | SetCurrentProjectAction
    | CreateFileAction
    | UpdateFileAction
    | UpdateFileSavePartialAction
    | DeleteFileAction
    | FetchFilesCompleteAction
    | FetchFilesErrorAction
    | UserRequestStartAction
    | UserRequestSuccessAction
    | UserRequestFailedAction
    | UserAddAction
    | UserUpdateAction
    | UserDeleteAction
    | ApiRequestStartAction
    | ApiRequestSuccessAction
    | ApiRequestFailedAction  
    ;