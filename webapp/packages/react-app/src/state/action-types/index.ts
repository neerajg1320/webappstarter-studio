export enum ActionType {
  MOVE_CELL = "move_cell",
  DELETE_CELL = "delete_cell",
  INSERT_CELL_AFTER = "insert_cell_after",
  UPDATE_CELL = "update_cell",

  CELL_BUNDLE_START = "cell_bundle_start",
  CELL_BUNDLE_COMPLETE = "cell_bundle_complete",
  PROJECT_BUNDLE_START = "project_bundle_start",
  PROJECT_BUNDLE_COMPLETE = "project_bundle_complete",

  FETCH_CELLS = 'fetch_cells',
  FETCH_CELLS_COMPLETE = 'fetch_cells_complete',
  FETCH_CELLS_ERROR = 'fetch_cells_error',

  SAVE_CELLS_ERROR = 'save_cells_error',

  CREATE_PROJECT = 'create_project',
  UPDATE_PROJECT = 'update_project',
  DELETE_PROJECT = 'delete_project',
  SET_CURRENT_PROJECT = 'set_current_project',
  FETCH_PROJECTS_COMPLETE = 'fetch_projects_complete',
  FETCH_PROJECTS_ERROR = 'fetch_projects_error',
  DOWNLOAD_PROJECT_START = 'download_project_start',
  DOWNLOAD_PROJECT_COMPLETE = 'download_project_complete',

  CREATE_FILE = 'create_file',
  UPDATE_FILE = 'update_file',
  DELETE_FILE = 'delete_file',

  UPDATE_FILE_SAVE_PARTIAL = 'update_file_save_partial',

  FETCH_FILES_COMPLETE = 'fetch_files_complete',
  FETCH_FILES_ERROR = 'fetch_files_error',
  
  REGISTER_REQUEST_START = 'register_request_start',
  REGISTER_REQUEST_SUCCESS = 'register_request_sucess',
  REGISTER_REQUEST_FAILED = 'register_request_failed',

  ACTIVATE_REQUEST_START = 'activate_request_start',
  ACTIVATE_REQUEST_SUCCESS = 'activate_request_sucess',
  ACTIVATE_REQUEST_FAILED = 'activate_request_failed',

  LOGIN_REQUEST_START = 'login_request_start',
  LOGIN_REQUEST_SUCCESS = 'login_request_sucess',
  LOGIN_REQUEST_FAILED = 'login_request_failed',

  LOGOUT_REQUEST = 'logout_request',

  UPDATE_USER = 'update_user',
}
