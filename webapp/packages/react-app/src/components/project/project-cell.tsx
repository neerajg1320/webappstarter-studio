import React, {useMemo, useState} from 'react';
import Preview from "../code-cell/preview";
import {useActions} from "../../hooks/use-actions";
import {useTypedSelector} from "../../hooks/use-typed-selector";
import {randomIdGenerator} from "../../state/id";

const ProjectCell:React.FC = () => {
  const [localId, setLocalId] = useState<string|null>(null);
  const [projectName, setProjectName] = useState<string|null>(null);
  const { createAndSetProject, updateProject, createProjectBundle} = useActions();
  const projectsState = useTypedSelector((state) => state.projects);
  const bundlesState =  useTypedSelector((state) => state.bundles);

  // console.log('ProjectCell: rendered', JSON.stringify(projectsState));

  const project = useMemo(() => {
    if (Object.keys(projectsState.data).length > 0 && localId) {
      return projectsState.data[localId];
    }
    return null;
  }, [projectsState]);

  console.log('ProjectCell: rendered', JSON.stringify(project));

  const handleSyncClick = () => {
    console.log(`Need to sync`);
  }

  const handleCreateClick = () => {
    if (!projectName) {
      console.error(`Error! projectName is not set`);
      return;
    }
    const _localId = randomIdGenerator();
    createAndSetProject(_localId, projectName!, "reactjs");
    setLocalId(_localId);
  }

  const handleUpdateClick = () => {
    if (!project) {
      console.error(`Error! No current project is set`);
      return;
    }
    if (!projectName) {
      console.error(`Error! projectName is not set`);
      return;
    }
    updateProject({localId:project.localId, name:projectName});
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
          <div style={{display:"flex", flexDirection:"row", gap:"20px"}}>
            <button
                className="button is-primary is-small"
                onClick={handleSyncClick}
                disabled={!projectName}
            >
              Sync
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

export default ProjectCell;
