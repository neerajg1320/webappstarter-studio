import produce from "immer";
import { ActionType } from "../action-types";
import { Action } from "../actions";
import {BundleInputType, BundleResult} from "../bundle";
import {debugRedux} from "../../config/global";

type BundleInfo = BundleResult & {loading:boolean, type:BundleInputType};

interface BundlesState {
    [key: string]: BundleInfo | undefined;
}

const initialState: BundlesState = {}

// Note: The bundler so far doesn't differentiate about bundling a cell or a project.
const reducer = produce((state:BundlesState = initialState, action: Action): BundlesState => {
  if (debugRedux) {
    if ([
      ActionType.CELL_BUNDLE_START,
      ActionType.CELL_BUNDLE_COMPLETE,
      ActionType.PROJECT_BUNDLE_START,
      ActionType.PROJECT_BUNDLE_COMPLETE,
    ].includes(action.type)) {
      console.log(`bundlesReducer:`, action);
    }
  }

  switch(action.type) {
      case ActionType.CELL_BUNDLE_START:
          state[action.payload.cellId] = {
              loading: true,
              code: '',
              err: '',
              type: 'cell',
          }
          return state;

      case ActionType.CELL_BUNDLE_COMPLETE:
          state[action.payload.cellId] = {
              loading: false,
              code: action.payload.bundle.code,
              err: action.payload.bundle.err,
              type: 'cell',
          }
          return state;

      case ActionType.PROJECT_BUNDLE_START:
            state[action.payload.projectLocalId] = {
                loading: true,
                code: '',
                err: '',
                type: 'project'
            }
            return state;
  
      case ActionType.PROJECT_BUNDLE_COMPLETE:
            state[action.payload.projectLocalId] = {
                loading: false,
                code: action.payload.bundle.code,
                err: action.payload.bundle.err,
                type: 'project'
            }
            return state;

      case ActionType.RESET_BUNDLES:
            state = initialState;
            return state;

      default:
          return state;
  }

}, initialState);

export default reducer;
