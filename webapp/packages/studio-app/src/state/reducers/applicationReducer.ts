import produce from "immer";
import { ActionType } from "../action-types";
import { Action } from "../actions";
import {debugRedux} from "../../config/global";
import {ApplicatonState} from "../application";



const initialState: ApplicatonState = {
  hotReload: true,
  autoSync: true,
  advanceFeatures: false,
  projectsLoaded: false, // This should be moved to user
  filesLoaded: false, // This should be moved to user
  bundlerInitiated: false,
  bundlerReady: false,
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
      // We do not want to reset bundler. This hack shall be removed when we move projectsLoaded and filesLoaded to user
      state = {...initialState, bundlerReady:state.bundlerReady};
      return state;

    default:
      return state;
  }

}, initialState);

export default reducer;
