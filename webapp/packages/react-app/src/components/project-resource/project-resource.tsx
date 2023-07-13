import React, {useState} from "react";
import {randomIdGenerator} from "../../state/id";
import {useActions} from "../../hooks/use-actions";

export const ProjectResource:React.FC = () => {
  const [projectName, setProjectName] = useState<string|null>(null);
  const { createAndSetProject } = useActions();

  const handleCreateClick = () => {
    if (!projectName) {
      console.error(`Error! projectName is not set`);
      return;
    }
    const _localId = randomIdGenerator();
    createAndSetProject(_localId, projectName!, "reactjs");
  }

  return (
      <div style={{
          width: "80%", margin: "20px",
          display: "flex", flexDirection: "row", justifyContent: "flex-end"
        }}
      >
        <div style={{
          border: "2px solid yellow",
          width: "40%",
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
                onClick={handleCreateClick}
                disabled={!projectName}
            >
              Create
            </button>
          </div>
        </div>
      </div>
  );
}