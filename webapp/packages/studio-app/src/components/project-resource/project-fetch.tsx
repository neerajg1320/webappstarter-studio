import {useParams, useNavigate} from 'react-router-dom';
import {useActions} from "../../hooks/use-actions";
import {useEffect} from "react";
import {RoutePath} from "../routes";
import {useTypedSelector} from "../../hooks/use-typed-selector";

const ProjectFetch = () => {
  const {idType, idValue} = useParams();
  const {fetchProjectFromServer} = useActions();
  const navigate = useNavigate();
  const currentProjectLocalId = useTypedSelector((state) => state.projects.currentProjectId);

  useEffect(() => {
    if (idType !== "pkid") {
      console.error(`id type ${idType} is not supported`);
    }

    fetchProjectFromServer(idValue);
  }, [])

  useEffect(() => {
    console.log(`currentProjectLocalId: ${currentProjectLocalId}`);
    if (currentProjectLocalId) {
      navigate(`${RoutePath.PROJECT_CELL}/${currentProjectLocalId}`);
    }
  }, [currentProjectLocalId]);

  return (
      <div>
        Fetch Project for {`${idType} ${idValue}`}
      </div>
  )
}

export default ProjectFetch;