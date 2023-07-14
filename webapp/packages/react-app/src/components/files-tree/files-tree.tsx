import './files-tree.css';
import {Project} from "../../state/project";
import {useMemo, useState} from "react";
import {useTypedSelector} from "../../hooks/use-typed-selector";
import {ReduxFile} from "../../state/file";

interface FilesTreeProps {
  project: Project
  onSelectedFileChange: (fileLocalId:string) => void
}

const FilesTree: React.FC<FilesTreeProps> = ({project, onSelectedFileChange}) => {
  const [selectedFileLocalId, setSelectedFileLocalId] = useState<string|null>(null);
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

  const handleSelectFileClick = (fileLocalId:string) => {
    console.log(fileLocalId);
    setSelectedFileLocalId(fileLocalId);
    onSelectedFileChange(fileLocalId);
  }

  return (
    <div>
      {projectFiles
        ? <ul>
          {
            projectFiles.map(file => {
              return (
                <li key={file.localId}
                    className={"file-tree-item " + ((file.localId === selectedFileLocalId) ? "selected-file" : "")}
                    onClick={() => handleSelectFileClick(file.localId)}
                >
                  {file.path}
                </li>);
            })
          }
        </ul>
        : <h1>No Files Found</h1>
      }
    </div>
  )
}

export default FilesTree;