import React, {useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {useActions} from "../../hooks/use-actions";
import {randomIdGenerator} from "../../state/id";
import {ProjectFrameworks, ReactToolchains} from "../../state";
import ProjectEdit from "./project-edit";
import {useTypedSelector} from "../../hooks/use-typed-selector";
import LoadingIndicator from "../common/loading-indicator";

const ProjectPlayground:React.FC = () => {
  // const navigate = useNavigate();

  const {authenticateUser, createAndSetProject} = useActions();
  const isAuthenticated = useTypedSelector<boolean>(state => state.auth.isAuthenticated);
  const currentProjectId = useTypedSelector(state => state.projects.currentProjectId);

  useEffect(() => {
    console.log(`ProjectPlayground:useEffect[]`);


    // Here login using anonymous user
    return () => {
      console.log(`ProjectPlayground:destroyed`);
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      authenticateUser('anonymous@webappstarter.com', 'Anonymous123');
    } else {
      createAndSetProject({
        localId: randomIdGenerator(),
        title: '',
        description: '',
        framework: ProjectFrameworks.REACTJS,
        toolchain: ReactToolchains.VITE
      });
      // navigate(RoutePath.PROJECT_NEW);
    }
  }, [isAuthenticated]);

  console.log(`ProjectPlayground:render`);

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