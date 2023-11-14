import {useParams} from 'react-router-dom';
import {useActions} from "../../hooks/use-actions";

const ProjectFetch = () => {
  const {idType, idValue} = useParams();
  const {fetchProject} = useActions();

  return (
      <div>
        Fetch Project for {`${idType} ${idValue}`}
      </div>
  )
}

export default ProjectFetch;