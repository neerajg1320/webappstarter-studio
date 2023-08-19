export interface ReduxUser {
  pkid: number,
  email: string,
  first_name: string,
  last_name: string,
  accessToken: string;
  refreshToken: string;
};

export interface ReduxCreateUserPartial {
  email: string,
  first_name: string,
  last_name: string
};

export interface ReduxUpdateUserPartial {
  pkid: number,
  email?: string,
  first_name?: string,
  last_name?: string,
  accessToken?: string;
  refreshToken?: string;
};