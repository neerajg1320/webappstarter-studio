import ProjectCell from "../project-cell/project-cell";
import React, {useCallback, useMemo, useState} from "react";
import ProjectResourceDashboard from "../project-resource/project-resource-dashboard";
import {ReduxProject} from "../../state";

const MainView = () => {
  const [selectedProject, setSelectedProject] = useState<ReduxProject>();

  const handleProjectChange = useCallback((newProject:ReduxProject) => {
    setSelectedProject(newProject);
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

export default MainView;