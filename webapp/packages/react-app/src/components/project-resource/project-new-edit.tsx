import './project-new-edit.css';
import React, {useEffect, useMemo, useState} from "react";
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
  useEffect(() => {
    console.log(`ProjectNewEdit: first render`);
    return () => {
      console.log(`ProjectNewEdit: destroyed`);
    }
  }, []);

  const navigate = useNavigate();
  const { createAndSetProject, updateProject } = useActions();

  const projectsMap = useTypedSelector<{[k:string]:ReduxProject}>(state => state.projects.data);
  const currentProjectLocalId = useTypedSelector<string|null>(state => state.projects.currentProjectId);

  const projectState = useMemo<ReduxProject|null>(() => {
    if (isEdit && currentProjectLocalId) {
      return projectsMap[currentProjectLocalId];
    }

    return null;
  }, [isEdit, currentProjectLocalId, projectsMap]);

  console.log(`ProjectNewEdit: render projectState:`, projectState);

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



  const handleSaveClick = async () => {
    if (!projectTitle) {
      console.error(`Error! projectName is not set`);
      return;
    }

    if (isEdit) {
      if (currentProjectLocalId) {
        updateProject({
          localId: currentProjectLocalId,
          title: projectTitle,
          description: projectDescription!,
          framework: selectedFrameworkOption?.value as ProjectFrameworks,
        });
      } else {
        console.error(`Error! project edit is called without setting current project in redux`);
      }
      navigate(RouteName.BACK);
    } else {
      const _localId = randomIdGenerator();
      createAndSetProject({

        localId: _localId,
        title: projectTitle!,
        description: projectDescription!,
        framework: selectedFrameworkOption?.value as ProjectFrameworks,
      });
      navigate(RouteName.PROJECT_CELL);
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