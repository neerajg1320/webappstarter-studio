import ProjectCell from "../project-cell/project-cell";
import React, {useCallback, useMemo, useState} from "react";
import ProjectGridSelection from "./project-grid-selection";
import {useTypedSelector} from "../../hooks/use-typed-selector";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProjectNavLayout from "./project-nav-layout";

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
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ProjectNavLayout />}>
            <Route index element={<ProjectGridSelection onProjectChange={handleProjectChange}/>} />
            <Route path="editor" element={selectedProject && <ProjectCell reduxProject={selectedProject}/>} />
          </Route>
        </Routes>
      </BrowserRouter>
  );

}

export default ProjectMainView;