import {ReduxProject} from "../../state";
import React from "react";

interface ProjectCardProps {
  reduxProject: ReduxProject
}

const ProjectCard:React.FC<ProjectCardProps> = ({reduxProject}) => {
  return (
    <h1>{reduxProject.title}</h1>
  );
}

export default ProjectCard;