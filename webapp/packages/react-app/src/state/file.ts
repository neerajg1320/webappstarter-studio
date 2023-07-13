import {ServerObject, ServerObjectPartial} from "./obj";

export type FileTypes = 'javascript' | 'python' | 'java' | 'go' | 'rust' | 'c' | 'c++';

export interface ReduxFile extends ServerObject {
  localId: string,
  path: string;
  type: FileTypes;
  file: File;
  projectLocalId?: string;
  project?:number; // This is project.pkid
}

export interface ReduxFilePartial extends ServerObjectPartial {
  localId: string,
  title?: string,
  type?: FileTypes,
  file?: any;
  projectLocalId?: string;
  project?:number;
}
