import {ServerObject, ServerObjectPartial} from "./obj";

export type ProjectFrameworks = 'reactjs' | 'vuejs' | 'angularjs' | 'none';

export interface ReduxProject extends ServerObject {
  reduxType: 'project',
  localId: string;
  title: string;
  description: string;
  framework: ProjectFrameworks;
  entryFileLocalId?: string|null;
  bundleLocalId?: string|null;
  // Below are server fields
  folder?: string;
  entry_file?: number;
  entry_path?: string;
  entryPath?: string|null;
}

export interface ReduxProjectPartial extends ServerObjectPartial {
  localId: string;
  title?: string;
  description?: string;
  framework?: ProjectFrameworks;
  remoteId?: string;
  entryFileLocalId?: string|null;
  bundleLocalId?: string|null;
  // Below are server fields
  folder?: string;
  entry_file?: number;
  entry_path?: string;
  entryPath?: string|null;
}

export interface ReduxCreateProjectPartial {
  localId: string,
  title: string,
  description: string,
  framework: ProjectFrameworks
}

export interface ReduxDeleteProjectPartial {
  localId: string;
  pkid?:string;
}