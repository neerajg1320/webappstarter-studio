import produce from "immer";
import {ActionType} from "../action-types";
import {Action} from "../actions";
import {debugRedux} from "../../config/global";
import {ReduxUser} from "../user";
import {UserFlowType} from "../auth";

interface FlowState {
  type: UserFlowType;
  requestStarted: boolean;
  requestCompleted: boolean;
  msg: string|null;
  err: string|null;
}

type FlowStateMap = {[k:string]:FlowState};

interface AuthState {
  flowStateMap: FlowStateMap;

  // Temporary
  register: FlowState;
  login: FlowState;
  activate: FlowState;

  // We are keeping isAuthenticated as separate to keep things simplified
  isAuthenticated: boolean;

  currentUser: ReduxUser|null;
}

const initialFlowState = {
  type: UserFlowType.UNKNOWN,
  requestStarted: false,
  requestCompleted: false,
  msg: null,
  err: null,
};

const initialState: AuthState = {
  flowStateMap:{} as FlowStateMap,

  // Temporary
  register: initialFlowState,
  login: initialFlowState,
  activate: initialFlowState,

  // authenticating: false,
  isAuthenticated: false,

  // The currentUser has been defined only to ease login easy during testing so that we do not have to type email, password everytime
  currentUser: {
    pkid: -1,
    email: 'neeraj76@yahoo.com',
    first_name: 'Neeraj',
    last_name: 'Gupta',
    accessToken: '',
    refreshToken: '',
  },
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

  switch(action.type) {
    case ActionType.USER_REQUEST_START:
      state.flowStateMap[action.payload.id] = {
        ...initialFlowState,
        type: action.payload.type,
        requestStarted: true,
      };

      // Temporary
      if (action.payload.type === UserFlowType.REGISTER_USER) {
        state.register = state.flowStateMap[action.payload.id];
      } else if (action.payload.type === UserFlowType.LOGIN_USER) {
        state.login = state.flowStateMap[action.payload.id];
      } else if (action.payload.type === UserFlowType.CONFIRM_EMAIL) {
        state.activate = state.flowStateMap[action.payload.id];
      }

      return state;
    case ActionType.USER_REQUEST_SUCCESS:
      state.flowStateMap[action.payload.id].requestCompleted = true;
      state.flowStateMap[action.payload.id].err = action.payload.messages.join(',\n');
      return state;

    case ActionType.USER_REQUEST_FAILED:
      state.flowStateMap[action.payload.id].requestCompleted = true;
      state.flowStateMap[action.payload.id].err = action.payload.errors.join(',\n');
      return state;

    case ActionType.USER_ADD:
      state.isAuthenticated = true;
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
      return state;

    default:
      return state;
  }

}, initialState);

export default reducer;
