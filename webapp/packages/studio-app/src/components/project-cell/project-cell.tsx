import "./project-cell.css";
import React, {ReactNode, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState} from 'react';
import {useActions} from "../../hooks/use-actions";
import {useTypedSelector} from "../../hooks/use-typed-selector";
// import Resizable from "../file-cell/resizable";
import {Resizable} from 'react-resizable';
import CodeEditor from "../file-cell/code-editor";
import FilesBrowser, {FileBrowserEventFunc} from "../files-browser/file-browser";
import {ReduxFile, ReduxProject} from "../../state";
import {autoBundleDebounce, autoSaveDebounce, debugComponent} from "../../config/global";

import FileCellControlBar, {FileCellEventType} from "../file-cell/file-cell-control-bar";
import FileList from "../cell-list/file-list";
import PreviewTabsPanel from "../preview-section/preview-tabs-panel";
import {BundleLanguage, pathToBundleLanguage} from "../../state/bundle";
import {getFileTypeFromPath} from "../../utils/path";
import {CodeLanguage, pathToCodeLanguage} from "../../state/language";
import {htmlNoScript} from "../preview-section/preview-iframe/markup";
import useDebouncedCallback from "../../hooks/use-debounced-callback";
import useWindowSize from "../../hooks/use-window-size";
import ResizableDiv, {ElementSize} from "../common/resizable-div/resizable-div";
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

  // TBD: 2023-09-08 This is same as reduxProject.selectFileLocalId
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

  const [remainingHeight, setRemainingHeight] = useState();

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

  if (debugComponent || false) {
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
          bundleProjectDebounced(null);
        }

        if (autoSaveRef.current) {
          saveFileDebounced(null);
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

    if (!reduxProject.selectedFileLocalId) {
      setProjectSelectedFile(_selectedFileId);
    }
  }, [filesState.data]);


  useEffect(() => {
    if (debugComponent) {
      console.log(`ProjectCell: useEffect([reduxProject])`)
    }

    setProjectSelectedFile(reduxProject.selectedFileLocalId);
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

  const setProjectSelectedFile = useCallback((fileLocalId:string|null) => {
    if (reduxProject.selectedFileLocalId) {
      updateFile({localId: reduxProject.selectedFileLocalId, isSelected: false});
    }

    updateProject({localId:reduxProject.localId, selectedFileLocalId: fileLocalId});

    if (fileLocalId) {
      updateFile({localId: fileLocalId, isSelected: true});
    }

    // TBD: see if this can be combined
    setEditedFileLocalId(fileLocalId);
  }, [reduxProject]);

  const handleFileBrowserOnSelect = (fileLocalId: string) => {
    if (debugComponent) {
      console.log(`handleFileTreeSelectedFileChange: ${fileLocalId}`);
    }

    setProjectSelectedFile(fileLocalId);
  }

  const handleFilePathChange = (localId:string, value:string) => {
    const bundleLanguage = pathToBundleLanguage(value);
    const language = pathToCodeLanguage(value);

    if (debugComponent) {
      console.log(`handleFilePathChange: ${localId}: value=${value} bundleLanguage=${bundleLanguage}`);
    }

    updateFile({localId, path:value, bundleLanguage, language});

    // TBD: Combine this with above when we are not depended on filesList component anymore
    updateFile({localId, isPathEditing:false});
    saveFile(localId);
  }


  const handleFileBrowserEvent:FileBrowserEventFunc = (type, data) => {
    if (debugComponent) {
      console.log(`ProjectCell:handleFileBrowserEvent()  type:${type} data:`, data);
    }

    switch (type) {
      case "select":
        break;

      case "path-change":
        const {localId, newPath} = data;
        handleFilePathChange(localId, newPath);
        bundleProject();
        break;

      default:
        console.error(`ProjectCell:handleFileBrowserEvent() event type '${type}' not supported`);
    }
  }

  // The code below has been kept for reference
  //
  const handleEditorWidthChange = (ew:number) => {
    // console.log(`ProjectCell: editor-width:${ew}  project-width:${width}`);

  }

  const handleEditorHeightChange = (eh:number) => {
    // console.log(`ProjectCell: editor-height:${eh} project-height:${height}`);
  }

  if (debugComponent) {
    console.log(`ProjectCell:render editedFile:`, editedFile);
  }

  const projectRef = useRef<HTMLDivElement|null>(null);
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);

  const windowSize = useWindowSize();

  // We calculate the ProjectCell size whenever window size changes
  useLayoutEffect(() => {
    if (projectRef.current) {
      setWidth(projectRef.current.offsetWidth);
      setHeight(projectRef.current.offsetHeight)
    }
  }, [windowSize]);


  // console.log(`ProjectCell: windowSize:${JSON.stringify(windowSize)}`);
  // We need to provide the editorSize from here as the height will be affected by the outer ResizableDiv
  const [editorSize, setEditorSize] = useState<ElementSize>({width: 400, height: 400});
  const handleEditorResize = (size:ElementSize) => {
    console.log(`handleEditorResize():`, size);
    setEditorSize(size);
  }

  if (!reduxProject) {
    return <h1>reduxProject is not defined</h1>
  }
  return (
    <div ref={projectRef} className="project-cell-wrapper">

      <ResizableDiv width="100%" height="100%" resizeHandles={['s']}>
      <div style={{ display: "flex", flexDirection: "row"}}>
        <div style={{flexGrow: 1, marginLeft: "10px", display: "flex", flexDirection: "column"}}>
          <FilesBrowser
              reduxProject={reduxProject}
              onSelect={handleFileBrowserOnSelect}
              onEvent={handleFileBrowserEvent}
          />

          {/* These  are here becaused they are project level operations */}
          <div className="project-control-panel" style={{display:"flex", flexDirection:"row", padding: "5px", justifyContent: "space-between"}}>
            <button className="button is-family-secondary is-small" onClick={handleProjectBundleClick}>
              Run
            </button>

            <div className="project-download-async-button-group" style={{width:"80px", display: "flex", flexDirection:"column", alignItems:"center"}}>
              <button className="button is-family-secondary is-small" onClick={handleProjectDownloadClick} disabled={reduxProject.downloadingZip}>
                Download
              </button>
              <progress style={{width: "90%", visibility: reduxProject.downloadingZip ? "visible" : "hidden"}}/>
            </div>
          </div>
        </div>
        {/* resizeHandles={['se', 'sw', 's', 'w']} */}
        <ResizableDiv width={editorSize.width} height={editorSize.height} onResize={handleEditorResize} resizeHandles={['sw', 'w', 's']}>
          <div style={{
              width:"calc(100% - 10px)", height:"calc(100% - 10px)", marginLeft:"10px", overflow:"hidden",
              display: "flex", flexDirection: "column", border: "3px solid lightblue"
            }}
          >
            <div className="file-cell-control-bar-wrapper">
              {editedFile && <FileCellControlBar reduxFile={editedFile}/>}
            </div>

            {(editedFile && editedFile.contentSynced) ?
                <CodeEditor
                    modelKey={editedFile?.localId}
                    value={editedFile?.content || ""}
                    language={editedFile?.language || CodeLanguage.UNKNOWN}
                    onChange={handleEditorChange}
                    disabled={!editedFile}
                />
                :
                <div style={{
                  height: "100%", width: "100%",
                  display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center",
                }}
                >
                  <h3>Select a File</h3>
                </div>
            }
          </div>
        </ResizableDiv>
      </div>
      </ResizableDiv>

      {(htmlContent && reduxProject.bundleLocalId && bundlesState[reduxProject.bundleLocalId]) &&
        <PreviewTabsPanel
            html={htmlContent}
            code={bundlesState[reduxProject.bundleLocalId]!.code}
            err={bundlesState[reduxProject.bundleLocalId]!.err}
        />
    }
    </div>
  );
}

export default ProjectCell;
