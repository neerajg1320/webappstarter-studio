import React from "react";
import { CiSearch } from "react-icons/ci";
import "./project-search-icon.css";

const ProjectSearch = () => {
  return (
    <div className="search-project">
      <div className="search-icon">
        <CiSearch />
      </div>
      <input type="text" placeholder="search" />
    </div>
  );
};

export default ProjectSearch;
