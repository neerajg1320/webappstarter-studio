import {ServerObject, ServerObjectPartial} from "./obj";

export enum ProjectTemplates {
  JAVASCRIPT_WITH_CSS = 'javascript-css',
  TYPESCRIPT_WITH_CSS = 'typescript-css',
  REACT_JSX_WITH_CSS = 'react-javascript-css',
  REACT_TSX_WITH_CSS = 'react-typescript-css',
}

export enum ProjectFrameworks {
  REACTJS = 'reactjs',
  VUESJS = 'vuejs',
  ANGULARJS = 'angularjs',
  NONE = 'none'
};

export enum ReactToolchains {
  CREATE_REACT_APP = 'create-react-app',
  VITE = 'vite',
  NONE = 'none',
};

// TBD: Need to add a strong documentation here as this is one of the focal points of our application
// selectedFileLocalId: This is the selected to be shown in the editor

export interface ReduxProject extends ServerObject {
  reduxType: 'project',
  localId: string;
  title: string;
  description: string;
  template: ProjectTemplates;
  framework: ProjectFrameworks;
  toolchain: ReactToolchains;
  ideReady: boolean;
  selectedFileLocalId: string|null;
  entryHtmlFileLocalId?: string|null;
  entryFileLocalId?: string|null;
  htmlFileLocalId?: string|null;
  bundleLocalId?: string|null;
  zipBlob?: Blob|null;
  downloadingZip?: boolean;

  // Below are server fields
  folder?: string;
  entry_file?: number;
  entry_path?: string;
  entry_html_path?: string;
  entryPath?: string|null;
}

export interface ReduxUpdateProjectPartial extends ServerObjectPartial {
  localId: string;
  title?: string;
  description?: string;
  template?: ProjectTemplates;
  framework?: ProjectFrameworks;
  toolchain?: ReactToolchains;
  ideReady?: boolean;
  remoteId?: string;
  selectedFileLocalId?: string|null;
  entryHtmlFileLocalId?: string|null;
  entryFileLocalId?: string|null;
  htmlFileLocalId?: string|null;
  bundleLocalId?: string|null;
  zipBlob?: Blob|null;
  downloadingZip?: boolean;

  // Below are server fields
  folder?: string;
  entry_file?: number;
  entry_path?: string;
  entry_html_path?: string;
  entryPath?: string|null;
}

export interface ReduxCreateProjectPartial {
  localId: string;
  title: string;
  description: string;
  template  : ProjectTemplates;
  framework: ProjectFrameworks;
  toolchain: ReactToolchains;
}

export interface ReduxDeleteProjectPartial {
  localId: string;
  pkid?:string;
}