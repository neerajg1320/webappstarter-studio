export interface ApplicatonState {
  hotReload: boolean;
  autoSync: boolean;
  advanceFeatures: boolean;
  projectsLoaded: boolean;
  filesLoaded: boolean;
  bundlerReady: boolean;
}

export interface ApplicatonStatePartial {
  hotReload?: boolean;
  autoSync?: boolean;
  advanceFeatures?: boolean;
  projectsLoaded?: boolean;
  filesLoaded?: boolean;
  bundlerReady?: boolean;
}
