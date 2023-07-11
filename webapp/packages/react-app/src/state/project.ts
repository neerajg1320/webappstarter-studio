export type ProjectFrameworks = 'reactjs' | 'vuejs' | 'angularjs' | 'none';

export interface Project {
    localId: string,
    id?: string;
    name: string;
    framework: ProjectFrameworks;
}

export interface ProjectPartial {
  localId: string,
  id?: string,
  name?: string,
  framework?: ProjectFrameworks,
  remoteId?: string,
}
