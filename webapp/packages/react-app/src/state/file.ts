import {ServerObject, ServerObjectPartial} from "./obj";

export type FileTypes = 'javascript' | 'python' | 'java' | 'go' | 'rust' | 'c' | 'c++';

// localFile: the uploaded file
// file: link sent by server
export interface ReduxFile extends ServerObject {
  reduxType: 'file',
  localId: string,
  path?: string;
  fileType?: FileTypes;
  content: string|null;
  contentSynced: boolean;
  localFile?: File;
  file?: string;
  projectLocalId?: string;
  project?:number; // This is project.pkid
  isEntryPoint?: boolean;
  is_entry_point?: boolean; // This is from server
  saveFilePartial: ReduxSaveFilePartial;
}

export interface ReduxCreateFilePartial extends ServerObjectPartial {
  localId: string,
  path: string,
  fileType: FileTypes,
  content: string|null;
  contentSynced: boolean;
  localFile?: File;
  projectLocalId?: string;
  isEntryPoint?: boolean;
  // Following are received from server
  file?: string;
  project?:number;
  is_entry_point?: boolean;
}

export interface ReduxUpdateFilePartial extends ServerObjectPartial {
  localId: string,
  path?: string,
  fileType?: FileTypes,
  content?: string|null;
  contentSynced?: boolean;
  localFile?: File;
  projectLocalId?: string;
  isEntryPoint?: boolean;

  // Following are received from server
  file?: string;
  project?:number;
  is_entry_point?: boolean;
}

export interface ReduxSaveFilePartial {
  localId: string;
  pkid?:string;
  file?: File;
  path?: string;
  is_entry_point?: boolean;
}
