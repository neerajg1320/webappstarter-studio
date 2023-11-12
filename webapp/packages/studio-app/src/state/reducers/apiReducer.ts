import produce from "immer";
import {ApiFlowOperation, ApiFlowResource, ApiFlowState} from "../api";
import {Action} from "../actions";
import {debugRedux} from "../../config/global";
import {ActionType} from "../action-types";

type ApiFlowStateMap = {[k:string]:ApiFlowState};

interface ApiState {
  apiFlowStateMap: ApiFlowStateMap;
  apiFlowState: ApiFlowState;
  isConnected: boolean;
}

const initialApiFlowState:ApiFlowState = {
  resource: ApiFlowResource.UNKNOWN,
  operation: ApiFlowOperation.UNKNOWN,
  requestStarted: false,
  requestCompleted: false,
  message: null,
  error: null,
};

const initialState:ApiState = {
  apiFlowStateMap: {},
  apiFlowState:initialApiFlowState,
  isConnected: false
}

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

  // Assign shortcut property based on type of flow
  // This will work till user sends only one request per FlowType
  // In case we support multiple then requestId to be generated in UI component
  const assignShortcutProperty = (reqFlowLocalId:string, state:ApiState): void => {
    state.apiFlowState = state.apiFlowStateMap[reqFlowLocalId];;
  }

  switch(action.type) {
    case ActionType.API_REQUEST_START:
      state.apiFlowStateMap[action.payload.id] = {
        ...initialApiFlowState,
        resource: action.payload.resource,
        operation: action.payload.operation,
        requestStarted: true,
      };
      assignShortcutProperty(action.payload.id, state);
      return state;

    case  ActionType.API_REQUEST_SUCCESS:
      state.apiFlowStateMap[action.payload.id].requestCompleted = true;
      state.apiFlowStateMap[action.payload.id].message = action.payload.messages.join(',\n');
      assignShortcutProperty(action.payload.id, state);
      return state;

    case  ActionType.API_REQUEST_FAILED:
      state.apiFlowStateMap[action.payload.id].requestCompleted = true;
      state.apiFlowStateMap[action.payload.id].error = action.payload.errors.join(',\n');
      assignShortcutProperty(action.payload.id, state);
      return state;

    case ActionType.API_FLOW_RESET:
      state.apiFlowState = initialApiFlowState;
      return state;

    default:
      return state;
  }
}, initialState);

export default reducer;