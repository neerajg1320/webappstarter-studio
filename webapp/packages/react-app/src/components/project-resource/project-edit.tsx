import './project-edit.css';
import React, {useEffect, useMemo, useRef, useState} from "react";
import {useActions} from "../../hooks/use-actions";
import Select from "react-select";
import {SingleValue} from "react-select";
import {ReduxProject, ReduxUpdateProjectPartial} from "../../state";
import {useNavigate} from "react-router-dom";
import {RouteDepth, RoutePath} from "../routes";
import {useTypedSelector} from "../../hooks/use-typed-selector";
import {debugComponent} from "../../config/global";
import ApiFlowStatus from "../api-status/api-flow-status";


interface ProjectEditProps {
  isEdit: boolean
}

const ProjectEdit:React.FC<ProjectEditProps> = ({isEdit}) => {
  useEffect(() => {
    if (debugComponent) {
      console.log(`ProjectNewEdit: first render`);
    }
    return () => {
      if (debugComponent) {
        console.log(`ProjectNewEdit: destroyed`);
      }
    }
  }, []);

  const navigate = useNavigate();
  const { updateProject, saveProject } = useActions();
  const isFrameworkEnabled = useMemo(() => false, []);

  const projectsState = useTypedSelector(state => state.projects);
  const apiState = useTypedSelector(state => state.api.apiFlowState);
  const saveClickRef = useRef<boolean>(false);

  const currentProject = useMemo<ReduxProject|null>(() => {
    if (projectsState.currentProjectId) {
      return projectsState.data[projectsState.currentProjectId];
    }
    return null;
  }, [projectsState]);

  const projectTemplateOption = useMemo<SingleValue<{ label: string; value: string; }>>(() => {
    if (currentProject && currentProject.template) {
      return {label: currentProject.template, value:currentProject.template};
    }
    return {label: 'javascript-css', value: 'javascript-css'};
  }, [currentProject?.template])

  const projectFrameworkOption = useMemo<SingleValue<{ label: string; value: string; }>>(() => {
    if (currentProject && currentProject.framework) {
      return {label: currentProject.framework, value:currentProject.framework};
    }
    return {label: 'none', value: 'none'};
  }, [currentProject?.framework])

  const projectToolchainOption = useMemo<SingleValue<{ label: string; value: string; }>>(() => {
    if (currentProject && currentProject.toolchain) {
      return {label: currentProject.toolchain, value:currentProject.toolchain};
    }
    return {label: 'none', value: 'none'};
  }, [currentProject?.toolchain])

  if (debugComponent) {
    console.log(`ProjectEdit: render  projectsState:`, projectsState);
    console.log(`ProjectEdit: render  currentProjectId: ${projectsState.currentProjectId} currentProject:`, currentProject);
  }

  const frameworkOptions = useMemo(() => {
    // This we need to fetch from the API
    const frameworks:string[] = [
      'reactjs',
      'vuejs',
      'angularjs',
      'none',
    ];

    return frameworks.map(item => {
      return {label: item, value: item};
    })
  }, []);

  const toolchainOptions = useMemo(() => {
    // This we need to fetch from the API
    const frameworks:string[] = [
      'create-react-app',
      'vite',
      'none',
    ];

    return frameworks.map(item => {
      return {label: item, value: item};
    })
  }, []);


  const projectTemplateOptions = useMemo(() => {
    // This we need to fetch from the API
    const templates:string[] = [
      'javascript-css',
      'typescript-css',
      'react-javascript-css',
      'react-typescript-css',
    ];

    return templates.map(item => {
      return {label: item, value: item};
    })
  }, []);

  const handleSaveClick = async () => {
    saveClickRef.current = true;

    if (currentProject) {
      // TBD: Here we should add the checks for validation
      // We confirm the creation locally
      updateProject({localId:currentProject.localId, confirmed: true});
      saveProject(currentProject.localId);
    }
  }

  useEffect(() => {
    console.log(`useEffect[currentProject?.synced] synced:`, currentProject?.synced)

    if (saveClickRef.current && currentProject && currentProject.synced) {
      if (isEdit) {
        navigate(RouteDepth.ONE_UP);
      } else {
        navigate(RoutePath.PROJECT_CELL, {replace: true});
      }

      saveClickRef.current = false;
    }
  }, [currentProject?.synced]);

  return (
      <div style={{
          // border: "2px solid yellow",
          padding: "20px",
          width: "100%",
          height: "100%",
          display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap:"30px"
        }}
      >
        <span className="title">Project Details</span>
        <div className="project-value-list">
          <div className="project-value" style={{display: "flex"}}>
            <label>Title</label>
            <input
                className="value"
                type="text" value={currentProject?.title}
                onChange={(e) => {updateProject({localId: currentProject?.localId, title: e.target.value} as ReduxUpdateProjectPartial)}}
            />
          </div>
          <div className="project-value" style={{display: "flex"}}>
            <label>Description</label>
            <textarea
                rows={4}
                className="value"
                value={currentProject?.description}
                onChange={(e) => {updateProject({localId: currentProject?.localId, description: e.target.value} as ReduxUpdateProjectPartial)}}
            />
          </div>
          {!isEdit &&
            <div className="project-value" style={{display: "flex"}}>
              <label>Template</label>
              <Select
                  className="value framework-select"
                  value={projectTemplateOption}
                  options={projectTemplateOptions}
                  onChange={(selected) => updateProject({
                    localId: currentProject?.localId,
                    template: selected?.value || 'none'
                  } as ReduxUpdateProjectPartial)}
              />
            </div>
          }
          {isFrameworkEnabled &&
            <>
            <div className="project-value" style={{display: "flex"}}>
              <label>Framework</label>
              <Select
                  className="value framework-select"
                  value={projectFrameworkOption}
                  options={frameworkOptions}
                  onChange={(selected) => updateProject({
                    localId: currentProject?.localId,
                    framework: selected?.value || 'none'
                  } as ReduxUpdateProjectPartial)}
              />
            </div>
            <div className="project-value" style={{display: "flex"}}>
              <label>Toolchain</label>
              <Select
              className="value framework-select"
              value={projectToolchainOption}
              options={toolchainOptions}
              onChange={(selected) => updateProject({localId: currentProject?.localId, toolchain: selected?.value || 'none'} as ReduxUpdateProjectPartial)}
              />
            </div>
            </>
          }
          <div style={{display:"flex", flexDirection:"row", gap:"20px"}}>
            <button
                className="button is-primary is-small"
                onClick={handleSaveClick}
                disabled={currentProject?.synced}
            >
              Save
            </button>
          </div>
        </div>
        <ApiFlowStatus reqMsg="Saving Project ..." apiFlowState={apiState} />
      </div>
  );
}

export default ProjectEdit;