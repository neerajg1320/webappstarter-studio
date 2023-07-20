export interface ReduxUser {
  pkid: number,
  email: string,
  first_name: string,
  last_name: string
};

export interface ReduxPartialUser {
  pkid: number,
  email?: string,
  first_name?: string,
  last_name?: string
};