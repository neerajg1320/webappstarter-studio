import React, { useState, useMemo} from "react";
import { CiSearch } from "react-icons/ci";
import "./project-search-icon.css";
import { useTypedSelector } from "../../hooks/use-typed-selector";
import { getSearchProject, getProjects } from "../../state/helpers/project-helpers";

const ProjectSearch = () => {
    const projectsState = useTypedSelector((state) => state.projects);
    const [searchValue, setSearchValue] = useState<string>('');
    const projectList = useMemo(() => {
        return getProjects(projectsState);
      }, [projectsState]);

    const handleSearchValue: React.ChangeEventHandler<HTMLInputElement> = (e)=>{
        setSearchValue(e.target.value);
        getSearchProject(e.target.value, projectList);
    }

    const handleSearch: React.KeyboardEventHandler<HTMLDivElement> = (e)=>{
        if(e.key === "Enter"){
        }
    }

  return (
    <div className="search-project" onKeyDown={handleSearch}>
      <div className="search-icon">
        <CiSearch />
      </div>
      <input type="text" placeholder="search" value={searchValue} onChange={handleSearchValue}/>
    </div>
  );
};

export default ProjectSearch;
