export interface ApplicatonState {
  hotReload: boolean;
  autoSave: boolean;
  advanceFeatures: boolean;
}

export interface ApplicatonStatePartial {
  hotReload?: boolean;
  autoSave?: boolean;
  advanceFeatures?: boolean;
}
