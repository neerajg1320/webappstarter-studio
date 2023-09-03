import {ServerObject, ServerObjectPartial} from "./obj";
import {BundleLanguage} from "./bundle";
import {CodeLanguage} from "./language";

// export type FileTypes = 'javascript' | 'python' | 'java' | 'go' | 'rust' | 'c' | 'c++';

// localFile: the uploaded file
// file: link sent by server
export interface ReduxFile extends ServerObject {
  reduxType: 'file',
  localId: string,
  path: string;
  bundleLanguage: BundleLanguage;
  language: CodeLanguage,
  content: string|null;

  contentSynced: boolean;
  localFile?: File;
  projectLocalId?: string;
  isEntryPoint?: boolean;
  isEditAllowed?:boolean;

  file?: string;
  project?:number; // This is project.pkid
  is_entry_point?: boolean; // This is from server

  // The following are managed by redux and hence not exposed only in Update Partials
  // Saved content for comparison to send diff
  // It can give us better idea than contentSynced for the contents being in syncß
  prevContent: string|null;
  modifiedKeys: string[];
}

export interface ReduxCreateFilePartial extends ServerObjectPartial {
  localId: string,
  path: string,
  bundleLanguage: BundleLanguage,
  language: CodeLanguage,
  content: string|null;
  contentSynced: boolean;
  localFile?: File;
  projectLocalId?: string;
  isEntryPoint?: boolean;
  isEditAllowed?:boolean;

  // Following are received from server
  file?: string;
  project?:number;
  is_entry_point?: boolean;
}

export interface ReduxUpdateFilePartial extends ServerObjectPartial {
  localId: string,
  path?: string,
  bundleLanguage?: BundleLanguage,
  language?: CodeLanguage,
  content?: string|null;
  contentSynced?: boolean;
  localFile?: File;
  projectLocalId?: string;
  isEntryPoint?: boolean;
  isEditAllowed?:boolean;

  // Following are received from server
  file?: string;
  project?:number;
  is_entry_point?: boolean;

  prevContent?: string|null;
  modifiedKeys?: string[];
}

// TBD: Proper documentation to be added here
// When updating file on the server either of the file or diff would be sent
// In case both are sent, then file shall be used for update
export interface ReduxSaveFilePartial {
  localId: string;
  pkid?:string;
  file?: File;
  diff?: string;
  bundleLanguage?: BundleLanguage,
  language?: CodeLanguage,
  content?: string;
  path?: string;
  is_entry_point?: boolean;
}

export interface ReduxDeleteFilePartial {
  localId: string;
  pkid?:string;
}
