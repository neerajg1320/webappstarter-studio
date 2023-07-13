import produce from 'immer';
import {Action} from '../actions';
import {ActionType} from '../action-types';
import {ReduxFile} from '../file';

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
  // console.log(`filesReducer: ${JSON.stringify(action)}`)
  switch(action.type) {
    case ActionType.CREATE_FILE:
      const file: ReduxFile = {
        ...action.payload,
        id: '',
        pkid: -1,
        synced: false
      };
      state.data[file.localId] = file;
      return state;

    case ActionType.UPDATE_FILE:
      const {localId} = action.payload;
      state.data[localId] = {
        ...state.data[localId],
        ...action.payload
      }
      return state;

    case ActionType.DELETE_FILE:
      delete state.data[action.payload];
      return state;

    case ActionType.ADD_FILES_TO_LIST:
      return state;

    case ActionType.DELETE_FILES_FROM_LIST:
      return state;
      
    default:
      return state;
  }
}, initialState);

export default reducer;