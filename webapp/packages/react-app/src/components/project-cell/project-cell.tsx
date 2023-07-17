import "./project-cell.css";
import React, {useEffect, useMemo, useState} from 'react';
import Preview from "../file-cell/preview";
import {useActions} from "../../hooks/use-actions";
import {useTypedSelector} from "../../hooks/use-typed-selector";
import Resizable from "../file-cell/resizable";
import CodeEditor from "../file-cell/code-editor";
import FilesTree from "../files-tree/files-tree";
import {ReduxFile, ReduxProject} from "../../state";
import FileList from "../cell-list/file-list";
import {debugRedux} from "../../config/global";

interface ProjectCellProps {
  reduxProject: ReduxProject;
}
const ProjectCell:React.FC<ProjectCellProps> = ({reduxProject}) => {
  if (debugRedux) {
    console.log(`reduxProject`, JSON.stringify(reduxProject, null, 2));
  }

  const { createProjectBundle } = useActions();

  const filesState = useTypedSelector((state) => state.files);
  const bundlesState =  useTypedSelector((state) => state.bundles);
  const [editedFileLocalId, setEditedFileLocalId] = useState<string|null>(null);
  const editedFile = useMemo<ReduxFile|null>(() => {
    if (editedFileLocalId) {
      return filesState.data[editedFileLocalId];
    }
    return null;
  }, [editedFileLocalId, filesState]);

  // Temporary till we fix layout
  // const [editorContent, setEditorContent] = useState<string>('');
  const { fetchFileContents } = useActions();

  const projectFiles = useMemo<ReduxFile[]|null>(() => {
    if (debugRedux || true) {
      console.log(`filesState:`, filesState);
    }
    if (reduxProject && filesState) {
      return Object.entries(filesState.data).map(([k, v]) => v).filter(file => {
        return file.projectLocalId && file.projectLocalId === reduxProject.localId;
      });
    }
    return null;
  }, [filesState, reduxProject]);

  useEffect(() => {
    setEditedFileLocalId(null);
  }, [reduxProject]);

  useEffect(() => {
    if (!editedFileLocalId) {
      return;
    }

    const fileState = filesState.data[editedFileLocalId];
    if (!fileState) {
      return;
    }

    if (!fileState.contentSynced) {
      fetchFileContents([editedFileLocalId]);
    }

    // setEditorContent(fileState.content || '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editedFileLocalId, filesState]);

  if (!reduxProject) {
    return <h1>reduxProject:{reduxProject} is not defined</h1>
  }

  const handleBundleClick = () => {
    // console.log(`currentProject: ${JSON.stringify(currentProject, null, 2)}`);

    if (reduxProject.entry_path) {
      createProjectBundle(reduxProject.localId, `${reduxProject.folder}/${reduxProject.entry_path}`);
    } else {
      console.error(`Error! entry_path is not set for project '${reduxProject?.title}'`);
    }
  }

  const handleFileTreeSelectedFileChange = (fileLocalId: string) => {
    setEditedFileLocalId(fileLocalId);
  }

  const handleEditorChange = (value:string) => {

  }

  return (
    <div className="project-cell-wrapper">
      <div style={{width: "100%"}}>
        <Resizable direction="vertical">
          <div style={{height: 'calc(100% - 10px)', display: "flex", flexDirection: "row"}}>
            <Resizable direction="horizontal">
              <CodeEditor initialValue={editedFile?.content || ''} onChange={handleEditorChange} />
            </Resizable>
            {/* <pre>{code}</pre> */}
            <div style={{overflow:"scroll"}}>
              <div style={{
                width: "100%", height: "100%",
                display:"flex", flexDirection:"column", gap:"20px", justifyContent: "space-between",
              }}
              >
                <div>
                  <FilesTree
                      project={reduxProject}
                      onSelectedFileChange={handleFileTreeSelectedFileChange}
                  />
                </div>
                <div style={{display:"flex", flexDirection:"row", gap:"10px", padding: "10px"}}>
                  <button
                      className="button is-family-secondary is-small"
                      onClick={handleBundleClick}
                      disabled={!reduxProject.synced}
                  >
                    Bundle
                  </button>
                </div>

              </div>
            </div>
          </div>
        </Resizable>
      </div>

      {/* TBD: We can try to make this resizable as well */}
      <div style={{height:"200px"}}>
        {(bundlesState[reduxProject.localId]) &&
            <div style={{height: "100%"}}>
              {/*<pre>{bundlesState[currentProject.localId]!.code}</pre>*/}
              <Preview code={bundlesState[reduxProject.localId]!.code} err={bundlesState[reduxProject.localId]!.err}/>
            </div>
        }
      </div>
      <div style={{width: "100%", height: "100%"}}>
        {projectFiles && <FileList project={reduxProject} files={projectFiles} />}
      </div>
    </div>
  );
}

export default ProjectCell;
