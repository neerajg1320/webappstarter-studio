import {useParams, useNavigate} from 'react-router-dom';
import {useActions} from "../../hooks/use-actions";
import {useEffect} from "react";
import {RoutePath} from "../routes";
import {useTypedSelector} from "../../hooks/use-typed-selector";
import ProjectCell from "./project-cell/project-cell";

const ProjectFetch = () => {
  const {projectId} = useParams();
  const {fetchProjectFromServer, initializeBundler} = useActions();
  // const navigate = useNavigate();
  const currentProjectLocalId = useTypedSelector((state) => state.projects.currentProjectId);
  const bundlerInitiated = useTypedSelector(state => state.application.bundlerInitiated)

  useEffect(() => {
    console.log(`currentProjectLocalId: ${currentProjectLocalId}`);
    if (!currentProjectLocalId) {
      fetchProjectFromServer(projectId);
    }
    else {
      if (!bundlerInitiated) {
        initializeBundler();
      }
    }
  }, [currentProjectLocalId, bundlerInitiated]);

  return (
      <>
        {currentProjectLocalId ?
        <ProjectCell />
        :
        <div>
          {`Fetching Project id: ${projectId}`}
        </div>
        }
      </>
  )
}

export default ProjectFetch;