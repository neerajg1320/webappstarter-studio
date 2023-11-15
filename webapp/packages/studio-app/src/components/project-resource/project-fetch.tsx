import {useParams, useNavigate} from 'react-router-dom';
import {useActions} from "../../hooks/use-actions";
import {lazy, useEffect, Suspense} from "react";
import {RoutePath} from "../routes";
import {useTypedSelector} from "../../hooks/use-typed-selector";
// import ProjectCell from "./project-cell/project-cell";
import {debugComponent} from "../../config/global";

const ProjectCell = lazy(() => import("./project-cell/project-cell"));

const ProjectFetch = () => {
  const {projectId} = useParams();
  const {fetchProjectFromServer, initializeBundler} = useActions();
  // const navigate = useNavigate();
  const currentProjectLocalId = useTypedSelector((state) => state.projects.currentProjectId);
  const bundlerInitiated = useTypedSelector(state => state.application.bundlerInitiated)

  useEffect(() => {
    if (!bundlerInitiated) {
      initializeBundler();
    }
  }, [bundlerInitiated])

  useEffect(() => {
    if (debugComponent) {
      console.log(`currentProjectLocalId: ${currentProjectLocalId}`);
    }

    if (!currentProjectLocalId) {
      fetchProjectFromServer(projectId);
    }
  }, [currentProjectLocalId]);

  return (
      <>
        {currentProjectLocalId ?
        <>
          <Suspense fallback={<div>{`Loading Project IDE`}</div>}>
            <ProjectCell />
          </Suspense>
        </>
        :
        <div>{`Fetching Project details id:${projectId}`}</div>
        }
      </>

  )
}

export default ProjectFetch;