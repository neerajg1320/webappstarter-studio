import './project-new-edit.css';
import React, {useMemo, useState} from "react";
import {randomIdGenerator} from "../../state/id";
import {useActions} from "../../hooks/use-actions";
import Select from "react-select";
import {SingleValue} from "react-select";
import {ProjectFrameworks, ReduxProject} from "../../state";
import {useNavigate} from "react-router-dom";
import {RouteName} from "../routes";
import {useTypedSelector} from "../../hooks/use-typed-selector";

interface ProjectNewEditProps {
  isEdit: boolean
}

export const ProjectNewEdit:React.FC<ProjectNewEditProps> = ({isEdit}) => {
  const navigate = useNavigate();

  const projectsMap = useTypedSelector<{[k:string]:ReduxProject}>(state => state.projects.data);
  const currentProjectLocalId = useTypedSelector<string|null>(state => state.projects.currentProjectId);

  const projectState = useMemo<ReduxProject|null>(() => {
    if (isEdit && currentProjectLocalId) {
      return projectsMap[currentProjectLocalId];
    }

    return null;
  }, [isEdit, currentProjectLocalId, projectsMap]);

  const [projectTitle, setProjectTitle] = useState<string|null|undefined>(projectState?.title);
  const [projectDescription, setProjectDescription] = useState<string|null|undefined>(projectState?.description);
  const [selectedFrameworkOption, setSelectedFrameworkOption] =
      useState<SingleValue<{ label: string; value: string; }> |null>(
          projectState ? {label:projectState.title, value: projectState.localId} : null
      );

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

  const handleSaveClick = async () => {
    if (!projectTitle) {
      console.error(`Error! projectName is not set`);
      return;
    }
    const _localId = randomIdGenerator();
    await createAndSetProject(_localId, projectTitle!, selectedFrameworkOption?.value as ProjectFrameworks);
    if (!isEdit) {
      navigate(RouteName.PROJECT_CELL);
    } else {
      navigate(RouteName.BACK);
    }

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
        <div className="project-value-list">
          <div className="project-value" style={{display: "flex"}}>
            <label>Title</label>
            <input
                className="value"
                type="text" value={projectTitle||''}
                onChange={(e) => {setProjectTitle(e.target.value)}}
            />
          </div>
          <div className="project-value" style={{display: "flex"}}>
            <label>Description</label>
            <textarea
                rows={4}
                className="value"
                value={projectDescription||''}
                onChange={(e) => {setProjectDescription(e.target.value)}}
            />
          </div>
          <div className="project-value" style={{display: "flex"}}>
            <label>Framework</label>
            <Select className="value select" value={selectedFrameworkOption} options={frameworkOptions} onChange={(value) => setSelectedFrameworkOption(value)}/>
          </div>
          <div style={{display:"flex", flexDirection:"row", gap:"20px"}}>
            <button
                className="button is-primary is-small"
                onClick={handleSaveClick}
                disabled={!projectTitle}
            >
              Save
            </button>
          </div>
        </div>
      </div>
  );
}