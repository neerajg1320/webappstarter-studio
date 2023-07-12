import {ServerObject, ServerObjectPartial} from "./obj";

export type ProjectFrameworks = 'reactjs' | 'vuejs' | 'angularjs' | 'none';

export interface Project extends ServerObject {
    localId: string,
    id?: number | string; // pkid is number, id is uuid string
    title: string;
    framework: ProjectFrameworks;
}

export interface ProjectPartial extends ServerObjectPartial {
  localId: string,
  id?: number | string; // pkid is number, id is uuid string
  title?: string,
  framework?: ProjectFrameworks,
  remoteId?: string,
}
