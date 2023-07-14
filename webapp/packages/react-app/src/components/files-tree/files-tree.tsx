import {Project} from "../../state/project";

interface FilesTreeProps {
  project?: Project
}

const FilesTree: React.FC<FilesTreeProps> = ({project}) => {
  return <h1>Files Tree</h1>
}

export default FilesTree;