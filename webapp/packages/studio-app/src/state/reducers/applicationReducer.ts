import produce from "immer";
import { ActionType } from "../action-types";
import { Action } from "../actions";
import {debugRedux} from "../../config/global";
import {ApplicatonState} from "../application";



const initialState: ApplicatonState = {
  hotReload: true,
  autoSave: true,
  advanceFeatures: false,
  projectsLoaded: false,
  filesLoaded: false,
}

// Note: The bundler so far doesn't differentiate about bundling a cell or a project.
const reducer = produce((state:ApplicatonState = initialState, action: Action): ApplicatonState => {
  if (debugRedux) {
    if ([
      ActionType.UPDATE_APPLICATION,
    ].includes(action.type)) {
      console.log(`appReducer:`, action);
    }
  }

  switch(action.type) {
    case ActionType.UPDATE_APPLICATION:
      state = {
        ...state,
        ...action.payload,
      }
      return state;

    case ActionType.RESET_APPLICATION:
      state = initialState;
      return state;

    default:
      return state;
  }

}, initialState);

export default reducer;
