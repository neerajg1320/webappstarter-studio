import produce from "immer";
import { ActionType } from "../action-types";
import { Action } from "../actions";
import {BundleInputType} from "../bundle";


interface BundlesState {
    [key: string]: {
        loading: boolean;
        code: string;
        err: string;
        type: BundleInputType
    } | undefined;
}

const initialState: BundlesState = {}

// Note: The bundler so far doesn't differentiate about bundling a cell or a project.
const reducer = produce((state:BundlesState = initialState, action: Action): BundlesState => {
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
            state[action.payload.projectId] = {
                loading: true,
                code: '',
                err: '',
                type: 'project'
            }
            return state;
  
        case ActionType.PROJECT_BUNDLE_COMPLETE:
            state[action.payload.projectId] = {
                loading: false,
                code: action.payload.bundle.code,
                err: action.payload.bundle.err,
                type: 'project'
            }
            return state;
                      
      default:
          return state;
  }

}, initialState);

export default reducer;
