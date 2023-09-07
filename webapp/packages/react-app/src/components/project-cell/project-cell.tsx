import "./project-cell.css";
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {useActions} from "../../hooks/use-actions";
import {useTypedSelector} from "../../hooks/use-typed-selector";
import Resizable from "../file-cell/resizable";
import CodeEditor from "../file-cell/code-editor";
import FilesList from "../files-tree/files-browser";
import {ReduxFile, ReduxProject} from "../../state";
import {autoBundleDebounce, autoSaveDebounce, debugComponent} from "../../config/global";

import FileCellControlBar, {FileCellEventType} from "../file-cell/file-cell-control-bar";
import FileList from "../cell-list/file-list";
import PreviewTabs from "../preview-section/preview-tabs";
import {BundleLanguage, pathToBundleLanguage} from "../../state/bundle";
import {getFileTypeFromPath} from "../../utils/path";
import {CodeLanguage} from "../../state/language";
import {htmlNoScript} from "../preview-section/preview-iframe/markup";
import useDebouncedCallback from "../../hooks/use-debounced-callback";
// const debugComponent = true;

interface ProjectCellProps {
  // reduxProject: ReduxProject;
  // projectLocalId: string;
}

// We will change back passing the projectLocalId as the project state gets changed by the time the component
// is rendered.
const ProjectCell:React.FC<ProjectCellProps> = () => {
  const debugComponent = false;
  const debugComponentLifecycle = debugComponent || false;

  useEffect(() => {
    if (debugComponentLifecycle) {
      console.log('ProjectCell: useEffect[] firstRender');
    }

    return () => {
      if (debugComponentLifecycle) {
        console.log('ProjectCell: destroyed');
      }
    }
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [showCellsList, setShowCellsList] = useState<boolean>(false);
  const { createProjectBundle, updateProject, downloadProjectZip, saveFile, updateFile } = useActions();

  const projectsState = useTypedSelector((state) => state.projects);
  const filesState = useTypedSelector((state) => state.files);
  const bundlesState =  useTypedSelector((state) => state.bundles);
  const currentUser =  useTypedSelector((state) => state.auth.currentUser);
  const [htmlContent, setHtmlContent] = useState<string|null>(null);

  const [editedFileLocalId, setEditedFileLocalId] = useState<string|null>(null);
  // Kept for usage with CodeEditor as it keeps only the first instance of handleEditorChange
  const editedFileRef = useRef<ReduxFile|null>(null);
  const hotReload = useTypedSelector(state => state.application.hotReload);
  // Kept due to the behaviour of the editor onChange callback
  const hotReloadRef = useRef<boolean>(hotReload);
  const autoSave = useTypedSelector(state => state.application.autoSave);
  // Kept due to the behaviour of the editor onChange callback
  const autoSaveRef = useRef<boolean>(hotReload);
  const downloadClickedRef = useRef<boolean>(false);

  useEffect(() => {
    hotReloadRef.current = hotReload;
  }, [hotReload])

  useEffect(() => {
    autoSaveRef.current = autoSave;
  }, [autoSave])

  const projectLocalId = useTypedSelector(state => state.projects.currentProjectId) || "";
  const reduxProject = useMemo(() => {
    return projectsState.data[projectLocalId];
  }, [projectLocalId, projectsState]);

  if (debugComponent && false) {
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

  if (debugComponent && false) {
    console.log(`ProjectCell: editedFile:`, editedFile);
  }

  // Temporary till we fix layout
  // const [editorContent, setEditorContent] = useState<string>('');
  const { fetchFileContents } = useActions();

  // We are using refs because this function is stuck in time :) It gets embedded in editor with initial state
  const handleEditorChange = (value:string) => {
    const _editedFile = editedFileRef.current;

    if (_editedFile && _editedFile.localId && _editedFile.isEditAllowed) {
      if (debugComponent || false) {
        console.log('handleEditorChange: _editedFile:', _editedFile);
        console.log(`handleEditorChange: file[${_editedFile.localId}]: value=${value}`)
      }

      if (_editedFile.content !== value) {
        updateFile({localId: _editedFile.localId, content: value});

        if (hotReloadRef.current) {
          bundleProjectDebounced();
        }

        if (autoSaveRef.current) {
          saveFileDebounced();
        }
      } else {
        // This happens when we select a file in the file-tree component. Its just the editor content that changes, but
        // the contents of the selected file haven't changed
        if (debugComponent) {
          console.log(`The file content has not changed.`);
        }
      }
    }
  };

  useEffect(() => {
    if (debugComponent) {
      console.log(`useEffect[reduxProject.ideReady] ideReady:${reduxProject.ideReady}`);
    }
    // Using bundleProject causes plugin-load-from-redux to give error
    bundleProject();
  }, [reduxProject.ideReady]);

  useEffect(() => {
    if (debugComponent) {
      console.log(`ProjectCell: useEffect([reduxProject]) reduxProject:`, reduxProject)
    }

    let _selectedFileId = reduxProject.selectedFileLocalId;

    if (reduxProject.entryFileLocalId) {
      const entryFile = filesState.data[reduxProject.entryFileLocalId];
      if (entryFile) {
        if (!entryFile.contentSynced) {
          if (!entryFile.requestInitiated) {
            fetchFileContents([reduxProject.entryFileLocalId]);
          }
        } else {
          if (!reduxProject.ideReady) {
            updateProject({localId:projectLocalId, ideReady: true})
          }
        }
      } else {
        // This could happen when we render the project and the files haven't been loaded
        console.log("ProjectCell:useEffect entryFile not found");
      }

      if (!_selectedFileId) {
        _selectedFileId = reduxProject.entryFileLocalId;
      }
    }

    // This has been placed here so that we can download index.html even when we reach here after creating project,
    // because in that case the projectLocalId does not change but the project state changes.
    let _htmlContent:string|null = null;
    if (reduxProject.entryHtmlFileLocalId) {
      const htmlFile = filesState.data[reduxProject.entryHtmlFileLocalId];
      if (htmlFile) {
        if (htmlFile.contentSynced) {
          _htmlContent = htmlFile.content;
        } else {
          if (!htmlFile.requestInitiated) {
            fetchFileContents([reduxProject.entryHtmlFileLocalId]);
          }
        }
      } else {
        console.log("The project html not found. Using default html file");
      }
      if (!_selectedFileId) {
        _selectedFileId = reduxProject.entryHtmlFileLocalId;
      }
    }
    if (!_htmlContent) {
      _htmlContent = htmlNoScript
    }

    setHtmlContent(_htmlContent);

    // This happens when we reach here after creating a project
    // Check if this can be optimized since selected and edited are supposed to be same
    if (!reduxProject.selectedFileLocalId) {
      updateProject({localId: reduxProject.localId, selectedFileLocalId:_selectedFileId});
    }
    if (!editedFileLocalId) {
      setEditedFileLocalId(_selectedFileId);
    }
  }, [filesState.data]);


  useEffect(() => {
    if (debugComponent) {
      console.log(`ProjectCell: useEffect([reduxProject])`)
    }

    setEditedFileLocalId(reduxProject.selectedFileLocalId);
  }, [reduxProject.localId]);

  useEffect(() => {
    if (debugComponent) {
      console.log(`bundlesState:`, bundlesState);
    }
  }, [bundlesState]);

  useEffect( () => {
    if (debugComponent || false) {
      console.log(`JSON.stringify(editedFile):`, JSON.stringify(editedFile, null, 2));
    }

    if (!editedFile) {
      return;
    }

    if (!editedFile.contentSynced && !editedFile.requestInitiated) {
      // This causes two renders as this is asynchronous call
      fetchFileContents([editedFile.localId]);
    }

    if (editedFile.contentSynced) {
      if (!editedFile.isEditAllowed) {
        updateFile({localId: editedFile.localId, isEditAllowed: true})
      }
    }

    // Note we have to make sure that we do not use editedFile with JSON.stringify
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(editedFile)]);

  // Make sure that we do not use useCallback( ,[]) here as it matters in useDebouncedCallback
  const bundleProject = () => {
    if (reduxProject.entry_path) {
      updateProject({localId: reduxProject.localId, bundleLocalId: reduxProject.localId})

      // We have used entry_path as it is the path on the server that matters!
      const bundleLanguage = pathToBundleLanguage(reduxProject.entry_path)

      if (bundleLanguage !== BundleLanguage.UNKNOWN) {
        if (currentUser) {
          // The project entry path is hard coded for media folder. Need to make it more flexible when need arises.
          // TBD: Remove the hardcoding of the project path
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

  // TBD: Need to put in settings
  const bundleProjectDebounced = useDebouncedCallback(
      bundleProject,
      autoBundleDebounce
  );

  const saveFileDebounced = useDebouncedCallback(
      () => {
        const _editedFile = editedFileRef.current;
        // In this function also editedFile does not work properly as it is not there in the dependency list
        if (debugComponent) {
          console.log(`saveFileDebounced: _editedFile:`, _editedFile);
        }
        if (_editedFile) {
          saveFile(_editedFile.localId);
        }
      },
      autoSaveDebounce
  );

  const handleProjectBundleClick = () => {
    if (debugComponent) {
      console.log(`reduxProject:`, reduxProject);
      console.log(`currentUser: `, currentUser);
    }

    bundleProject();
  }

  const createDownloadLinkAndClick = () => {
    if (reduxProject.zipBlob) {
      if (debugComponent) {
        console.log(`createDownloadLinkAndClick(): download blob.`);
      }

      const tempObjUrl = window.URL.createObjectURL(new Blob([reduxProject.zipBlob]));
      const link = document.createElement('a');
      link.href = tempObjUrl;
      link.setAttribute('download', `${reduxProject.folder}.zip`); //or any other extension
      document.body.appendChild(link);
      link.click();
    }
  }

  const handleProjectDownloadClick = () => {
    // TBD: Add the condition of project sync and some time limit :) to avoid misuse
    // console.log(`handleProjectDownloadClick: reduxProject.downloadingZip:`, reduxProject.downloadingZip);
    if (!reduxProject.downloadingZip) {
      // console.log(`handleProjectDownloadClick: initiating download`);
      downloadClickedRef.current = true;
      downloadProjectZip(reduxProject.localId, true);
    }
  }

  // We can put reduxProject.zipBlob from dependency array. In synchronous mode this won't see downloadingZip
  // as true as that true to false will happen in downloadProjectZip only.
  // Right now we have forced the action-creator downloadProjectZip to be asynchronous.
  useEffect(() => {
    // console.log(`useEffect[reduxProject.downloadingZip]: `, reduxProject.downloadingZip);

    // If not already downloading
    if (!reduxProject.downloadingZip) {
      // In the initial state the we are not downloading and zipBlob is null
      if (reduxProject.zipBlob) {
        // console.log(`[reduxProject.downloadingZip]: Project available to download`);
        if (downloadClickedRef.current) {
          createDownloadLinkAndClick();
          downloadClickedRef.current = false;
        }
      }
    }
  }, [reduxProject.downloadingZip, reduxProject.zipBlob]);

  useEffect(() => {
    if (debugComponent) {
      console.log(`reduxProject zip blob changed zipBlob:`, reduxProject.zipBlob);
    }
  }, [reduxProject.zipBlob]);

  const handleFilesTreeOnSelect = (fileLocalId: string) => {
    if (debugComponent) {
      console.log(`handleFileTreeSelectedFileChange: ${fileLocalId}`);
    }

    // TBD: see if this can be combined
    updateProject({localId:reduxProject.localId, selectedFileLocalId: fileLocalId});
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
                  <FilesList
                      reduxProject={reduxProject}
                      onSelect={handleFilesTreeOnSelect}
                  />
                </div>
                <div style={{display:"flex", flexDirection:"row", padding: "10px", justifyContent: "space-between"}}>
                  <button
                      className="button is-family-secondary is-small"
                      onClick={handleProjectBundleClick}
                      // disabled={!reduxProject.synced}
                  >
                    Run
                  </button>

                  <div style={{width:"80px", display: "flex", flexDirection:"column", alignItems:"center"}}>
                    <button
                        className="button is-family-secondary is-small"
                        // style={{width: "80px"}}
                        onClick={handleProjectDownloadClick}
                        disabled={reduxProject.downloadingZip}
                    >
                      Download
                    </button>
                    <progress style={{width: "90%", visibility: reduxProject.downloadingZip ? "visible" : "hidden"}}/>
                  </div>
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
            (htmlContent && reduxProject.bundleLocalId && bundlesState[reduxProject.bundleLocalId]) &&
            <div style={{height: "100%"}}>
              {/* We can pass iframe id in case we are using multiple preview windows. */}
              <PreviewTabs
                  html={htmlContent}
                  code={bundlesState[reduxProject.bundleLocalId]!.code}
                  err={bundlesState[reduxProject.bundleLocalId]!.err}
              />
            </div>
        }
        
      </div>

      {(debugComponent) &&
        <div style={{height: "100px"}}>
          {editedFile &&
              <div style={{height: "100%"}}>
                <h4>file.content</h4>
                <pre>{editedFile.content}</pre>

                <h4>modifiedKeys</h4>
                <pre>{editedFile.modifiedKeys}</pre>
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
