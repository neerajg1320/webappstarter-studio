import { Dispatch } from "redux";
import { Action } from "../actions";
import { ActionType } from "../action-types";
import {createFileOnServer, createProjectOnServer, saveCells, updateFileOnServer} from "../action-creators";
import { RootState } from "../reducers";
import {syncCellsToServer, syncFilesToServer, syncProjectsToServer} from "../../config/global";
import {ReduxFile} from "../file";

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
        } else if (action.type === ActionType.UPDATE_PROJECT) {
          const {localId} = action.payload;
          const projectState = getState().projects.data[localId]
          if (!projectState) {
            console.error(`projectState is '${projectState}' for localId:${localId}`);
            return;
          }
          if (projectState.pkid > 0) {
            console.log(`We need to support updateProjectOnServer`);
          }
        }
      }

      if (syncFilesToServer) {
        if (action.type === ActionType.CREATE_FILE) {
          const {localId, path, localFile, type, projectLocalId, isEntryPoint} = action.payload;

          createFileOnServer(localId, path, localFile, type, projectLocalId, isEntryPoint)(dispatch, getState);
        } else if (action.type === ActionType.UPDATE_FILE) {
          // const {localId, isServerResponse} = action.payload;
          const {localId, path, localFile, type, projectLocalId, isEntryPoint, isServerResponse} = action.payload;

          const fileState: ReduxFile = getState().files.data[localId];
          if (!fileState) {
            console.error(`projectState is '${fileState}' for localId:${localId}`);
            return;
          }

          if (isServerResponse) {
            console.log('Update received from server')
          } else {
            if (fileState.pkid > 0) {
              console.log(`We need to support updateFileOnServer`);
              updateFileOnServer(localId, path, localFile, type, projectLocalId, isEntryPoint)(dispatch, getState);
            }
          }
        }
      }
    }
  }
}