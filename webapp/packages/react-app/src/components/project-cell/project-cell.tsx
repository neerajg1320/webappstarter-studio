import "./project-cell.css";
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import Preview from "../file-cell/preview";
import {useActions} from "../../hooks/use-actions";
import {useTypedSelector} from "../../hooks/use-typed-selector";
import Resizable from "../file-cell/resizable";
import CodeEditor from "../file-cell/code-editor";
import FilesTree from "../files-tree/files-tree";
import {ReduxFile, ReduxProject} from "../../state";
import FileList from "../cell-list/file-list";
import {debugRedux} from "../../config/global";
import FileControlBar from "../file-cell/file-control-bar";
import FileTreeControlBar, {FileTreeEvent} from "../files-tree/file-tree-control-bar";

interface ProjectCellProps {
  reduxProject: ReduxProject;
}
const ProjectCell:React.FC<ProjectCellProps> = ({reduxProject}) => {
  if (debugRedux) {
    console.log(`reduxProject`, JSON.stringify(reduxProject, null, 2));
  }

  const { createProjectBundle, updateFile } = useActions();

  const filesState = useTypedSelector((state) => state.files);
  const bundlesState =  useTypedSelector((state) => state.bundles);
  const [editedFileLocalId, setEditedFileLocalId] = useState<string|null>(null);
  // Kept for usage with CodeEditor as it keeps only the first instance of handleEditorChange
  const editedFileRef = useRef<ReduxFile|null>(null);

  const editedFile = useMemo<ReduxFile|null>(() => {
    if (editedFileLocalId) {
      editedFileRef.current = filesState.data[editedFileLocalId];
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

  useEffect( () => {
    console.log(`editedFileLocalId: ${editedFileLocalId}`);
    if (!editedFileLocalId) {
      return;
    }

    const fileState = filesState.data[editedFileLocalId];
    if (!fileState) {
      return;
    }

    if (!fileState.contentSynced) {
      // This causes two renders as this is asynchronous call
      fetchFileContents([editedFileLocalId]);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editedFileLocalId, filesState]);


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

  // We use the callback with no subsequent updates no avoid unnecessary rerender of Editor
  const handleEditorChange = useCallback((value:string) => {
    if (editedFileRef.current && editedFileRef.current.localId) {
      // console.log(`file[${editedFileRef.current.localId}]: value=${value}`)
      updateFile({localId: editedFileRef.current.localId, content:value});
    }
  }, []);

  const handleFileTreeControlEvent = (event: FileTreeEvent) => {

  }

  if (!reduxProject) {
    return <h1>reduxProject:{reduxProject} is not defined</h1>
  }

  return (
    <div className="project-cell-wrapper">
      <div style={{width: "100%"}}>
        <Resizable direction="vertical">
          <div style={{height: 'calc(100% - 10px)', display: "flex", flexDirection: "row"}}>
            <Resizable direction="horizontal">
              <div style={{width:"100%", display:"flex", flexDirection:"column"}}>
                {editedFile && <FileControlBar reduxFile={editedFile} />}
                <CodeEditor
                    // localId={editedFile?.localId || 'null'}
                    initialValue={editedFile?.content || ''}
                    // initialValue={'Helo there '}
                    onChange={handleEditorChange}
                />
              </div>
            </Resizable>
            {/* <pre>{code}</pre> */}
            <div style={{
                overflow:"scroll",
                border: "1px solid lightblue",
                flexGrow: 1
              }}
            >
              <div style={{
                width: "100%", height: "100%",
                display:"flex", flexDirection:"column", gap:"2px", justifyContent: "space-between",
              }}
              >
                {/* File Tree Operations*/}
                <FileTreeControlBar reduxProject={reduxProject} onEvent={handleFileTreeControlEvent}/>
                <div style={{
                    border: "1px solid lightcyan",
                    flexGrow: 1
                  }}
                >
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
      {/*<div style={{width: "100%", height: "100%"}}>*/}
      {/*  {projectFiles && <FileList project={reduxProject} files={projectFiles} />}*/}
      {/*</div>*/}
    </div>
  );
}

export default ProjectCell;
