import "./project-cell.css";
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import Preview from "../file-cell/preview";
import {useActions} from "../../hooks/use-actions";
import {useTypedSelector} from "../../hooks/use-typed-selector";
import Resizable from "../file-cell/resizable";
import CodeEditor from "../file-cell/code-editor";
import FilesTree from "../files-tree/files-tree";
import {ReduxFile, ReduxProject} from "../../state";
import {debugComponent} from "../../config/global";
import FileCellControlBar from "../file-cell/file-cell-control-bar";
import FileTreeControlBar, {FileTreeEvent} from "../files-tree/file-tree-control-bar";
import FileList from "../cell-list/file-list";

interface ProjectCellProps {
  reduxProject: ReduxProject;
}
const ProjectCell:React.FC<ProjectCellProps> = ({reduxProject}) => {
  useEffect(() => {
    if (debugComponent) {
      console.log('ProjectCell: useEffect[] firstRender');
    }

    return () => {
      console.log('ProjectCell: destroyed');
    }
  }, []);

  if (debugComponent) {
    console.log(`ProjectCell:render reduxProject`, reduxProject);
  }

  const [showCellsList, setShowCellsList] = useState<boolean>(false);
  const { createProjectBundle, updateProject, updateFile } = useActions();

  const filesState = useTypedSelector((state) => state.files);
  const bundlesState =  useTypedSelector((state) => state.bundles);
  const [editedFileLocalId, setEditedFileLocalId] = useState<string|null>(null);
  // Kept for usage with CodeEditor as it keeps only the first instance of handleEditorChange
  const editedFileRef = useRef<ReduxFile|null>(null);

  // The following is used in the FileList component
  // eslint-disable-next-line
  const projectFiles:ReduxFile[] = useMemo(() => {
    if (reduxProject) {
      const files = Object.entries(filesState.data)
          .filter(([k, v]) => v.projectLocalId === reduxProject.localId)
          .map(([k, v]) => v);

      // console.log(`files:`, files);
      return files;
    }

    return [];
  }, [reduxProject, filesState.data]);

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

  // We use the callback with no subsequent updates no avoid unnecessary rerender of Editor
  const handleEditorChange = useCallback((value:string) => {
    const _editedFile = editedFileRef.current;
    // console.log('editedFile:', editedFile);

    if (_editedFile && _editedFile.localId && _editedFile.isEditAllowed) {
      if (debugComponent) {
        console.log(`file[${_editedFile.localId}]: value=${value}`)
      }

      updateFile({localId: _editedFile.localId, content:value});
    }
  }, []);


  useEffect(() => {
    console.log(`ProjectCell: useEffect([reduxProject])`)
    setEditedFileLocalId(null);
  }, [reduxProject.localId]);

  useEffect( () => {
    if (debugComponent) {
      console.log(`editedFile:`, editedFile);
    }

    if (!editedFile) {
      return;
    }

    if (!editedFile.contentSynced && !editedFile.requestInitiated) {
      // This causes two renders as this is asynchronous call
      fetchFileContents([editedFile.localId]);
    }

    if (editedFile.contentSynced) {
      updateFile({localId:editedFile.localId, isEditAllowed:true})
    }

    // Note we have to make sure that we do not use editedFile with JSON.stringify
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(editedFile)]);


  const handleBundleClick = () => {
    // console.log(`currentProject: ${JSON.stringify(currentProject, null, 2)}`);

    if (reduxProject.entry_path) {
      createProjectBundle(reduxProject.localId, `${reduxProject.folder}/${reduxProject.entry_path}`);
      updateProject({localId: reduxProject.localId, bundleLocalId: reduxProject.localId})
    } else {
      console.error(`Error! entry_path is not set for project '${reduxProject?.title}'`);
    }
  }

  const handleFileTreeSelectedFileChange = (fileLocalId: string) => {
    console.log(`handleFileTreeSelectedFileChange: ${fileLocalId}`);
    setEditedFileLocalId(fileLocalId);
  }

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
                <div style={{
                  height: "60px",
                  padding:"0 10px",
                  border: "1px solid yellow",
                  display: "flex",
                }}
                >
                  {editedFile && <FileCellControlBar reduxFile={editedFile} />}
                </div>

                <CodeEditor
                    initialValue={editedFile?.content || "Start Coding"}
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
        {(reduxProject.bundleLocalId && bundlesState[reduxProject.bundleLocalId]) &&
            <div style={{height: "100%"}}>
              {/*<pre>{bundlesState[currentProject.bundleLocalId]!.code}</pre>*/}
              <Preview
                  code={bundlesState[reduxProject.bundleLocalId]!.code}
                  err={bundlesState[reduxProject.bundleLocalId]!.err}
              />
            </div>
        }
      </div>

      <div style={{height: "100px"}}>
        <h4>saveFilePartial</h4>
        {editedFile && <pre>{JSON.stringify(editedFile.saveFilePartial, null, 2)}</pre>}
      </div>

      {showCellsList &&
        <div style={{width: "100%", height: "100%"}}>
          {projectFiles && <FileList project={reduxProject} files={projectFiles} />}
        </div>
      }
    </div>
  );
}

export default ProjectCell;
