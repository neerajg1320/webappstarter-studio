import {ProjectsState, ReduxProject} from "../project";


export const getProjects = (state:ProjectsState):ReduxProject[] => {
  return Object.entries(state.data).map(([k,v]) => v).filter(item => item.confirmed);
}

export const getProjectFromLocalId = (state:ProjectsState, localId:string):ReduxProject => {
  return state.data[localId];
}

export const getProjectFromServerId = (state:ProjectsState, serverId:number):ReduxProject|null => {
  const matches = getProjects(state).filter(item => item.pkid == serverId);
  if (matches.length > 0) {
    return matches[0];
  }
  return null;
}