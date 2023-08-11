import produce from "immer";
import {ActionType} from "../action-types";
import {Action} from "../actions";
import {debugRedux} from "../../config/global";
import {ReduxUser} from "../user";

interface AuthState {
  authenticating: boolean;
  isAuthenticated: boolean;
  jwtToken?: string|null;
  err?: string|null;
  currentUser: ReduxUser|null;
}

const initialState: AuthState = {
  authenticating: false,
  isAuthenticated: false,
  jwtToken: null,
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
      ActionType.LOGIN_REQUEST_START,
      ActionType.LOGIN_REQUEST_SUCCESS,
      ActionType.LOGIN_REQUEST_FAILED,
      ActionType.LOGOUT_REQUEST,
    ].includes(action.type)) {
      console.log(`authReducer:`, action);
    }
  }

  switch(action.type) {
    case ActionType.LOGIN_REQUEST_START:
      state.authenticating = true;
      return state;

    case ActionType.LOGIN_REQUEST_SUCCESS:
      state.authenticating = false;
      state.isAuthenticated = true;
      state.jwtToken = action.payload.accessToken;
      state.currentUser = action.payload.user;
      return state;

    case ActionType.LOGIN_REQUEST_FAILED:
      state.authenticating = false;
      state.isAuthenticated = false;
      state.err = action.payload.non_field_errors.join(',\n');
      return state;

    case ActionType.LOGOUT_REQUEST:
      state = {...initialState};
      return state;

    default:
      return state;
  }

}, initialState);

export default reducer;
