import React, {useMemo, useState} from 'react';
import Preview from "../code-cell/preview";
import {useActions} from "../../hooks/use-actions";
import {useTypedSelector} from "../../hooks/use-typed-selector";
import {randomIdGenerator} from "../../state/id";

const Project:React.FC = () => {
  const [projectName, setProjectName] = useState<string|null>(null);
  const { createAndSetProject, updateProject, createProjectBundle} = useActions();
  const projectsState = useTypedSelector((state) => state.projects);
  const bundlesState =  useTypedSelector((state) => state.bundles);

  // console.log('Project: rendered', JSON.stringify(projectsState));

  const project = useMemo(() => {
    if (Object.keys(projectsState.data).length > 0) {
      return Object.entries(projectsState.data)[0][1];
    }
    return null;
  }, [projectsState]);

  console.log('Project: rendered', JSON.stringify(project));

  const handleSyncClick = () => {
    if (!projectName) {
      console.error(`Project name is required`)
      return;
    }
    if (!project) {
      const localId = randomIdGenerator();
      createAndSetProject(localId, projectName, "reactjs");
    } else {
      updateProject({localId:project.localId, name:projectName});
    }
  }

  const handleBundleClick = () => {
    if (project) {
      // TBD: The project starting file is assumed to be index.js, we will soon add a check
      createProjectBundle(project.localId, `${project.name}/index.js`);
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
          <div>
            <button
                className="button is-primary is-small"
                onClick={handleSyncClick}
                disabled={!projectName}
            >
              Sync
            </button>
          </div>
        </div>

        <div>
          <button
              className="button is-family-secondary is-small"
              onClick={handleBundleClick}
              disabled={!project || !project.synced}
          >
            Bundle
          </button>
        </div>

      </div>


      {(project && bundlesState[project.localId]) &&
          <div>
            {/*<pre>{bundlesState[projectId]!.code}</pre>*/}
            <Preview code={bundlesState[project.localId]!.code} err={bundlesState[project.localId]!.err}/>
          </div>
      }
    </>
  );
}

export default Project;