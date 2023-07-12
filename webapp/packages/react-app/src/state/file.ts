import {ServerObject, ServerObjectPartial} from "./obj";

export type FileTypes = 'javascript' | 'python' | 'java' | 'go' | 'rust' | 'c' | 'c++';

export interface ReduxFile extends ServerObject {
  localId: string,
  id?: number;
  path: string;
  type: FileTypes;
  file: File;
}

export interface ReduxFilePartial extends ServerObjectPartial {
  localId: string,
  id?: number,
  title?: string,
  type?: FileTypes,
  file?: any;
}
