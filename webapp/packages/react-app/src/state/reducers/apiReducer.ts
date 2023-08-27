import produce from "immer";
import {ApiFlowOperation, ApiFlowResource, ApiFlowState} from "../api";
import {Action} from "../actions";
import {debugRedux} from "../../config/global";
import {ActionType} from "../action-types";
import {UserFlowState, UserFlowType} from "../user";

type ApiFlowStateMap = {[k:string]:ApiFlowState};

interface ApiState {
  apiFlowStateMap: ApiFlowStateMap;
  isConnected: boolean;
}

const initialState:ApiState = {
  apiFlowStateMap: {},
  isConnected: false
}

const initialApiFlowState:ApiFlowState = {
  resource: ApiFlowResource.UNKNOWN,
  operation: ApiFlowOperation.UNKNOWN,
  requestStarted: false,
  requestCompleted: false,
  message: null,
  error: null,
};

const reducer = produce((state:ApiState = initialState, action: Action): ApiState  => {
  if ([
    ActionType.API_REQUEST_START,
    ActionType.API_REQUEST_SUCCESS,
    ActionType.API_REQUEST_FAILED,
  ].includes(action.type)) {
    if (debugRedux) {
      console.log(`authReducer:`, action);
    }
  }

  switch(action.type) {
    case ActionType.API_REQUEST_START:
      state.apiFlowStateMap[action.payload.id] = {
        ...initialApiFlowState,
        resource: action.payload.resource,
        operation: action.payload.operation,
        requestStarted: true,
      };

      return state;

    case  ActionType.API_REQUEST_SUCCESS:
      state.apiFlowStateMap[action.payload.id].requestCompleted = true;
      state.apiFlowStateMap[action.payload.id].message = action.payload.messages.join(',\n');
      return state;

    case  ActionType.API_REQUEST_FAILED:
      state.apiFlowStateMap[action.payload.id].requestCompleted = true;
      state.apiFlowStateMap[action.payload.id].error = action.payload.errors.join(',\n');
      return state;

    default:
      return state;
  }
}, initialState);

export default reducer;