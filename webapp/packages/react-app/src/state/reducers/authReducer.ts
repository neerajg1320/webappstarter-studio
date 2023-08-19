import produce from "immer";
import {ActionType} from "../action-types";
import {Action} from "../actions";
import {debugRedux} from "../../config/global";
import {ReduxUser} from "../user";
import {UserFlowType} from "../user";

interface FlowState {
  type: UserFlowType;
  requestStarted: boolean;
  requestCompleted: boolean;
  message: string|null;
  error: string|null;
}

type FlowStateMap = {[k:string]:FlowState};
type UserMap = {[k:string]: ReduxUser};

interface AuthState {
  flowStateMap: FlowStateMap;

  // Shortcuts for a cleaner access in UI components
  // This would work if there is only one request per flow type
  register: FlowState;
  login: FlowState;
  activate: FlowState;

  // We are keeping isAuthenticated as separate to keep things simplified
  isAuthenticated: boolean;

  userMap: UserMap;
  currentUser: ReduxUser|null;
}

const initialFlowState:FlowState = {
  type: UserFlowType.UNKNOWN,
  requestStarted: false,
  requestCompleted: false,
  message: null,
  error: null,
};

const initialUserState = {
  localId: '',
  pkid: -1,
  email: '',
  first_name: '',
  last_name: '',
  accessToken: '',
  refreshToken: '',
};

const initialState: AuthState = {
  flowStateMap:{},

  // Temporary
  register: initialFlowState,
  login: initialFlowState,
  activate: initialFlowState,

  // authenticating: false,
  isAuthenticated: false,

  // The currentUser has been defined only to ease login easy during testing so that we do not have to type email, password everytime
  userMap: {},
  currentUser: null,
}

// Note: The bundler so far doesn't differentiate about bundling a cell or a project.
const reducer = produce((state:AuthState = initialState, action: Action): AuthState => {
  if (debugRedux) {
    if ([
      ActionType.USER_REQUEST_START,
      ActionType.USER_REQUEST_SUCCESS,
      ActionType.USER_REQUEST_FAILED,
      ActionType.USER_ADD,
      ActionType.USER_UPDATE,
      ActionType.USER_DELETE,
    ].includes(action.type)) {
      console.log(`authReducer:`, action);
    }
  }

  // Assign shortcut property based on type of flow
  // This will work till user sends only one request per FlowType
  // In case we support multiple then requestId to be generated in UI component
  const assignShortcutProperty = (type: UserFlowType, reqFlowLocalId:string, state:AuthState): void => {
    if (type === UserFlowType.REGISTER_USER) {
      state.register = state.flowStateMap[reqFlowLocalId];
    } else if (type === UserFlowType.LOGIN_USER) {
      state.login = state.flowStateMap[reqFlowLocalId];
    } else if (type === UserFlowType.CONFIRM_EMAIL) {
      state.activate = state.flowStateMap[reqFlowLocalId];
    }    
  }

  switch(action.type) {
    case ActionType.USER_REQUEST_START:
      state.flowStateMap[action.payload.id] = {
        ...initialFlowState,
        type: action.payload.type,
        requestStarted: true,
      };

      // This will work till user sends only one request per FlowType
      // Solution would be to put requestId in the UI component
      assignShortcutProperty(action.payload.type, action.payload.id, state);

      return state;
    case ActionType.USER_REQUEST_SUCCESS:
      state.flowStateMap[action.payload.id].requestCompleted = true;
      state.flowStateMap[action.payload.id].message = action.payload.messages.join(',\n');

      assignShortcutProperty(state.flowStateMap[action.payload.id].type, action.payload.id, state);

      return state;

    case ActionType.USER_REQUEST_FAILED:
      state.flowStateMap[action.payload.id].requestCompleted = true;
      state.flowStateMap[action.payload.id].error = action.payload.errors.join(',\n');

      // This will work till user sends only one request per FlowType
      // Solution would be to put requestId in the UI component
      assignShortcutProperty(state.flowStateMap[action.payload.id].type, action.payload.id, state);

      return state;

    case ActionType.USER_ADD:
      state.isAuthenticated = true;
      state.userMap[action.payload.localId] = action.payload;
      state.currentUser = action.payload;
      return state;

    case ActionType.USER_UPDATE:
      if(state.currentUser) {
        state.currentUser = {...state.currentUser, ...action.payload}
      }
      return state;

    case ActionType.USER_DELETE:
      state.isAuthenticated = false;
      state.currentUser = null;
      delete state.userMap[action.payload]
      return state;

    default:
      return state;
  }

}, initialState);

export default reducer;
