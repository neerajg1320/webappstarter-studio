import React, {useState} from 'react';
import Preview from "../code-cell/preview";
import {useActions} from "../../hooks/use-actions";
import {useTypedSelector} from "../../hooks/use-typed-selector";

const Project:React.FC = () => {
  console.log('Project: rendered');
  const [projectName, setProjectName] = useState('');
  const { createAndSetProject, updateProject, createProjectBundle} = useActions();

  const [projectId, setProjectId] = useState('');
  const projectsState = useTypedSelector((state) => state.projects);
  const bundlesState =  useTypedSelector((state) => state.bundles);

  const handleSaveClick = () => {
    if (projectId === '') {
      createAndSetProject(projectName, "reactjs");
    } else {
      const project = Object.entries(projectsState.data)[0][1];
      updateProject(project.id, projectName, "reactjs");
    }
  }

  const handleBundleClick = () => {
    if (Object.keys(projectsState.data).length > 0) {
      const project = Object.entries(projectsState.data)[0][1];

      // TBD: The project starting file is assumed to be index.js, we will soon add a check
      createProjectBundle(project.id, `${project.name}/index.js`);
      setProjectId(project.id);
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
            <input type="text" value={projectName} onChange={(e) => {setProjectName(e.target.value)}} />
          </div>
          <div>
            <button
                className="button is-primary is-small"
                onClick={handleSaveClick}
            >
              Save
            </button>
          </div>
        </div>

        <div>
          <button
              className="button is-family-secondary is-small"
              onClick={handleBundleClick}
          >
            Bundle
          </button>
        </div>

      </div>


      {(projectId !== '' && bundlesState[projectId]) &&
          <div>
            {/*<pre>{bundlesState[projectId]!.code}</pre>*/}
            <Preview code={bundlesState[projectId]!.code} err={bundlesState[projectId]!.err}/>
          </div>
      }
    </>
  );
}

export default Project;