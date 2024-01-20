export enum ActionType {
  MOVE_CELL = "move_cell",
  DELETE_CELL = "delete_cell",
  INSERT_CELL_AFTER = "insert_cell_after",
  UPDATE_CELL = "update_cell",

  CELL_BUNDLE_START = "cell_bundle_start",
  CELL_BUNDLE_COMPLETE = "cell_bundle_complete",
  PROJECT_BUNDLE_START = "project_bundle_start",
  PROJECT_BUNDLE_COMPLETE = "project_bundle_complete",
  RESET_BUNDLES = "reset_bundles",

  FETCH_CELLS = 'fetch_cells',
  FETCH_CELLS_COMPLETE = 'fetch_cells_complete',
  FETCH_CELLS_ERROR = 'fetch_cells_error',

  SAVE_CELLS_ERROR = 'save_cells_error',

  CREATE_PROJECT = 'create_project',
  UPDATE_PROJECT = 'update_project',
  DELETE_PROJECT = 'delete_project',
  SET_CURRENT_PROJECT = 'set_current_project',
  FETCH_PROJECTS_START = 'fetch_projects_start',
  FETCH_PROJECTS_COMPLETE = 'fetch_projects_complete',
  FETCH_PROJECTS_ERROR = 'fetch_projects_error',
  RESET_PROJECTS = 'reset_projects',
  DOWNLOAD_PROJECT_START = 'download_project_start',
  DOWNLOAD_PROJECT_COMPLETE = 'download_project_complete',
  UPDATE_PROJECTS_SEARCH_STRING = "update_projects_search_string",
  UPDATE_PROJECTS_SORT_BY = "update_projects_sort_by",
  UPDATE_PROJECTS_SORT_IN = "update_projects_sort_in",

  CREATE_FILE = 'create_file',
  UPDATE_FILE = 'update_file',
  DELETE_FILE = 'delete_file',

  FETCH_FILES_START = 'fetch_files_start',
  FETCH_FILES_COMPLETE = 'fetch_files_complete',
  FETCH_FILES_ERROR = 'fetch_files_error',
  DELETE_FILES = 'delete_files',

  // We need request set for following
  // REGISTER_USER
  // CONFIRM_EMAIL
  // RESEND_CONFIRMATION_EMAIL
  // LOGIN_USER
  // PASSWORD_CHANGE
  // PASSWORD_RESET
  // PASSWORD_RESET_CONFIRM
  // MODIFY_USER
  // LOGOUT_USER
  // REFRESH_ACCESS_TOKEN

  // All API requests have request-start and request-complete
  // After request-complete, they have request status as Success or Failure
  // There is no point creating a bundle of all these requests

  // The main purpose of request-start and request complete is to show indicators.
  // Hence for start and complete only two action-types are enough. The payload of start and complete
  // shall contain the flow type that is being handled.
  // The flow complete should result in a change of state. This looks good.
  // So our proposed structure looks like

  // USER_REQUEST_START = 'user_request_start',
  // USER_REQUEST_SUCCESS = 'user_request_success',
  // USER_REQUEST_FAILED = 'user_request_failed',
  // Here we will make a list of actions that are dispatched to the authentication state.
  // USER_ADD = 'user_add',
  // USER_UPDATE = 'user_update',
  // USER_DELETE= 'user_delete',

  // We need to build on this and analyze this properly.
  // The main interplay here is between the user and the API
  // The purpose of registration process is to engage the enroll the user with the webapps database.
  // Till the registration process is complete, the user cannot login. Hence this means that the
  // registration process will not cause the authentication state to change apart from flow changes.
  // By reasoning on similar lines we will analyze all the other processes.
  // So this means REGISTER_USER, RESEND_CONFIRMATION_EMAIL, CONFIRM_EMAIL will culminate to one
  // USER_ADD action-type.
  // LOGIN_USER will map to USER_ADD action-type.
  // PASSWORD_CHANGE, PASSWORD_RESET, PASSWORD_RESET_CONFIRM will map to USER_UPDATE
  // MODIFY_USER (First Name, Last Name) will map to USER_UPDATE
  // LOGOUT_USER will map to USER_DELETE

  // Now the user component will have to pass the request Id. Hence the request id shall be generated by
  // the user component.
  USER_REQUEST_START = 'user_request_start',
  USER_REQUEST_SUCCESS = 'user_request_success',
  USER_REQUEST_FAILED = 'user_request_failed',
  USER_ADD = 'user_add',
  USER_UPDATE = 'user_update',
  USER_DELETE= 'user_delete',

  API_REQUEST_START = 'api_request_start',
  API_REQUEST_SUCCESS = 'api_request_success',
  API_REQUEST_FAILED = 'api_request_failed',
  API_FLOW_RESET = 'api_flow_reset',

  // There is no need of CREATE_APP and DELETE_APP as they are linked to lifecycle of App.
  UPDATE_APPLICATION = 'update_application',
  RESET_APPLICATION = 'reset_application',
}
