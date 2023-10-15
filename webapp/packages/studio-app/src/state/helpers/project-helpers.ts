export const getProjects = (state) => {
  return Object.entries(state.data).map(([k,v]) => v).filter(item => item.confirmed);
}

export const getProjectFromLocalId = (state, localId) => {
  return state.data[localId];
}