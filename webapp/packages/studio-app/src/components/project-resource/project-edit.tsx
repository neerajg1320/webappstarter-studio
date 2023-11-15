import './project-edit.css';
import React, {useEffect, useMemo, useRef, useState} from "react";
import {useActions} from "../../hooks/use-actions";
import Select, {SingleValue} from "react-select";
import {ReduxProject, ReduxUpdateProjectPartial, StartConfigType} from "../../state/project";
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
  const { updateProject, saveProject, deleteProject, setCurrentProjectId } = useActions();
  const isFrameworkEnabled = useMemo(() => false, []);
  const inputFileRef = useRef<HTMLInputElement>();
  const [selectedZipFile, setSelectedZipFile] = useState<File>();

  const projectsState = useTypedSelector(state => state.projects);
  const apiState = useTypedSelector(state => state.api.apiFlowState);
  const saveClickRef = useRef<boolean>(false);

  const [isImport, setImport] = useState<boolean>(false);

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

    if (!currentProject) {
      window.alert(`Please select or create a project`);
      return;
    }

    if (isImport) {
      if (!selectedZipFile) {
        window.alert(`Please select a zip file`);
        return
      }
    }

    saveProject(currentProject.localId);
  }

  useEffect(() => {
    if (debugComponent) {
      console.log(`useEffect[currentProject?.synced] synced:`, currentProject?.synced)
    }

    if (saveClickRef.current && currentProject && currentProject.synced) {
      if (isEdit) {
        navigate(RouteDepth.ONE_UP);
      } else {
        navigate(`${RoutePath.PROJECT_IDE}/${currentProject.id}`, {replace: true});
      }

      saveClickRef.current = false;
    }
  }, [currentProject?.synced]);

  const handleFileChange:React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const files = Array.from(e.target.files);
    if (e.target.files.length > 0) {
      const file = files[0];
      // console.log(`selected file: `, file);
      setSelectedZipFile(file);

      updateProject({localId: currentProject.localId, startConfigType: StartConfigType.PROJECT_ZIP, file});
    }
  }

  const handleCancelClick = () => {
    if (!currentProject.confirmed) {
      deleteProject(currentProject.localId);
      setCurrentProjectId(null);
    }
    navigate(RoutePath.BACK);
  }

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
          <div className="project-value" >
            <label>Title</label>
            <input
                className="value"
                type="text" value={currentProject?.title}
                onChange={(e) => {updateProject({localId: currentProject?.localId, title: e.target.value} as ReduxUpdateProjectPartial)}}
            />
          </div>
          <div className="project-value" >
            <label>Description</label>
            <textarea
                rows={4}
                className="value description"
                value={currentProject?.description}
                onChange={(e) => {updateProject({localId: currentProject?.localId, description: e.target.value} as ReduxUpdateProjectPartial)}}
            />
          </div>
          {!isEdit &&
            <>
              <div className="project-value">
                <label>Start Config</label>
                <div className="value">
                  <div className="radio">
                    <span>Template</span>
                    <input type="radio" name="init-type" defaultChecked={!isImport} onClick={e => setImport(false)} />
                  </div>
                  <div className="radio">
                    <span>Import</span>
                    <input type="radio" name="init-type" defaultChecked={isImport} onClick={e => setImport(true)} />
                  </div>
                </div>
              </div>

              <div className="project-value">
                {!isImport ?
                  <div className="start-config">
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
                    :
                  <div className="start-config">
                    <label>Project Zip</label>
                    <div className="value zip-upload">
                      <button className="button is-info is-small is-rounded" onClick={e => inputFileRef.current.click()}>Browse</button>
                      <input ref={inputFileRef} type="file" accept=".zip" onChange={handleFileChange} style={{display: "none"}}/>
                      {selectedZipFile &&
                        <div className="selected-file">
                          <span>{selectedZipFile.name}</span>
                        </div>
                      }
                    </div>
                  </div>
                }

              </div>
            </>
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
          <div style={{display:"flex", flexDirection:"row", gap:"20px", marginTop: "20px"}}>
            <button
                className="button is-primary is-small"
                onClick={handleSaveClick}
                disabled={currentProject?.synced}
            >
              Save
            </button>
            <button
                className="button is-family-secondary is-small"
                onClick={handleCancelClick}
                disabled={currentProject?.synced}
            >
              Cancel
            </button>
          </div>
        </div>
        <ApiFlowStatus reqMsg="Saving Project ..." apiFlowState={apiState} />
      </div>
  );
}

export default ProjectEdit;