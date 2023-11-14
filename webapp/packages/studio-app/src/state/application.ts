export interface ApplicatonState {
  hotReload: boolean;
  autoSync: boolean;
  advanceFeatures: boolean;
  projectsLoaded: boolean;
  filesLoaded: boolean;
  bundlerInitiated: boolean;
  bundlerReady: boolean;
}

export interface ApplicatonStatePartial {
  hotReload?: boolean;
  autoSync?: boolean;
  advanceFeatures?: boolean;
  projectsLoaded?: boolean;
  filesLoaded?: boolean;
  bundlerInitiated?: boolean;
  bundlerReady?: boolean;
}
