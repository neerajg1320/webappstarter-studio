import { ActionType } from "../action-types";
import { CellTypes, Cell } from "../cell";
import { ProjectFrameworks } from "../project";

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

export interface SetCurrentProjectAction {
    type: ActionType.SET_CURRENT_PROJECT,
    payload: {
      name: string,
      framework: ProjectFrameworks
    }
}

export type Action =
    | MoveCellAction
    | DeleteCellAction
    | InsertCellAfterAction
    | UpdateCellAction
    | CellBundleStartAction
    | CellBundleCompleteAction
    | FetchCellsAction
    | FetchCellsCompleteAction
    | FetchCellsErrorAction
    | SaveCellsErrorAction
    | SetCurrentProjectAction;        