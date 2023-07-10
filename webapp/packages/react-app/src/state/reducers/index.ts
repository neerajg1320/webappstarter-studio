import { combineReducers } from 'redux';
import cellsReducer from './cellsReducer';
import bundlesReducer from './bundlesReducer';
import projectsReducer from './projectsReducer';

const reducers = combineReducers({
  cells: cellsReducer,
  bundles: bundlesReducer,
  projects: projectsReducer
});

export default reducers;

export type RootState = ReturnType<typeof reducers>;