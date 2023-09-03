import produce from 'immer';
import {Action} from '../actions';
import {ActionType} from '../action-types';
import {ReduxFile} from '../file';
import {debugRedux} from "../../config/global";

// The difference between FilesState and CellsState:
//  - FilesState have no order
//  - Cells do not have currentCellId
interface FilesState {
  loading: boolean;
  error: string | null;
  data: {
    [key: string]: ReduxFile
  }
}

const initialState: FilesState = {
  loading: false,
  error: null,
  data: {}
}

const reducer = produce((state: FilesState = initialState, action: Action): FilesState => {
  switch(action.type) {
    case ActionType.CREATE_FILE:
      if (debugRedux) {
        console.log(`filesReducer: ${JSON.stringify(action)}`);
      }
      var {localId} = action.payload;
      const file: ReduxFile = {
        reduxType: 'file',
        id: '',
        pkid: -1,
        confirmed: false,
        prevContent: null,
        synced: false,
        isServerResponse: false,
        requestInitiated: false,
        modifiedKeys: [],
        isEditAllowed: true,
        deleteMarked: false,
        ...action.payload,
      };
      state.data[localId] = file;
      return state;

    case ActionType.UPDATE_FILE:
      // console.log(`filesReducer: ${JSON.stringify(action)}`);
      // eslint-disable-next-line @typescript-eslint/no-redeclare
      var {localId} = action.payload;

      const modifiedKeys = [...state.data[localId].modifiedKeys];

      if (action.payload.modifiedKeys) {
        for (const key of action.payload.modifiedKeys) {
          if (!(modifiedKeys.includes(key))) {
            modifiedKeys.push(key);
          }
        }
      }
      state.data[localId] = {
        ...state.data[localId],
        ...action.payload,
        modifiedKeys
      }

      if (debugRedux) {
        console.log(`filesReducer: localId:${localId} modifiedKeys:${modifiedKeys}`);
      }
      return state;

    case ActionType.DELETE_FILE:
      delete state.data[action.payload];
      return state;

    case ActionType.FETCH_FILES_COMPLETE:
      if (debugRedux) {
        console.log(`filesReducer:`, action);
      }

      state.loading = false;

      if (action.payload.length > 0) {
        const newFiles = action.payload.reduce((acc, file) => {
          // We need to see how this behave. We generate this to stay consistent for localId across cells
          // file.localId = generateLocalId();

          // We do not allow edit till the content is synced
          file.isEditAllowed = false;
          file.reduxType = 'file';
          file.confirmed = true;
          file.synced = true;
          file.content = null;
          file.prevContent = null;
          file.contentSynced = false;
          file.requestInitiated = false;
          file.deleteMarked = false;
          file.modifiedKeys = [];

          acc[file.localId] = file;
          return acc;
        }, {} as FilesState['data']);

        state.data = {...state.data, ...newFiles}
      }

      return state;

    default:
      return state;
  }
}, initialState);

export default reducer;