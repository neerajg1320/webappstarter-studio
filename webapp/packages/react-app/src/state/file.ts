import {ServerObject, ServerObjectPartial} from "./obj";

export type FileTypes = 'javascript' | 'python' | 'java' | 'go' | 'rust' | 'c' | 'c++';

export interface ReduxFile extends ServerObject {
  localId: string,
  path: string;
  type: FileTypes;
  file: File;
  projectId?: string;
}

export interface ReduxFilePartial extends ServerObjectPartial {
  localId: string,
  title?: string,
  type?: FileTypes,
  file?: any;
  projectId?: string;
}
