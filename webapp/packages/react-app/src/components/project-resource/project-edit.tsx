import './project-new-edit.css';
import React, {useEffect, useMemo, useState} from "react";
import {useActions} from "../../hooks/use-actions";
import Select from "react-select";
import {SingleValue} from "react-select";
import {ProjectFrameworks, ReduxProject, ReduxUpdateProjectPartial} from "../../state";
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
  const { updateProject, saveProject } = useActions();

  const projectsState = useTypedSelector(state => state.projects);


  const currentProject = useMemo<ReduxProject|null>(() => {
    if (projectsState.currentProjectId) {
      return projectsState.data[projectsState.currentProjectId];
    }
    return null;
  }, [projectsState]);

  console.log(`ProjectNewEdit: render  projectsState:`, projectsState);

  // const [projectTitle, setProjectTitle] = useState<string|null|undefined>(currentProject?.title);
  // const [projectDescription, setProjectDescription] = useState<string|null|undefined>(currentProject?.description);
  // const [selectedFrameworkOption, setSelectedFrameworkOption] =
  //     useState<SingleValue<{ label: string; value: string; }> |null>(
  //         currentProject ? {label:currentProject.title, value: currentProject.localId} : null
  //     );

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


    if (isEdit) {
      if (currentProject) {
        saveProject(currentProject.localId);
      } else {
        console.error(`Error! project edit is called without setting current project in redux`);
      }
      navigate(RouteName.BACK);
    } else {
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
                type="text" value={currentProject?.title}
                onChange={(e) => {updateProject({...currentProject, title: e.target.value} as ReduxUpdateProjectPartial)}}
            />
          </div>
          <div className="project-value" style={{display: "flex"}}>
            <label>Description</label>
            <textarea
                rows={4}
                className="value"
                value={currentProject?.description}
                onChange={(e) => {updateProject({...currentProject, description: e.target.value} as ReduxUpdateProjectPartial)}}
            />
          </div>
          {/*<div className="project-value" style={{display: "flex"}}>*/}
          {/*  <label>Framework</label>*/}
          {/*  <Select*/}
          {/*      className="value select"*/}
          {/*      value={selectedFrameworkOption}*/}
          {/*      options={frameworkOptions}*/}
          {/*      // onChange={(value) => setSelectedFrameworkOption(value)}*/}
          {/*  />*/}
          {/*</div>*/}
          <div style={{display:"flex", flexDirection:"row", gap:"20px"}}>
            <button
                className="button is-primary is-small"
                onClick={handleSaveClick}
                disabled={!currentProject}
            >
              Save
            </button>
          </div>
        </div>
      </div>
  );
}