import ProjectCell from "../project-cell/project-cell";
import React, {useCallback, useMemo, useState} from "react";
import ProjectResourceDashboard from "./project-resource-dashboard";
import {ReduxProject} from "../../state";
import {useTypedSelector} from "../../hooks/use-typed-selector";

const ProjectMainView = () => {
  const [selectedProjectLocalId, setSelectedProjectLocalId] = useState<string|null>(null);
  const projectsState = useTypedSelector((state) => state.projects);

  const selectedProject = useMemo(() => {
    if (selectedProjectLocalId && projectsState.data) {
      return projectsState.data[selectedProjectLocalId]
    }
  }, [projectsState.data, selectedProjectLocalId])

  const handleProjectChange = useCallback((localId:string) => {
    setSelectedProjectLocalId(localId);
  }, []);


  return (
    <>
      <ProjectResourceDashboard onProjectChange={handleProjectChange}/>

      <div style={{width: "100%", marginTop: "10px"}}>
        {selectedProject && <ProjectCell reduxProject={selectedProject}/>}
      </div>
    </>
  );
}

export default ProjectMainView;