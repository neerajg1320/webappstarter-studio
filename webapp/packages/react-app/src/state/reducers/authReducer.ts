import produce from "immer";
import {ActionType} from "../action-types";
import {Action} from "../actions";
import {debugRedux} from "../../config/global";
import {ReduxUser} from "../user";

interface FlowState {
  requestStarted: boolean;
  requestCompleted: boolean;
  msg: string|null;
  err: string|null;
}

interface AuthState {
  register: FlowState;
  login: FlowState;
  // authenticating: boolean;
  isAuthenticated: boolean;
  jwtToken?: string|null;
  refreshToken?: string|null;
  err?: string|null;
  currentUser: ReduxUser|null;
}

const initialState: AuthState = {
  register: {
    requestStarted: false,
    requestCompleted: false,
    msg: null,
    err: null,
  },
  login: {
    requestStarted: false,
    requestCompleted: false,
    msg: null,
    err: null,
  },
  // authenticating: false,
  isAuthenticated: false,
  jwtToken: null,
  refreshToken: null,
  err: null,
  // The currentUser has been defined only to ease login easy during testing so that we do not have to type email, password everytime
  currentUser: {
    pkid: -1,
    email: 'neeraj76@yahoo.com',
    first_name: 'Neeraj',
    last_name: 'Gupta'
  },
}

// Note: The bundler so far doesn't differentiate about bundling a cell or a project.
const reducer = produce((state:AuthState = initialState, action: Action): AuthState => {
  if (debugRedux) {
    if ([
      ActionType.REGISTER_REQUEST_START,
      ActionType.REGISTER_REQUEST_SUCCESS,
      ActionType.REGISTER_REQUEST_FAILED,
      ActionType.LOGIN_REQUEST_START,
      ActionType.LOGIN_REQUEST_SUCCESS,
      ActionType.LOGIN_REQUEST_FAILED,
      ActionType.LOGOUT_REQUEST,
    ].includes(action.type)) {
      console.log(`authReducer:`, action);
    }
  }

  switch(action.type) {
    case ActionType.REGISTER_REQUEST_START:
      state.register.requestStarted = true;
      state.register.requestCompleted = false;
      state.register.msg = null;
      state.register.err = null;
      return state;

    case ActionType.REGISTER_REQUEST_SUCCESS:
      state.register.requestStarted = false;
      state.register.requestCompleted = true;
      state.register.msg = action.payload.msg.join(',\n');
      return state;

    case ActionType.REGISTER_REQUEST_FAILED:
      state.register.requestStarted = false;
      state.register.requestCompleted = true;
      state.register.err = action.payload.join(',\n');
      return state;
      
    case ActionType.LOGIN_REQUEST_START:
      state.login.requestStarted = true;
      state.login.requestCompleted = false;
      state.login.msg = null;
      state.login.err = null;

      state.isAuthenticated = false;
      state.jwtToken = null;
      state.currentUser = null;
      return state;

    case ActionType.LOGIN_REQUEST_SUCCESS:
      state.login.requestStarted = false;
      state.login.requestCompleted = true;
      state.login.msg = action.payload.msg.join(',\n');

      // state.authenticating = false;
      state.isAuthenticated = true;
      state.jwtToken = action.payload.authInfo.accessToken;
      state.refreshToken = action.payload.authInfo.refreshToken;
      state.currentUser = action.payload.authInfo.user;
      return state;

    case ActionType.LOGIN_REQUEST_FAILED:
      state.login.requestStarted = false;
      state.login.requestCompleted = true;
      state.login.err = action.payload.join(',\n');
      
      // state.authenticating = false;
      state.isAuthenticated = false;
      state.err = action.payload.join(',\n');
      return state;

    case ActionType.LOGOUT_REQUEST:
      state = {...initialState};
      return state;

    default:
      return state;
  }

}, initialState);

export default reducer;
