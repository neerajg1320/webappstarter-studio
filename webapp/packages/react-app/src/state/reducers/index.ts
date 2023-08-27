import { combineReducers } from 'redux';
import cellsReducer from './cellsReducer';
import bundlesReducer from './bundlesReducer';
import projectsReducer from './projectsReducer';
import filesReducer from "./filesReducer";
import authReducer from "./authReducer";
import apiReducer from "./apiReducer";

const reducers = combineReducers({
  cells: cellsReducer,
  bundles: bundlesReducer,
  projects: projectsReducer,
  files: filesReducer,
  auth: authReducer,
  api: apiReducer,
});

export default reducers;

export type RootState = ReturnType<typeof reducers>;