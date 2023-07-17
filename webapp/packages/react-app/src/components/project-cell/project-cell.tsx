import "./project-cell.css";
import React, {useEffect, useState} from 'react';
import Preview from "../file-cell/preview";
import {useActions} from "../../hooks/use-actions";
import {useTypedSelector} from "../../hooks/use-typed-selector";
import Resizable from "../file-cell/resizable";
import CodeEditor from "../file-cell/code-editor";
import FilesTree from "../files-tree/files-tree";
import {ReduxProject} from "../../state";

interface ProjectCellProps {
  reduxProject: ReduxProject;
}
const ProjectCell:React.FC<ProjectCellProps> = ({reduxProject}) => {
  console.log(`reduxProject`, JSON.stringify(reduxProject, null, 2));
  
  const { createProjectBundle } = useActions();

  const filesState = useTypedSelector((state) => state.files);
  const bundlesState =  useTypedSelector((state) => state.bundles);
  const [editedFileLocalId, setEditedFileLocalId] = useState<string|null>(null);

  // Temporary till we fix layout
  const [editorContent, setEditorContent] = useState<string>('');
  const { fetchFileContents } = useActions();

  useEffect(() => {
    if (!editedFileLocalId) {
      // console.log(`editedFileLocalId is '${editedFileLocalId}'`);
      return;
    }

    const fileState = filesState.data[editedFileLocalId];
    if (!fileState) {
      console.error(`fileState is '${fileState}' for fileId '${editedFileLocalId}'`);
      return;
    }

    if (!fileState.contentSynced) {
      fetchFileContents([editedFileLocalId]);
    }

    setEditorContent(fileState.content || '');
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

  return (
    <div className="project-cell-wrapper">
      <div style={{width: "100%"}}>
        <Resizable direction="vertical">
          <div style={{height: 'calc(100% - 10px)', display: "flex", flexDirection: "row"}}>
            <Resizable direction="horizontal">
              <CodeEditor initialValue={editorContent} onChange={setEditorContent} />
            </Resizable>
            {/* <pre>{code}</pre> */}
            <div style={{overflow:"scroll"}}>
              <div style={{
                width: "100%",
                display:"flex", flexDirection:"column", gap:"20px"
              }}
              >
                <div style={{display:"flex", flexDirection:"row", gap:"10px"}}>

                  <button
                      className="button is-family-secondary is-small"
                      onClick={handleBundleClick}
                      disabled={!reduxProject.synced}
                  >
                    Bundle
                  </button>
                </div>
                <div>
                  <FilesTree
                      project={reduxProject}
                      onSelectedFileChange={handleFileTreeSelectedFileChange}
                  />
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
    </div>
  );
}

export default ProjectCell;
