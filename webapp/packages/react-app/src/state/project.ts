import {ServerObject, ServerObjectPartial} from "./obj";

export type ProjectFrameworks = 'reactjs' | 'vuejs' | 'angularjs' | 'none';

export interface Project extends ServerObject {
    localId: string;
    title: string;
    framework: ProjectFrameworks;
    folder?: string;
    entry_file?: number;
    entry_path?: string;
}

export interface ProjectPartial extends ServerObjectPartial {
  localId: string;
  title?: string;
  framework?: ProjectFrameworks;
  remoteId?: string;
  folder?: string;
  entry_file?: number;
  entry_path?: string;
}
