import { ProjectsState, ProjectMap, ReduxProject } from "../project";

export const getProjects = (state: ProjectsState): ReduxProject[] => {
  return Object.entries(state.data)
    .map(([k, v]) => v)
    .filter((item) => item.confirmed);
};

export const getProjectFromLocalId = (
  state: ProjectsState,
  localId: string
): ReduxProject => {
  return state.data[localId];
};

export const getProjectFromServerId = (
  state: ProjectsState,
  serverId: number
): ReduxProject | null => {
  const matches = getProjects(state).filter((item) => item.pkid == serverId);
  if (matches.length > 0) {
    return matches[0];
  }
  return null;
};

export const getProjectEntryPath = (reduxProject: ReduxProject): string => {
  let projectEntryPath = reduxProject.entry_path;
  if (projectEntryPath[0] !== "/") {
    projectEntryPath = "/" + reduxProject.entry_path;
  }

  return projectEntryPath;
};

//search project
export const getSearchProject = (
  searchValue: string,
  projectList: ReduxProject[]
) => {
  // let projectList = getProjects(state);
  console.log("searchValue: ", searchValue);
  if (!searchValue) {
    return projectList;
  } else {
    let projectSearchResult = projectList.filter((project) =>
      project.title.toLowerCase().includes(searchValue.toLowerCase())
    );
    console.log(projectSearchResult);
    return projectSearchResult;
  }
};
