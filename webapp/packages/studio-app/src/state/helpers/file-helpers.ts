import {FileMap, FilesState, ReduxFile} from "../file";
import {getRegexMatches} from "../../utils/regex";

export const getFileFromLocalId = (state, localId) => {
  return state.data[localId];
}

export const selectProjectFromFileMap = (map:FileMap, projectLocalId:string):FileMap => {
  return Object.fromEntries(Object.entries(map).filter(([k,v]) => v.projectLocalId === projectLocalId));
}

export const excludeProjectFromFileMap = (map:FileMap, projectLocalId:string):FileMap => {
  return Object.fromEntries(Object.entries(map).filter(([k,v]) => v.projectLocalId !== projectLocalId));
}

export const getProjectFiles = (state:FilesState, projectLocalId:string): [string, ReduxFile][] => {
  return Object.entries(state.data).filter(([k,v]) =>
      v.projectLocalId === projectLocalId
  );
}

export const getProjectFilesForPath = (state:FilesState, projectLocalId:string, path:string): [string, ReduxFile][] => {
  const projectFiles = getProjectFiles(state, projectLocalId);
  const pathRegex = new RegExp(`^${path}`)
  return projectFiles.filter(([k, v]) => {
    const matches = getRegexMatches(pathRegex, v.path)
    return  matches && matches.length > 0;
  });
}