import { Dispatch } from "redux";
import { Action } from "../actions";
import { ActionType } from "../action-types";
import { saveCells } from "../action-creators";
import { RootState } from "../reducers";
import { serverConnect } from "../../config/global";

export const persistMiddleware = ({dispatch, getState}: {dispatch: Dispatch<Action>, getState: () => RootState}) => {
  let saveTimer: NodeJS.Timeout;

  return (next: (action: Action) => void) => {
    return (action: Action) => {
      
      next(action);
      
      if (serverConnect) {
        if ([
          ActionType.MOVE_CELL, 
          ActionType.UPDATE_CELL,
          ActionType.INSERT_CELL_AFTER,
          ActionType.DELETE_CELL
        ].includes(action.type)) {
          if (saveTimer) {
            clearTimeout(saveTimer);
          }
          saveTimer = setTimeout(() => {
            saveCells()(dispatch, getState)
          }, 1000);
        }
      }
    }
  }
}