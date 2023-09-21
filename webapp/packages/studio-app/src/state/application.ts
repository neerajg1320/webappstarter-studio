export interface ApplicatonState {
  hotReload: boolean;
  autoSave: boolean;
  advanceFeatures: boolean;
  projectsLoaded: boolean;
  filesLoaded: boolean;
}

export interface ApplicatonStatePartial {
  hotReload?: boolean;
  autoSave?: boolean;
  advanceFeatures?: boolean;
  projectsLoaded?: boolean;
  filesLoaded?: boolean;
}
