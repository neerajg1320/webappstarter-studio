import "./project-cell.css";
import React, {useEffect, useMemo, useState} from 'react';
import Select, {SingleValue} from 'react-select';
import Preview from "../code-cell/preview";
import {useActions} from "../../hooks/use-actions";
import {useTypedSelector} from "../../hooks/use-typed-selector";

const ProjectCell:React.FC = () => {

  const [selectedProjectOption, setSelectedProjectOption] =
      useState<SingleValue<{ value: string; label: string; } | null>>(null);

  const { createProjectBundle, setCurrentProjectId } = useActions();
  const projectsState = useTypedSelector((state) => state.projects);
  const bundlesState =  useTypedSelector((state) => state.bundles);
  const { fetchProjects } = useActions();
  
  // console.log('ProjectCell: rendered', JSON.stringify(projectsState, null, 2));

  useEffect(() => {
    fetchProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const projects = useMemo(() => {
    return Object.entries(projectsState.data).map(entry => entry[1]);
  }, [projectsState.data]);
  // console.log('ProjectCell: rendered, projects:', JSON.stringify(projects, null, 2));


  const projectOptions = useMemo(() => {
    return projects.map(prj => {
      return {value: prj.localId, label: prj.title};
    })
  }, [projects]);
  // console.log('ProjectCell: rendered, projectOptions:', JSON.stringify(projectOptions, null, 2));

  const currentProject = useMemo(() => {
    if (Object.keys(projectsState.data).length > 0 && selectedProjectOption) {
      return projectsState.data[selectedProjectOption.value];
    }
    return null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProjectOption, projectsState.data]);
  // console.log('ProjectCell: rendered, currentProject:', JSON.stringify(currentProject, null, 2));



  const handleBundleClick = () => {
    console.log(`currentProject: ${JSON.stringify(currentProject, null, 2)}`);

    if (currentProject && currentProject.entry_path) {
      const projectEntryPoint= currentProject.entry_path;
      createProjectBundle(currentProject.localId, `${currentProject.folder}/${projectEntryPoint}`);
    } else {
      console.error(`Error! entry_path is not set for current project '${currentProject?.title}'`);
    }
  }

  const handleProjectSelectionChange = (selectedOption:SingleValue<{value: string, label: string}>) => {
    // console.log(selectedOption);
    setSelectedProjectOption(selectedOption);
    
    if (selectedOption) {
      setCurrentProjectId(selectedOption.value);
    }
  }

  return (
    <>
      <div style={{
        // border: "2px solid white",
        margin: "20px", width: "80%",
        display: "flex", justifyContent:"space-evenly", gap: "40px"
      }}
      >


        <div style={{display:"flex", flexDirection:"row", gap:"20px"}}>
          <Select
              value={selectedProjectOption}
              className="project-select is-primary is-small"
              options={projectOptions}
              onChange={handleProjectSelectionChange}
          />
          <button
              className="button is-family-secondary is-small"
              onClick={handleBundleClick}
              disabled={!currentProject || !currentProject.synced}
          >
            Bundle
          </button>
        </div>

      </div>


      {(currentProject && bundlesState[currentProject.localId]) &&
          <div>
            {/*<pre>{bundlesState[currentProject.localId]!.code}</pre>*/}
            <Preview code={bundlesState[currentProject.localId]!.code} err={bundlesState[currentProject.localId]!.err}/>
          </div>
      }
    </>
  );
}

export default ProjectCell;
