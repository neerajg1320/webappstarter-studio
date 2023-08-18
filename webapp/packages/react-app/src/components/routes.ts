export enum RoutePath {
  BACK =  '..',

  ROOT = '/',

  PROJECTS = '/projects',
  PROJECT_NEW = '/projects/new',
  PROJECT_EDIT = '/projects/edit',
  PROJECT_CELL = '/projects/cell',

  PROJECT_PLAYGROUND = '/playground',

  USER_REGISTER = '/user/register',
  USER_LOGIN = '/user/login',
  USER_ACTIVATE = '/user/activate',
  USER_PASSWORD_RESET_CONFIRM = '/user/password/reset/confirm',

  LOGIN_SUCCESS = PROJECTS,
}

export enum RouteDepth {
  ONE_UP = -1
}