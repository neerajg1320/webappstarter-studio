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
}
