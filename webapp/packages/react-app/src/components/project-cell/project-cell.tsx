import "./project-cell.css";
import React, {useEffect, useMemo, useState} from 'react';
import Select, {SingleValue} from 'react-select';
import Preview from "../code-cell/preview";
import {useActions} from "../../hooks/use-actions";
import {useTypedSelector} from "../../hooks/use-typed-selector";
import {randomIdGenerator} from "../../state/id";

const ProjectCell:React.FC = () => {
  // const [projectOptions, setProjectOptions] = useState<{ value: string; label: string; }[]|null>(null);
  const [selectedProjectOption, setSelectedProjectOption] =
      useState<SingleValue<{ value: string; label: string; } | null>>(null);
  const [projectName, setProjectName] = useState<string|null>(null);
  const { createAndSetProject, updateProject, createProjectBundle, setCurrentProjectId} = useActions();
  const projectsState = useTypedSelector((state) => state.projects);
  const bundlesState =  useTypedSelector((state) => state.bundles);
  const { fetchProjects } = useActions();
  
  const options = [
    { value: "blues", label: "Blues" },
    { value: "rock", label: "Rock" },
    { value: "jazz", label: "Jazz" },
    { value: "orchestra", label: "Orchestra" },
  ];

  // console.log('ProjectCell: rendered', JSON.stringify(projectsState, null, 2));

  useEffect(() => {
    fetchProjects();
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
  }, [selectedProjectOption]);
  // console.log('ProjectCell: rendered, currentProject:', JSON.stringify(currentProject, null, 2));

  const handleGetClick = () => {
    console.log(`Need to sync`);
  }

  const handleCreateClick = () => {
    if (!projectName) {
      console.error(`Error! projectName is not set`);
      return;
    }
    const _localId = randomIdGenerator();
    createAndSetProject(_localId, projectName!, "reactjs");
  }

  const handleUpdateClick = () => {
    if (!currentProject) {
      console.error(`Error! No current project is set`);
      return;
    }
    if (!projectName) {
      console.error(`Error! projectName is not set`);
      return;
    }
    updateProject({localId:currentProject.localId, title:projectName});
  }

  const handleBundleClick = () => {
    if (currentProject) {
      // TBD: The currentProject starting file is assumed to be index.js, we will soon add a check
      createProjectBundle(currentProject.localId, `${currentProject.title}/index.js`);
    }
  }

  const handleProjectSelectionChange = (selectedOption:SingleValue<{value: string, label: string}>) => {
    console.log(selectedOption);
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
        <div style={{
            // border: "2px solid yellow",
            display: "flex", flexDirection:"row", justifyContent: "space-between", gap: "40px",
          }}
        >
          <div style={{display: "flex", gap: "20px"}}>
            <label>Project</label>
            <input type="text" value={projectName||''} onChange={(e) => {setProjectName(e.target.value)}} />
          </div>
          <div style={{display:"flex", flexDirection:"row", gap:"20px"}}>
            <button
                className="button is-primary is-small"
                onClick={handleGetClick}
                disabled={!projectName}
            >
              Get
            </button>
            <button
                className="button is-primary is-small"
                onClick={handleCreateClick}
                disabled={!projectName}
            >
              Create
            </button>
            <button
                className="button is-primary is-small"
                onClick={handleUpdateClick}
                disabled={!projectName}
            >
              Update
            </button>
          </div>
        </div>

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
