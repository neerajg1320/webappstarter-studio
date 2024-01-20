import React, { useState, useMemo} from "react";
import { CiSearch } from "react-icons/ci";
import "./project-list-search.css";
import { useTypedSelector } from "../../hooks/use-typed-selector";
import { getSearchProject, getProjects } from "../../state/helpers/project-helpers";
import { useActions } from "../../hooks/use-actions";

const ProjectSearch = () => {
    const projectsState = useTypedSelector((state) => state.projects);
    const searchString = useTypedSelector((state) => state.projects.searchString);
    const {updateProjectsSearchString} = useActions();
    // const [searchValue, setSearchValue] = useState<string>('');
    const projectList = useMemo(() => {
        return getProjects(projectsState);
      }, [projectsState]);

    const handleSearchValue: React.ChangeEventHandler<HTMLInputElement> = (e)=>{
        updateProjectsSearchString(e.target.value)
    }
    
    // console.log("searchString: ",searchString)
    const handleSearch: React.KeyboardEventHandler<HTMLDivElement> = (e)=>{
        if(e.key === "Enter"){
        }
    }

  return (
    <div className="search-project" onKeyDown={handleSearch}>
      <div className="search-icon">
        <CiSearch />
      </div>
      <input type="text" placeholder="search" value={searchString} onChange={handleSearchValue}/>
    </div>
  );
};

export default ProjectSearch;
