import React, {useEffect, useMemo, useRef} from "react";
import './project-list-scroller.css';

import {debugComponent} from "../../../../config/global";
import ProjectListScrollItem from "./project-list-scroll-item";
import {ReduxProject} from "../../../../state";

interface ProjectListScrollerProps {
  projects: ReduxProject[];
  visibility: boolean;
}

const ProjectListScroller:React.FC<ProjectListScrollerProps> = ({projects, visibility:propVisibility}) => {

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
        {projects.map((project, index) => {
          return (
            <ProjectListScrollItem key={index} index={index} reduxProject={project} />
          );
        })}

      </div>
  )
}

export default ProjectListScroller;