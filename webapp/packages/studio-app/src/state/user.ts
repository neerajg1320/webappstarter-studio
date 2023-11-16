export interface ReduxUser {
  localId: string,
  pkid: number,
  email: string,
  first_name: string,
  last_name: string,
  is_anonymous: boolean,
  accessToken: string;
  refreshToken: string;
  tokenExpired: boolean;
};

export interface ReduxCreateUserPartial {
  localId:string,
  email: string,
  first_name: string,
  last_name: string,
  is_anonymous: boolean,
};

export interface ReduxUpdateUserPartial {
  pkid?: number,
  email?: string,
  first_name?: string,
  last_name?: string,
  is_anonymous?: boolean,
  accessToken?: string;
  refreshToken?: string;
  tokenExpired?: boolean;
};

export enum UserFlowType {
  REGISTER_USER = "register_user",
  CONFIRM_EMAIL = "confirm_email",
  RESEND_CONFIRMATION_EMAIL = "resend_confirmation_email",
  LOGIN_USER = "login_user",
  PASSWORD_CHANGE = "password_change",
  PASSWORD_RESET = "password_reset_request",
  PASSWORD_RESET_CONFIRM = "password_reset_request_confirm",
  MODIFY_USER = "modify_user",
  LOGOUT_USER = "logout_user",
  REFRESH_ACCESS_TOKEN = "refresh_access_token",
  UNKNOWN = "unknown",
}


export const stringToUserFlowType = (userFlowyTypeStr:string): UserFlowType => {
  return UserFlowType[userFlowyTypeStr as keyof typeof UserFlowType] || UserFlowType.UNKNOWN;
}

export interface UserRequestStart {
  id: string,
  type: UserFlowType
}

export interface UserRequestSuccess {
  id: string,
  messages: string[]
}

export interface UserRequestFailed {
  id: string,
  errors: string[]
}

export interface UserFlowState {
  type: UserFlowType;
  requestStarted: boolean;
  requestCompleted: boolean;
  message: string|null;
  error: string|null;
  displayed: boolean;
}