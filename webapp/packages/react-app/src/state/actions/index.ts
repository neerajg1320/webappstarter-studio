import { ActionType } from "../action-types";
import { CellTypes, Cell } from "../cell";
import {ReduxProject, ProjectFrameworks, ReduxProjectPartial} from "../project";
import {ReduxCreateFilePartial, ReduxFile, ReduxSaveFilePartial, ReduxUpdateFilePartial} from "../file";
import {ReduxUser} from "../user";

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
    payload: {
        localId: string,
        title: string,
        framework: ProjectFrameworks
    }
}

export interface UpdateProjectAction {
    type: ActionType.UPDATE_PROJECT,
    payload: ReduxProjectPartial
}

export interface DeleteProjectAction {
    type: ActionType.DELETE_PROJECT,
    payload: string
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

export interface LoginRequestStartAction {
  type: ActionType.LOGIN_REQUEST_START
  payload: {
    email: string,
    password: string
  }
}

export interface LoginRequestSuccessAction {
  type: ActionType.LOGIN_REQUEST_SUCCESS
  payload: {
    accessToken: string,
    refreshToken: string,
    user: ReduxUser
  }
}

export interface LoginRequestFailedAction {
  type: ActionType.LOGIN_REQUEST_FAILED,
  payload: {
    non_field_errors: string[]
  }
}

export interface LogoutRequestAction {
  type: ActionType.LOGOUT_REQUEST,
  payload: null;
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
    | FetchProjectsCompleteAction
    | FetchProjectsErrorAction
    | SetCurrentProjectAction
    | CreateFileAction
    | UpdateFileAction
    | UpdateFileSavePartialAction
    | DeleteFileAction
    | FetchFilesCompleteAction
    | FetchFilesErrorAction
    | LoginRequestStartAction
    | LoginRequestSuccessAction
    | LoginRequestFailedAction
    | LogoutRequestAction
    ;