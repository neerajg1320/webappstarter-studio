import {ServerObject, ServerObjectPartial} from "./obj";

export type ProjectFrameworks = 'reactjs' | 'vuejs' | 'angularjs' | 'none';

export interface Project extends ServerObject {
    localId: string,
    id?: number;
    name: string;
    framework: ProjectFrameworks;
}

export interface ProjectPartial extends ServerObjectPartial {
  localId: string,
  id?: number,
  name?: string,
  framework?: ProjectFrameworks,
  remoteId?: string,
}
