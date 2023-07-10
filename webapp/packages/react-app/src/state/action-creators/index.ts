import {ActionType} from "../action-types";
import {
    Action,
    CreateProjectAction,
    DeleteCellAction, DeleteProjectAction,
    Direction,
    InsertCellAfterAction,
    MoveCellAction,
    SetCurrentProjectAction,
    UpdateCellAction, UpdateProjectAction
} from '../actions';
import {Cell, CellTypes} from '../cell';
import { Dispatch } from "react";
import bundleCodeStr from "../../bundler";
import axios from 'axios';
import {RootState} from "../reducers";
import {Project, ProjectFrameworks} from "../project";


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


export const createProjectBundle = (projectId:string, input:string) => {
    return async (dispatch:Dispatch<Action>) => {
        dispatch({
            type: ActionType.PROJECT_BUNDLE_START,
            payload: {
                projectId,
            }
        });
  
        const result = await bundleCodeStr(input);
  
        dispatch({
            type: ActionType.PROJECT_BUNDLE_COMPLETE,
            payload: {
                projectId,
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
        console.log(`cells=`, cells);
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

export const createProject = (name:string, framework: ProjectFrameworks): CreateProjectAction => {
    return {
        type: ActionType.CREATE_PROJECT,
        payload: {
            name,
            framework
        }
    }
}

export const updateProject = (id:string, name:string, framework: ProjectFrameworks): UpdateProjectAction => {
    return {
        type: ActionType.UPDATE_PROJECT,
        payload: {
            id,
            name,
            framework
        }
    }
}

export const deleteProject = (id:string): DeleteProjectAction => {
    return {
        type: ActionType.DELETE_PROJECT,
        payload: id
    }
}

export const setCurrentProject = (id: string): SetCurrentProjectAction => {
    return {
        type: ActionType.SET_CURRENT_PROJECT,
        payload: id
    }
}

export const createAndSetProject = (name:string, framework: ProjectFrameworks) => {
    return async (dispatch: Dispatch<Action>, getState: () => RootState) => {
        dispatch(createProject(name, framework));
        const { projects } = getState();

        const firstProject:[string, Project] = Object.entries(projects.data)[0];
        dispatch(setCurrentProject(firstProject[0]));
    }
}
