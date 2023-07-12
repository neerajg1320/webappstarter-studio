import {ServerObject, ServerObjectPartial} from "./obj";

export type ProjectFrameworks = 'reactjs' | 'vuejs' | 'angularjs' | 'none';

export interface Project extends ServerObject {
    localId: string;
    title: string;
    framework: ProjectFrameworks;
    folder: string;
}

export interface ProjectPartial extends ServerObjectPartial {
  localId: string;
  title?: string;
  framework?: ProjectFrameworks;
  remoteId?: string;
  folder?: string;
}
