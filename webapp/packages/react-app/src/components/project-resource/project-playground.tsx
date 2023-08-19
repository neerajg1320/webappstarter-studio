import React, {useEffect} from "react";
import {useActions} from "../../hooks/use-actions";
import {generateLocalId} from "../../state/id";
import {ProjectFrameworks, ReactToolchains} from "../../state";
import ProjectEdit from "./project-edit";
import {useTypedSelector} from "../../hooks/use-typed-selector";
import LoadingIndicator from "../common/loading-indicator";
import {debugComponent} from "../../config/global";

const ProjectPlayground:React.FC = () => {
  // const navigate = useNavigate();

  const {authenticateUser, createAndSetProject} = useActions();
  const isAuthenticated = useTypedSelector<boolean>(state => state.auth.isAuthenticated);
  const currentProjectId = useTypedSelector(state => state.projects.currentProjectId);

  useEffect(() => {
    if (debugComponent) {
      console.log(`ProjectPlayground:useEffect[]`);
    }

    // Here login using anonymous user
    return () => {
      if (debugComponent) {
        console.log(`ProjectPlayground:destroyed`);
      }
    }
  }, []);

  if (debugComponent) {
    console.log(`ProjectPlayground:render isAuthenticated=${isAuthenticated}`);
  }

  useEffect(() => {
    console.log(`ProjectPlayground:useEffect[isAuthenticated] isAuthenticated:${isAuthenticated}`);
    if (!isAuthenticated) {
      authenticateUser('anonymous@webappstarter.com', 'Anonymous123');
    } else {
      if (!currentProjectId) {
        const localId = generateLocalId();
        console.log(`Calling createAndSetProject: localId:${localId}`);

        createAndSetProject({
          localId,
          title: '',
          description: '',
          framework: ProjectFrameworks.REACTJS,
          toolchain: ReactToolchains.CREATE_REACT_APP
        });
      }
    }
  }, [isAuthenticated, currentProjectId]);

  return (
      <>
      {
        currentProjectId ? <ProjectEdit isEdit={false}/>
            : <LoadingIndicator />
      }
      </>
  )
}

export default ProjectPlayground;