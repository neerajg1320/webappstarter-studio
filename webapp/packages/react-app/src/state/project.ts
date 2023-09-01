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

export interface ReduxProject extends ServerObject {
  reduxType: 'project',
  localId: string;
  title: string;
  description: string;
  template: ProjectTemplates;
  framework: ProjectFrameworks;
  toolchain: ReactToolchains;
  ideReady: boolean;
  entryHtmlFileLocalId?: string|null;
  entryFileLocalId?: string|null;
  htmlFileLocalId?: string|null;
  bundleLocalId?: string|null;
  zipBlob?: Blob|null;

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
  entryHtmlFileLocalId?: string|null;
  entryFileLocalId?: string|null;
  htmlFileLocalId?: string|null;
  bundleLocalId?: string|null;
  zipBlob?: Blob|null;

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