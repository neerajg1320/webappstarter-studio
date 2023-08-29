import "./project-cell.css";
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {useActions} from "../../hooks/use-actions";
import {useTypedSelector} from "../../hooks/use-typed-selector";
import Resizable from "../file-cell/resizable";
import CodeEditor from "../file-cell/code-editor";
import FilesTree from "../files-tree/files-tree";
import {ReduxFile, ReduxProject} from "../../state";
import {debugComponent} from "../../config/global";

import FileCellControlBar from "../file-cell/file-cell-control-bar";
import FileList from "../cell-list/file-list";
import PreviewTabs from "../preview-section/preview-tabs";
import {BundleLanguage, pathToBundleLanguage} from "../../state/bundle";
import {getFileTypeFromPath} from "../../utils/path";
import {CodeLanguage} from "../../state/language";
import {htmlNoScript} from "../preview-section/preview-iframe/markup";
// const debugComponent = true;

interface ProjectCellProps {
  // reduxProject: ReduxProject;
  projectLocalId: string;
}

// We will change back passing the projectLocalId as the project state gets changed by the time the component
// is rendered.
const ProjectCell:React.FC<ProjectCellProps> = ({projectLocalId}) => {
  // const debugComponent = true;

  useEffect(() => {
    if (debugComponent) {
      console.log('ProjectCell: useEffect[] firstRender');
    }

    return () => {
      if (debugComponent) {
        console.log('ProjectCell: destroyed');
      }
    }
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [showCellsList, setShowCellsList] = useState<boolean>(false);
  const { createProjectBundle, updateProject, downloadProjectZip, downloadFetchProjectZip, updateFile } = useActions();

  const projectsState = useTypedSelector((state) => state.projects);
  const filesState = useTypedSelector((state) => state.files);
  const bundlesState =  useTypedSelector((state) => state.bundles);
  const currentUser =  useTypedSelector((state) => state.auth.currentUser);
  const [editedFileLocalId, setEditedFileLocalId] = useState<string|null>(null);
  // Kept for usage with CodeEditor as it keeps only the first instance of handleEditorChange
  const editedFileRef = useRef<ReduxFile|null>(null);

  const reduxProject = useMemo(() => {
    return projectsState.data[projectLocalId];
  }, [projectLocalId, projectsState]);

  if (debugComponent) {
    console.log(`ProjectCell:render reduxProject`, reduxProject);
  }

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

  if (debugComponent) {
    console.log(`ProjectCell: editedFile:`, editedFile);
  }

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

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (debugComponent) {
      console.log(`ProjectCell: useEffect([reduxProject]) reduxProject:`, reduxProject)
    }

    // This has been placed here so that we can download index.html even when we reach here after creating project,
    // because in that case the projectLocalId does not change but the project state changes.
    if (reduxProject.entryHtmlFileLocalId) {
      const htmlFile = filesState.data[reduxProject.entryHtmlFileLocalId];
      if (!htmlFile.contentSynced && !htmlFile.requestInitiated) {
        fetchFileContents([reduxProject.entryHtmlFileLocalId]);
      }
    }
  }, [reduxProject, filesState.data]);


  useEffect(() => {
    if (debugComponent) {
      console.log(`ProjectCell: useEffect([reduxProject])`)
    }

    setEditedFileLocalId(null);
  }, [reduxProject.localId]);

  useEffect(() => {
    if (debugComponent) {
      console.log(`bundlesState:`, bundlesState);
    }
  }, [bundlesState]);

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

  const handleProjectBundleClick = () => {
    if (debugComponent) {
      console.log(`reduxProject:`, reduxProject);
      console.log(`currentUser: `, currentUser);
    }

    if (reduxProject.entry_path) {
      updateProject({localId: reduxProject.localId, bundleLocalId: reduxProject.localId})

      // We have used entry_path as it is the path on the server that matters!
      const bundleLanguage = pathToBundleLanguage(reduxProject.entry_path)

      if (bundleLanguage !== BundleLanguage.UNKNOWN) {
        if (currentUser) {
          // The project entry path is hard coded for media folder. Need to make it more flexible when need arises.
          const projectPath = `mediafiles/user_${currentUser.pkid}/${reduxProject.folder}`;
          createProjectBundle(
              reduxProject.localId,
              projectPath,
              `${reduxProject.entry_path}`,
              bundleLanguage
          );
        }
      } else {
        console.error(`Error! file type ${getFileTypeFromPath(reduxProject.entry_path)} not supported`)
      }

    } else {
      console.error(`Error! entry_path is not set for project '${reduxProject?.title}'`);
    }
  }

  const handleProjectZipClick = () => {
    // Even download with fetch did not give content disposition !!
    // downloadFetchProjectZip(reduxProject.localId);
    downloadProjectZip(reduxProject.localId);
  }

  const handleProjectDownloadClick = () => {
    if (reduxProject.zipBlob) {
      console.log(`Download blob.`);

      const tempObjUrl = window.URL.createObjectURL(new Blob([reduxProject.zipBlob]));
      const link = document.createElement('a');
      link.href = tempObjUrl;
      link.setAttribute('download', `${reduxProject.folder}.zip`); //or any other extension
      document.body.appendChild(link);
      link.click();
    }
  }

  useEffect(() => {
    if (debugComponent) {
      console.log(`reduxProject zip blob changed zipBlob:`, reduxProject.zipBlob);
    }
  }, [reduxProject.zipBlob]);

  const handleFileTreeSelectedFileChange = (fileLocalId: string) => {
    if (debugComponent) {
      console.log(`handleFileTreeSelectedFileChange: ${fileLocalId}`);
    }

    setEditedFileLocalId(fileLocalId);
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
              <div style={{width:"100%", display:"flex", flexDirection:"column", border: "3px solid lightblue"}}>
                <div className="file-cell-control-bar-wrapper">
                  {editedFile && <FileCellControlBar reduxFile={editedFile} />}
                </div>

                {(editedFile && editedFile.contentSynced) ?
                  <CodeEditor
                      path={editedFile?.path}
                      value={editedFile?.content || ""}
                      language={editedFile?.language || CodeLanguage.UNKNOWN}
                      onChange={handleEditorChange}
                      disabled={!editedFile}
                  />
                    :
                    <div style={{
                      height: "100%", width:"100%",
                      display:"flex", flexDirection: "column", justifyContent:"center", alignItems: "center",
                    }}
                    >
                      <h3>Select a File</h3>
                    </div>
                }
              </div>
            </Resizable>
            {/* <pre>{code}</pre> */}
            {/* The file-tree wrapper component */}
            <div style={{
                overflow:"scroll",
                // border: "1px solid lightblue",
                flexGrow: 1,
                marginLeft: "10px",
              }}
            >
              <div style={{
                width: "100%", height: "100%",
                display:"flex", flexDirection:"column", gap:"2px", justifyContent: "space-between",
              }}
              >
                <div style={{
                    // border: "1px solid lightcyan",
                    // flexGrow: 1
                  }}
                >
                  <FilesTree
                      reduxProject={reduxProject}
                      onSelectedFileChange={handleFileTreeSelectedFileChange}
                  />
                </div>
                <div style={{display:"flex", flexDirection:"row", gap:"10px", padding: "10px"}}>
                  <button
                      className="button is-family-secondary is-small"
                      onClick={handleProjectBundleClick}
                      disabled={!reduxProject.synced}
                  >
                    Bundle
                  </button>
                  <button
                      className="button is-family-secondary is-small"
                      style={{width: "80px"}}
                      onClick={handleProjectZipClick}
                      disabled={!reduxProject.synced}
                  >
                    Zip
                  </button>
                  <button
                      className="button is-family-secondary is-small"
                      style={{width: "80px"}}
                      onClick={handleProjectDownloadClick}
                      disabled={!reduxProject.zipBlob}
                  >
                    Download
                  </button>
                </div>

              </div>
            </div>
          </div>
        </Resizable>
      </div>

      {/* TBD: We can try to make this resizable as well */}
      {/*<div style={{height:"200px"}}>*/}
      <div style={{}}>
        {/* We have to put Tab component here*/}
        {
            (reduxProject.bundleLocalId && bundlesState[reduxProject.bundleLocalId]) &&
            <div style={{height: "100%"}}>
              {/* We can pass iframe id in case we are using multiple preview windows. */}
              <PreviewTabs
                  html={htmlNoScript}
                  code={bundlesState[reduxProject.bundleLocalId]!.code}
                  err={bundlesState[reduxProject.bundleLocalId]!.err}
              />
            </div>
        }
        
      </div>

      {debugComponent &&
        <div style={{height: "100px"}}>
          {editedFile &&
              <div style={{height: "100%"}}>
                <h4>file.content</h4>
                <pre>{editedFile.content}</pre>

                <h4>saveFilePartial.content</h4>
                {/*<pre>{editedFile.saveFilePartial.content}</pre>*/}
                {/*<pre>{JSON.stringify(editedFile.saveFilePartial, null, 2)}</pre>*/}
              </div>
          }
        </div>
      }

      {showCellsList &&
        <div style={{width: "100%", height: "100%"}}>
          {projectFiles && <FileList project={reduxProject} files={projectFiles} />}
        </div>
      }
    </div>
  );
}

export default ProjectCell;
