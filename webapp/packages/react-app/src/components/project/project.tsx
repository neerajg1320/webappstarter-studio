import React, {useMemo, useState} from 'react';
import Preview from "../code-cell/preview";
import {useActions} from "../../hooks/use-actions";
import {useTypedSelector} from "../../hooks/use-typed-selector";
import {randomIdGenerator} from "../../state/id";

const Project:React.FC = () => {
  const [projectName, setProjectName] = useState('');
  const { createAndSetProject, updateProject, createProjectBundle} = useActions();

  const [projectId, setProjectId] = useState('');
  const projectsState = useTypedSelector((state) => state.projects);
  const bundlesState =  useTypedSelector((state) => state.bundles);

  // console.log('Project: rendered', JSON.stringify(projectsState));

  const proj = useMemo(() => {
    if (Object.keys(projectsState.data).length > 0) {
      return Object.entries(projectsState.data)[0][1];
    }
    return null;
  }, [projectsState]);

  console.log('Project: rendered', JSON.stringify(proj));

  const handleSaveClick = () => {
    if (projectId === '') {
      const localId = randomIdGenerator();
      createAndSetProject(localId, projectName, "reactjs");
    } else {
      const project = Object.entries(projectsState.data)[0][1];
      updateProject({localId:project.localId, name:projectName});
    }
  }

  const handleBundleClick = () => {
    if (Object.keys(projectsState.data).length > 0) {
      const project = Object.entries(projectsState.data)[0][1];

      // TBD: The project starting file is assumed to be index.js, we will soon add a check
      createProjectBundle(project.localId, `${project.name}/index.js`);
      setProjectId(project.localId);
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


      {(proj && bundlesState[proj.localId]) &&
          <div>
            {/*<pre>{bundlesState[projectId]!.code}</pre>*/}
            <Preview code={bundlesState[projectId]!.code} err={bundlesState[projectId]!.err}/>
          </div>
      }
    </>
  );
}

export default Project;