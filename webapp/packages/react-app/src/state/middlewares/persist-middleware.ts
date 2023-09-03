import {Dispatch} from "redux";
import {Action, UpdateFileAction} from "../actions";
import {ActionType} from "../action-types";
import {saveCells} from "../action-creators";
import {RootState} from "../reducers";
import {
  debugOptimizationMarker,
  debugRedux,
  syncCellsToServer,
  syncFilesToServer,
  syncProjectsToServer
} from "../../config/global";
import {ReduxSaveFilePartial} from "../file";

export const persistMiddleware = ({dispatch, getState}: {dispatch: Dispatch<Action>, getState: () => RootState}) => {
  let saveTimer: NodeJS.Timeout;

  return (next: (action: Action) => void) => {
    return (action: Action) => {
      // console.log(`persistMiddleware: ${JSON.stringify(action, null, 2)}`);


      if (syncFilesToServer) {
        if (action.type === ActionType.UPDATE_FILE) {
          const {localId, content} = action.payload;
          const fileState = getState().files.data[localId];

          if (content === fileState.content) {
            if (debugOptimizationMarker) {
              console.log(`The content is not changed. This should be handled in view`);
            }
            // delete the content for action.payload
            delete (action as UpdateFileAction).payload['content'];
          }
        }
      }

      // After this point the state is changed
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
    }
  }
}