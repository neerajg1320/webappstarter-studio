import {FileMap} from "../file";

export const getFileFromLocalId = (state, localId) => {
  return state.data[localId];
}

export const selectProjectFromFileMap = (map:FileMap, projectLocalId:string):FileMap => {
  return Object.fromEntries(Object.entries(map).filter(([k,v]) => v.projectLocalId === projectLocalId));
}

export const excludeProjectFromFileMap = (map:FileMap, projectLocalId:string):FileMap => {
  return Object.fromEntries(Object.entries(map).filter(([k,v]) => v.projectLocalId !== projectLocalId));
}

export const getProjectFiles = (state, projectLocalId) => {
  return Object.entries(state.data).filter(([k,v]) =>
      v.projectLocalId === projectLocalId
  );
}