import {ReduxFile} from "./file";
import {ReduxProject} from "./project";

export * from './store';
export * from './reducers';
export * from './cell';
export * from './file';
export * from './project';
export * as actionCreators from './action-creators';

export type CellItem = ReduxFile | ReduxProject;

export const isReduxFile = (item:CellItem):item is ReduxFile   => {
  return item.reduxType === 'file';
}

export const isReduxProject = (item:CellItem):item is ReduxProject   => {
  return item.reduxType === 'project';
}