import {Project} from "../../state/project";
import {useMemo} from "react";
import {useTypedSelector} from "../../hooks/use-typed-selector";
import {ReduxFile} from "../../state/file";

interface FilesTreeProps {
  project: Project
}

const FilesTree: React.FC<FilesTreeProps> = ({project}) => {
  const filesState = useTypedSelector((state) => state.files);
  console.log(project);

  // eslint-disable-next-line
  const projectFiles:ReduxFile[] = useMemo(() => {
    if (project) {
      const files = Object.entries(filesState.data)
          .filter(([k, v]) => v.projectLocalId === project.localId)
          .map(([k, v]) => v);

      // console.log(`files:`, files);
      return files;
    }

    return [];
  }, [project, filesState.data]);

  return (
    <div>
      {projectFiles
        ? <ul>
          {
            projectFiles.map(file => {
              return <li key={file.localId} className="file-tree-item">{file.path}</li>
            })
          }
        </ul>
        : <h1>No Files Found</h1>
      }
    </div>
  )
}

export default FilesTree;