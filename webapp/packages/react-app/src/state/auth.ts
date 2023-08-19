import {ReduxUpdateUserPartial, ReduxUser} from "./user";
import {BundleLanguage} from "./bundle";

export interface AuthInfo {
  accessToken: string,
  refreshToken: string,
  user: ReduxUser
}

export interface AuthInfoPartial {
  accessToken?: string,
  refreshToken?: string,
  user?: ReduxUpdateUserPartial
}

export enum UserFlowType {
  REGISTER_USER = "register_user",
  CONFIRM_EMAIL = "confirm_email",
  RESEND_CONFIRMATION_EMAIL = "resend_confirmation_email",
  LOGIN_USER = "login_user",
  PASSWORD_CHANGE = "password_change",
  PASSWORD_RESET_REQUEST = "password_reset_request",
  PASSWORD_RESET_REQUEST_CONFIRM = "password_reset_request_confirm",
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