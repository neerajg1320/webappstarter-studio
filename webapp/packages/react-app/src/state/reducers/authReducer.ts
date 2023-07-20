import produce from "immer";
import {ActionType} from "../action-types";
import {Action} from "../actions";
import {debugRedux} from "../../config/global";

interface AuthState {
  authenticating: boolean;
  isAuthenticated: boolean;
  jwtToken?: string;
  err?: string;
  user?: {
    pkid: number;
    email: string;
    first_name: string;
    last_name: string;
    // password: string;
  };
}

const initialState: AuthState = {authenticating: false, isAuthenticated: false}

// Note: The bundler so far doesn't differentiate about bundling a cell or a project.
const reducer = produce((state:AuthState = initialState, action: Action): AuthState => {
  if (debugRedux || true) {
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
      return state;

    case ActionType.LOGIN_REQUEST_FAILED:
      state.authenticating = false;
      state.isAuthenticated = false;
      state.err = action.payload.non_field_errors.join(',\n');
      return state;

    case ActionType.LOGOUT_REQUEST:
      state.authenticating = false;
      state.isAuthenticated = false;
      state.user = undefined;
      return state;

    default:
      return state;
  }

}, initialState);

export default reducer;
