import produce from 'immer';
import { Action } from '../actions';
import { ActionType } from '../action-types';
import { Project } from '../project';
import { randomIdGenerator } from '../id';

// The difference between ProjectsState and CellsState:
//  - ProjectsState have no order
//  - Cells do not have currentCellId
interface ProjectsState {
  loading: boolean;
  error: string | null;
  currentProjectId: string,
  data: {
    [key: string]: Project
  }
}

const initialState: ProjectsState = {
  loading: false,
  error: null,
  currentProjectId: '',
  data: {}
}

const reducer = produce((state: ProjectsState = initialState, action: Action): ProjectsState => {
  switch(action.type) {
    case ActionType.CREATE_PROJECT:
      const {name, framework} = action.payload;
      const project: Project = {
        id: randomIdGenerator(),
        name,
        framework
      };
      state.data[project.id] = project;
      return state;

    case ActionType.UPDATE_PROJECT:
      const {id} = action.payload;
      state.data[id] = action.payload;
      return state;

    case ActionType.DELETE_PROJECT:
      delete state.data[action.payload];
      return state;

    case ActionType.SET_CURRENT_PROJECT:
      state.currentProjectId = action.payload;
      return state;

    default:
      return state;  
  }
}, initialState);

export default reducer;