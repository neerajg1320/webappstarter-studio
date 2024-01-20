import React, {useEffect, useMemo, useState} from "react";
import {useNavigate} from "react-router-dom";
import ProjectListScroller from "./project-list-scroller/project-list-scroller";
import ProjectListGrid from "./project-list-grid/project-list-grid";
import './project-list-view.css';
import {generateLocalId} from "../../../state/id";
import {RoutePath} from "../../routes";
import {useActions} from "../../../hooks/use-actions";
import {ProjectFrameworks, ProjectTemplates, ReactToolchains, StartConfigType} from "../../../state";
import {withLifecyleLogger} from "../../../hoc/logger";
import {useTypedSelector} from "../../../hooks/use-typed-selector";
import {debugComponent} from "../../../config/global";
import {getProjects, getSearchProject} from "../../../state/helpers/project-helpers";

const ProjectListView = () => {
  const [isPreviewLayout, setPreviewLayout] = useState<boolean>(false);
  const navigate = useNavigate();
  const {createAndSetProject, fetchProjectsAndFiles} = useActions();
  const currentUser = useTypedSelector(state => state.auth.currentUser);
  const isAuthenticated = useTypedSelector<boolean>(state => state.auth.isAuthenticated);
  const projectsState = useTypedSelector((state) => state.projects);
  const searchString = useTypedSelector((state) => state.projects.searchString)
  // const projectList = useTypedSelector((state) => getProjects(state.projects));
  const projectList = useMemo(() => {
    return getProjects(projectsState);
  }, [projectsState]);

  const projectSearchList = getSearchProject(searchString, projectList)


  // console.log("projectList: ",projectList);

  const handleNewProjectClick = () => {
    if (debugComponent) {
      console.log(`handleNewProjectClick()`);
    }

    const localId = generateLocalId();
    createAndSetProject({
      localId,
      title: `Project-${localId}`,
      description: 'This is a web application',
      startConfigType: StartConfigType.PROJECT_TEMPLATE,
      template: ProjectTemplates.JAVASCRIPT_WITH_CSS,
      framework: ProjectFrameworks.NONE,
      toolchain: ReactToolchains.NONE,
    });
    navigate(RoutePath.PROJECT_NEW);
  }

  useEffect(() => {
    if (debugComponent) {
      console.log(`ProjectListGrid:useEffect[] projectState:`, projectsState);
    }
    if (!isAuthenticated) {
      console.log(`Error! projects listed before authentication `)
    } else {
      if (projectsState.loadCount <= 0) {
        fetchProjectsAndFiles();
      }
    }

    return () => {
      if (debugComponent) {
        console.log(`ProjectListGrid:useEffect[] destroyed`);
      }
    }
  }, []);

  return (
      <>
        {(currentUser && !currentUser.is_anonymous) ?
            <div className="project-list-view">
              {/* <div className="project-list-view-control-bar">
                <div style={{
                  borderRadius: "15px",
                  display: "flex",
                }}>
                  <button className="button is-family-secondary" style={{backgroundColor: "cornflowerblue", borderRadius: "5px"}}
                          onClick={handleNewProjectClick}>
                    New
                  </button>
                </div>
                <div className="project-list-view-control-bar-setting">
                  <label>Preview Mode</label>
                  <input type="checkbox" checked={isPreviewLayout} onChange={(e) => setPreviewLayout(e.target.checked)}/>
                </div>
              </div> */}
              <div className="project-list-view-panel">
                {/* <ProjectListScroller projects={projectList} visibility={isPreviewLayout}/> */}
                <ProjectListGrid projects={projectSearchList} visibility={!isPreviewLayout}/>
              </div>
            </div>
            :
            <h2>User login needed</h2>
        }
      </>
  );
}

export default withLifecyleLogger(ProjectListView, false);