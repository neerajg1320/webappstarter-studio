import { Dispatch } from "redux";
import { Action } from "../actions";
import { ActionType } from "../action-types";
import {createProjectOnServer, saveCells, updateFileSavePartial} from "../action-creators";
import { RootState } from "../reducers";
import {debugRedux, syncCellsToServer, syncFilesToServer, syncProjectsToServer} from "../../config/global";
import {ReduxSaveFilePartial} from "../file";

export const persistMiddleware = ({dispatch, getState}: {dispatch: Dispatch<Action>, getState: () => RootState}) => {
  let saveTimer: NodeJS.Timeout;

  return (next: (action: Action) => void) => {
    return (action: Action) => {
      // console.log(`persistMiddleware: ${JSON.stringify(action, null, 2)}`);
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
        if (action.type === ActionType.UPDATE_FILE) {
          // The middleware take the responsibility of syncing
          // console.log(`middleware: `, action.payload)
          const {localId, path, content, isEntryPoint} = action.payload;
          const fileState = getState().files.data[localId];

          if (debugRedux) {
            console.log('fileState:', fileState);
            console.log('action.payload', action.payload);
          }

          const {isServerResponse} = action.payload;
          if (isServerResponse) {
            if (debugRedux) {
              console.log(`Server Response Detected`);
            }
            return;
          }

          if (content === fileState.content) {
            console.log(`The content is not changed. This should be handled in view`);
            return;
          }

          const saveFilePartial:ReduxSaveFilePartial = {localId};

          if (Object.keys(action.payload).includes('path')) {
            saveFilePartial['path']= path;
          }
          if (Object.keys(action.payload).includes('isEntryPoint')) {
            saveFilePartial['is_entry_point']= isEntryPoint;
          }
          if (Object.keys(action.payload).includes('content') && content !== undefined && content !== null) {
              saveFilePartial['content']= content;
          }

          dispatch(updateFileSavePartial(saveFilePartial));
        }
      }
    }
  }
}