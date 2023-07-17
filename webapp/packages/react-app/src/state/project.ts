import {ServerObject, ServerObjectPartial} from "./obj";

export type ProjectFrameworks = 'reactjs' | 'vuejs' | 'angularjs' | 'none';

export interface ReduxProject extends ServerObject {
  reduxType: 'project',
  localId: string;
  title: string;
  framework: ProjectFrameworks;
  folder?: string;
  entry_file?: number;
  entry_path?: string;
  entryFileId?: string|null;
  entryPath?: string|null;
}

export interface ReduxProjectPartial extends ServerObjectPartial {
  localId: string;
  title?: string;
  framework?: ProjectFrameworks;
  remoteId?: string;
  folder?: string;
  entry_file?: number;
  entry_path?: string;
  entryFileId?: string|null;
  entryPath?: string|null;
}
