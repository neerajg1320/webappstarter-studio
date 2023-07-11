import produce from 'immer';
import { Action } from '../actions';
import { ActionType } from '../action-types';
import { Project } from '../project';

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
  // console.log(`projectsReducer: ${JSON.stringify(action)}`)
  switch(action.type) {
    case ActionType.CREATE_PROJECT:
      const project: Project = {
        ...action.payload,
        synced: false
      };
      state.data[project.localId] = project;
      return state;

    case ActionType.UPDATE_PROJECT:
      console.log(`UPDATE_PROJECT:`, action);
      const {localId} = action.payload;
      state.data[localId] = {
        ...state.data[localId],
        ...action.payload
      }
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