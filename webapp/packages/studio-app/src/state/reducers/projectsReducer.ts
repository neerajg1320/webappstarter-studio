import produce from 'immer';
import {Action} from '../actions';
import {ActionType} from '../action-types';
import {ProjectsState, ReduxProject, StartConfigType} from '../project';
import {generateLocalId} from "../id";
import {debugRedux} from "../../config/global";

// The difference between ProjectsState and CellsState:
//  - ProjectsState have no order
//  - Cells do not have currentCellId

const initialState: ProjectsState = {
  loading: false,
  loadCount: 0,
  autoBundle: false,
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
        title: '',
        description: '',
        minify: false,
        startConfigType: StartConfigType.PROJECT_UNKNOWN,
        pkid: -1,
        confirmed: false,
        filesSynced: false,
        ideReady: false,
        bundleDirty: true,
        selectedFileLocalId: null,
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
        synced: !(Object.entries(action.payload).length > 0),
        ...action.payload,
      }
      return state;

    case ActionType.DELETE_PROJECT:
      delete state.data[action.payload];
      return state;

    case ActionType.FETCH_PROJECTS_START:
      const {reset} = action.payload;
      state.loading = true;
      state.error = null;
      if (reset) {
        state.data = {};
      }
      return state;

    case ActionType.FETCH_PROJECTS_COMPLETE:
      state.loading = false;
      state.error = null;
      if (action.payload.length > 0) {
        state.data = action.payload.reduce((acc, project) => {
          // We need to see how this behave. We generate this to stay consistent for localId across cells
          project.reduxType = 'project'
          project.localId = generateLocalId();
          project.confirmed = true;
          project.filesSynced = false;
          project.ideReady = false;
          project.bundleDirty = true;
          project.synced = true;
          project.deleteMarked = true;
          // TBD: This has to be cleaned
          project.entry_html_path = "index.html";
          acc[project.localId] = project;
          return acc;
        }, {} as ProjectsState['data']);
      }
      state.loadCount += 1;
      return state;

    case ActionType.RESET_PROJECTS:
      state = initialState;
      return state;

    case ActionType.SET_CURRENT_PROJECT:
      state.currentProjectId = action.payload;
      return state;

    default:
      return state;  
  }
}, initialState);

export default reducer;