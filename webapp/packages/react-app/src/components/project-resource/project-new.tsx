import './project-new.css';
import React, {useMemo, useState} from "react";
import {randomIdGenerator} from "../../state/id";
import {useActions} from "../../hooks/use-actions";
import Select from "react-select";
import {SingleValue} from "react-select";
import {ProjectFrameworks} from "../../state";
import {useNavigate} from "react-router-dom";

export const ProjectNew:React.FC = () => {
  const navigate = useNavigate();
  const [projectTitle, setProjectTitle] = useState<string|null>(null);
  const [projectDescription, setProjectDescription] = useState<string|null>(null);
  const [selectedFrameworkOption, setSelectedFrameworkOption] = useState<SingleValue<{ label: string; value: string; }> |null>(null);

  const frameworkOptions = useMemo(() => {
    const frameworks:string[] = [
      'reactjs',
      'vuejs',
      'angularjs'
    ];

    return frameworks.map(item => {
      return {label: item, value: item};
    })
  }, []);

  const { createAndSetProject } = useActions();

  const handleCreateClick = async () => {
    if (!projectTitle) {
      console.error(`Error! projectName is not set`);
      return;
    }
    const _localId = randomIdGenerator();
    await createAndSetProject(_localId, projectTitle!, selectedFrameworkOption?.value as ProjectFrameworks);
    navigate('/edit_project');
  }

  return (
      <div style={{
          border: "2px solid lightblue",
          padding: "20px",
          width: "100%",
          height: "100%",
          display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center"
        }}
      >
        <div className="project-value-list" style={{

        }}
        >
          <div className="project-value" style={{display: "flex"}}>
            <label>Title</label>
            <input className="value" type="text" value={projectTitle||''} onChange={(e) => {setProjectTitle(e.target.value)}} />
          </div>
          <div className="project-value" style={{display: "flex"}}>
            <label>Description</label>
            <textarea rows={4} className="value" value={projectDescription||''} onChange={(e) => {setProjectDescription(e.target.value)}} />
          </div>
          <div className="project-value" style={{display: "flex"}}>
            <label>Framework</label>
            <Select className="value select" value={selectedFrameworkOption} options={frameworkOptions} onChange={(value) => setSelectedFrameworkOption(value)}/>
          </div>
          <div style={{display:"flex", flexDirection:"row", gap:"20px"}}>
            <button
                className="button is-primary is-small"
                onClick={handleCreateClick}
                disabled={!projectTitle}
            >
              Save
            </button>
          </div>
        </div>
      </div>
  );
}