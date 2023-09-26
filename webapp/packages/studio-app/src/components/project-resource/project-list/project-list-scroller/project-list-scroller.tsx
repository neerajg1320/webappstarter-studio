import React, {useEffect, useMemo, useRef} from "react";
import './project-list-scroller.css';

import {useTypedSelector} from "../../../../hooks/use-typed-selector";

import {debugComponent} from "../../../../config/global";
import ProjectListScrollItem from "./project-list-scroll-item";

interface ProjectListScrollerProps {
  visibility: boolean;
}

const ProjectListScroller:React.FC<ProjectListScrollerProps> = ({visibility:propVisibility}) => {
  const projectsState = useTypedSelector((state) => state.projects);;
  const projectList = useMemo(() => {
    return Object.entries(projectsState.data).map(([k,v]) => v).filter(item => item.confirmed)
  }, [projectsState.data]);


  const handleProjectListScroll = () => {
    // console.log(`handleProjectListScroll():`);
  };

  useEffect(() => {
    if (debugComponent) {
      console.log(`ProjectListScroller:useEffect[]`);
    }
  }, []);

  return (
      <div className="project-scroll-list" onScroll={handleProjectListScroll} style={{visibility: propVisibility ? 'visible' : 'hidden'}}>
        {projectList.map((project, index) => {
          return (
            <ProjectListScrollItem key={index} index={index} reduxProject={project} />
          );
        })}

      </div>
  )
}

export default ProjectListScroller;