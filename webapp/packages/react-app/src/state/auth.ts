import {ReduxUser} from "./user";

export interface AuthInfo {
  accessToken: string,
  refreshToken: string,
  user: ReduxUser
}