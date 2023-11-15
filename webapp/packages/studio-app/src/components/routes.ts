export enum RoutePath {
  BACK =  '..',

  ROOT = '/',

  PROJECTS = '/projects',
  PROJECT_NEW = '/projects/new',
  PROJECT_EDIT = '/projects/edit',
  PROJECT_IDE = '/projects/ide',

  PROJECT_PLAYGROUND = '/playground',

  USER_REGISTER = '/user/register',
  USER_LOGIN = '/user/login',
  USER_ACTIVATE = '/user/activate',
  USER_PASSWORD_RESET_CONFIRM = '/user/password/reset/confirm',
  USER_PASSWORD_CHANGE = '/user/password/change',

  LOGIN_SUCCESS = PROJECTS,
}

export enum RouteDepth {
  ONE_UP = -1
}