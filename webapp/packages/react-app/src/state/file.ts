import {ServerObject, ServerObjectPartial} from "./obj";

export type FileTypes = 'javascript' | 'python' | 'java' | 'go' | 'rust' | 'c' | 'c++';

// localFile: the uploaded file
// file: link sent by server
export interface ReduxFile extends ServerObject {
  reduxType: 'file',
  localId: string,
  path: string;
  fileType: FileTypes;
  content: string|null;
  contentSynced: boolean;
  localFile?: File;
  file?: string;
  projectLocalId?: string;
  project?:number; // This is project.pkid
  isEntryPoint?: boolean;
}

export interface ReduxFilePartial extends ServerObjectPartial {
  localId: string,
  path?: string,
  fileType?: FileTypes,
  content?: string|null;
  contentSynced?: boolean;
  localFile?: File;
  file?: string;
  projectLocalId?: string;
  project?:number;
  isEntryPoint?: boolean;
}
