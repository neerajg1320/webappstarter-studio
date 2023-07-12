import { Dispatch } from "redux";
import { Action } from "../actions";
import { ActionType } from "../action-types";
import {createFileOnServer, createProject, createProjectOnServer, saveCells} from "../action-creators";
import { RootState } from "../reducers";
import {syncCellsToServer, syncFilesToServer, syncProjectsToServer} from "../../config/global";

export const persistMiddleware = ({dispatch, getState}: {dispatch: Dispatch<Action>, getState: () => RootState}) => {
  let saveTimer: NodeJS.Timeout;

  return (next: (action: Action) => void) => {
    return (action: Action) => {
      // console.log(`persistMiddleware: ${JSON.stringify(action)}`);

      next(action);

      if (syncCellsToServer) {
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

      if (syncProjectsToServer) {
        if (action.type === ActionType.CREATE_PROJECT) {
          const {localId, title} = action.payload;
          createProjectOnServer(localId, title, "ProjectCell created from webapp")(dispatch, getState);
        }
      }

      if (syncFilesToServer) {
        if (action.type === ActionType.CREATE_FILE) {
          const {localId, path, file, type} = action.payload;
          createFileOnServer(localId, path, file, type)(dispatch, getState);
        }
      }
    }
  }
}