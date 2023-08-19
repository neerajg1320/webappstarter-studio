import produce from 'immer';
import { Action } from '../actions';
import { ActionType } from '../action-types';
import { ReduxProject } from '../project';
import {generateLocalId} from "../id";
import {debugRedux} from "../../config/global";

// The difference between ProjectsState and CellsState:
//  - ProjectsState have no order
//  - Cells do not have currentCellId
interface ProjectsState {
  loading: boolean;
  error: string | null;
  currentProjectId: string|null,
  data: {
    [key: string]: ReduxProject
  }
}

const initialState: ProjectsState = {
  loading: false,
  error: null,
  currentProjectId: null,
  data: {}
}

const reducer = produce((state: ProjectsState = initialState, action: Action): ProjectsState => {
  if (debugRedux) {
    if ([
      ActionType.CREATE_PROJECT,
      ActionType.FETCH_PROJECTS_COMPLETE,
      ActionType.SET_CURRENT_PROJECT
    ].includes(action.type)) {
      console.log(`projectsReducer:`, action);
    }
  }

  switch(action.type) {
    case ActionType.CREATE_PROJECT:
      const project: ReduxProject = {
        reduxType: 'project',
        ...action.payload,
        id: '',
        pkid: -1,
        synced: false,
        isServerResponse: false,
        requestInitiated: false,
        deleteMarked: false,
      };
      state.data[project.localId] = project;
      return state;

    case ActionType.UPDATE_PROJECT:
      // console.log(`UPDATE_PROJECT:`, action);
      const {localId} = action.payload;
      state.data[localId] = {
        ...state.data[localId],
        ...action.payload
      }
      return state;

    case ActionType.DELETE_PROJECT:
      delete state.data[action.payload];
      return state;

    case ActionType.FETCH_PROJECTS_COMPLETE:
      state.loading = false;
      if (action.payload.length > 0) {
        state.data = action.payload.reduce((acc, project) => {
          // We need to see how this behave. We generate this to stay consistent for localId across cells
          project.reduxType = 'project'
          project.localId = generateLocalId();
          project.synced = true;
          project.deleteMarked = true;
          acc[project.localId] = project;
          return acc;
        }, {} as ProjectsState['data']);
      }

      return state;

    case ActionType.SET_CURRENT_PROJECT:
      state.currentProjectId = action.payload;
      return state;

    default:
      return state;  
  }
}, initialState);

export default reducer;