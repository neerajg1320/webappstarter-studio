import {ServerObject, ServerObjectPartial} from "./obj";
import {BundleLanguage} from "./bundle";
import {CodeLanguage} from "./language";

// export type FileTypes = 'javascript' | 'python' | 'java' | 'go' | 'rust' | 'c' | 'c++';

export type FileMap = {
  [key: string]: ReduxFile
};

export interface FilesState {
  loading: boolean;
  error: string | null;
  data: FileMap;
}

// localFile: the uploaded file
// file: link sent by server
export interface ReduxFile extends ServerObject {
  reduxType: 'file',
  localId: string,
  path: string;
  bundleLanguage?: BundleLanguage;
  language?: CodeLanguage,
  content?: string|null;

  contentSynced: boolean;
  // We need localFile blob to upload non-code files like jpeg, pdf etc/
  localFile?: File;
  projectLocalId?: string;
  isEntryPoint?: boolean;
  isEditAllowed?:boolean;
  isSelected?: boolean;
  isPathEditing?:boolean;

  file?: string;
  project?:number; // This is project.pkid
  is_entry_point?: boolean; // This is from server

  // The following are managed by redux and hence not exposed only in Update Partials
  // Saved content for comparison to send diff
  // It can give us better idea than contentSynced for the contents being in syncß
  prevContent: string|null;
  modifiedKeys: string[];

  // This is the value we get upon response from server
  resolveDir?: string;
}

export interface ReduxCreateFilePartial extends ServerObjectPartial {
  localId: string,
  path: string,
  bundleLanguage?: BundleLanguage,
  language?: CodeLanguage,
  content?: string|null;
  contentSynced: boolean;

  // Only used while sending request to server
  localFile?: File;
  projectLocalId?: string;
  isEntryPoint?: boolean;
  isEditAllowed?: boolean;
  isSelected?: boolean;
  isPathEditing?:boolean;

  // Following are received from server
  file?: string;
  project?: number;
  is_entry_point?: boolean;
}

export interface ReduxUpdateFilePartial extends ServerObjectPartial {
  localId: string,
  path?: string,
  bundleLanguage?: BundleLanguage,
  language?: CodeLanguage,
  content?: string|null;
  contentSynced?: boolean;

  // We will send either file blob or diffText
  localFile?: File;
  contentDiff?: string;

  projectLocalId?: string;
  isEntryPoint?: boolean;
  isEditAllowed?: boolean;
  isSelected?: boolean;
  isPathEditing?:boolean;

  // Following are received from server
  file?: string;
  project?: number;
  is_entry_point?: boolean;

  prevContent?: string|null;
  modifiedKeys?: string[];

  resolveDir?: string;
}


export interface ReduxDeleteFilePartial {
  localId: string;
  pkid?:string;
}
