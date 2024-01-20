import React from "react";
import ProjectSearch from "./project-list-search";
import {
  HiOutlineSortDescending,
  HiOutlineSortAscending,
} from "react-icons/hi";
import "./project-list-options.css";
import ProjectListSort from "./project-list-sort";

const ProjectListOptions = () => {
  return (
    <div className="project-search-sort">
      <ProjectSearch />
      <ProjectListSort />
    </div>
  );
};

export default ProjectListOptions;
