import "./project-cell.css";
import React, {
  ReactNode,
  SyntheticEvent,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  Suspense,
  lazy
} from 'react';
import {useActions} from "../../hooks/use-actions";
import {useTypedSelector} from "../../hooks/use-typed-selector";

// import CodeEditor from "../file-cell/code-editor";
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
import {ResizeCallbackData} from 'react-resizable';

interface ProjectCellProps {
  // reduxProject: ReduxProject;
  // projectLocalId: string;
}
const CodeEditor = lazy(() => import("../file-cell/code-editor"));

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



  const { bundleProject, updateProject, downloadProjectZip, saveFile, updateFile, fetchFileContents, makeProjectIdeReady } = useActions();

  const projectsState = useTypedSelector((state) => state.projects);
  const filesState = useTypedSelector((state) => state.files);
  const bundlesState =  useTypedSelector((state) => state.bundles);
  const currentUser =  useTypedSelector((state) => state.auth.currentUser);
  const bundlerReady = useTypedSelector(state => state.application.bundlerReady);

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
          bundleMarkDirtyDebounced(null);
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

  const markProjectBundleDirty = () => {
    updateProject({localId: reduxProject.localId, bundleDirty: true});
  }

  useEffect(() => {
    if (debugComponent || true) {
      console.log(`ProjectCell:useEffect[...]  filesSynced:${reduxProject.filesSynced} bundlerReady:${bundlerReady}  ideReady:${reduxProject.ideReady}  bundleDirty:${reduxProject.bundleDirty}`);
    }

    if (!reduxProject.filesSynced) {
      return;
    } else {
      if (!reduxProject.selectedFileLocalId) {
        // updateProject({localId: reduxProject.localId, selectedFileLocalId: reduxProject.entryFileLocalId});
        setProjectSelectedFile(reduxProject.entryFileLocalId);
        setEditedFileLocalId(reduxProject.entryFileLocalId);
      }
    }

    if (!reduxProject.ideReady) {
      makeProjectIdeReady(reduxProject.localId);
      return;
    }

    if (!bundlerReady) {
      return;
    }

    if (reduxProject.bundleDirty) {
      bundleProject(reduxProject.localId);
    }
  }, [reduxProject.filesSynced, reduxProject.ideReady, bundlerReady, reduxProject.bundleDirty]);

  useEffect(() => {
    if (debugComponent) {
      console.log(`ProjectCell: useEffect([reduxProject])`)
    }

    setProjectSelectedFile(reduxProject.selectedFileLocalId);
  }, [reduxProject.localId]);

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


  const bundleMarkDirtyDebounced = useDebouncedCallback(() => markProjectBundleDirty(),
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

    markProjectBundleDirty();
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
      // TBD: We need to check if the file is deleted then only do this.
      // This logic in any case we have to clean up.
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

        // TBD: We have to do the same in case of file delete.
        markProjectBundleDirty();
        break;

      default:
        console.error(`ProjectCell:handleFileBrowserEvent() event type '${type}' not supported`);
    }
  }


  if (debugComponent) {
    console.log(`ProjectCell:render editedFile:`, editedFile);
  }

  // Resizing Logic:
  // When the windowSize changes the ProjectCell size changes
  // When ProjectCell size changes the useLayoutEffect
  // When ProjectCell size changes the useLayoutEffect[windowSize] will cause the FileSectionHeight to change
  // When the FileSectionHeight changes due to windowsSize or Resize handle then this will cause the height
  // of the Editor to change as well.
  // Also, we should be storing the ratios  along with the ElementSize for FilesSection and Editor.
  // The ratio shall be used in case we change the windowSize. The new sizes should be aligning to the
  // existing ratios.
  // Browser window size change:
  // The window size change logic is working. Currently when we change window size, the height of the preview
  // window changes to height defined by default ratio. The height of editor adjusts accordingly.
  // We are currently resizing the windows to starting ratio when we resize the browser window.
  // TBD: 1. Next we have to store ratio on each resize and then conserver the ratio on window resize
  // TBD: 2. After that we shall deal with constraints

  type Proportion = {
    min:number, current:number, max:number
  }

  type ElementProportions = {
    width?: Proportion,
    height?: Proportion
  }

  const defaultEditorProportions:ElementProportions = {
    width: {min:0.3, current:0.8, max:0.9}
  }
  const defaultFileSectionProportions:ElementProportions = {
    height: {min:0.1, current:0.6, max:0.9}
  }

  const [editorProportions, setEditorProportions] = useState<ElementProportions>(defaultEditorProportions);
  const [fileSectionProportions, setFileSectionProportions] = useState<ElementProportions>(defaultFileSectionProportions);

  const projectRef = useRef<HTMLDivElement|null>(null);

  const windowSize = useWindowSize();

  // We calculate the ProjectCell size whenever window size changes
  useLayoutEffect(() => {
    if (projectRef.current) {
      if (debugComponent) {
        console.log(`ProjectCell:useLayoutEffect[windowSize] width:${projectRef.current.offsetWidth} height:${projectRef.current.offsetHeight}`)
      }

      if (filesSectionSize) {
        if (projectRef.current.offsetWidth !== filesSectionSize.width) {
          setFilesSectionSize((prevSize) => {
            // console.log(`Previous Size:`, prevSize);
            const _newSize = {
              height: projectRef.current.offsetHeight * fileSectionProportions.height.current,
              // 10 for handle, 10 for padding, 2 for border
              width: projectRef.current.offsetWidth - 22
            }
            // console.log(`Setting the FilesSectionSize:`, _newSize);
            return _newSize;
          });

          setEditorSize((preSize) => {
            return {
              ...preSize,
              width: projectRef.current.offsetWidth * editorProportions.width.current
            }
          });
        }
      } else {
        setFilesSectionSize({
          height: projectRef.current.offsetHeight * fileSectionProportions.height.current,
          // 10 for handle, 10 for padding, 2 for border
          width: projectRef.current.offsetWidth - 22
        })
      }
    }
  }, [windowSize]);



  // console.log(`ProjectCell: windowSize:${JSON.stringify(windowSize)}`);
  // We need to provide the editorSize from here as the height will be affected by the outer ResizableDiv
  const [editorSize, setEditorSize] = useState<ElementSize|undefined>();
  const handleEditorResize:(e: SyntheticEvent, data: ResizeCallbackData) => void = (event, {node, size, handle}) => {
    if (debugComponent) {
      console.log(`handleEditorResize():`, size, handle);
    }

    if (handle === 'sw') {
      const editorHeightDelta = size.height - editorSize.height;

      // We just update the fileSectionHeight which automatically adjusts the editor height as well.
      // Our logic stays consistent with this. Editor height changes only when fileSection height changes.
      updateFileSectionHeight(filesSectionSize.height + editorHeightDelta)
    }

    updateEditorWidth(size.width);
  }

  
  const updateEditorWidth = useCallback((width:number) => {
    const newWidthProportion = width / projectRef.current.offsetWidth;

    // If newWidthProportion is within constraints then update the size and current proportion
    if ((editorProportions.width.min < newWidthProportion) &&
        (newWidthProportion < editorProportions.width.max)) {
      setEditorSize((prev) => {
        return {...prev, width};
      });
      setEditorProportions((prev) => {
        return {...prev, width: {...prev.width, current: newWidthProportion}};
      });
    }
  }, [editorProportions]);

  

  const [filesSectionSize, setFilesSectionSize] = useState<ElementSize|undefined>();
  const handleFilesSectionResize:(e: SyntheticEvent, data: ResizeCallbackData) => void = (event, {node, size, handle}) => {
    if (debugComponent) {
      console.log(`handleFilesSectionResize():`, size);
    }

    updateFileSectionHeight(size.height);
  }

  const updateFileSectionHeight = useCallback((height:number) => {
    const newHeightProportion = height / projectRef.current.offsetHeight;
    if ((fileSectionProportions.height.min < newHeightProportion) &&
        (newHeightProportion < fileSectionProportions.height.max)) {
      setFilesSectionSize((prev) => {
        return {...prev, height};
      });
      setFileSectionProportions((prev) => {
        return {...prev, height: {...prev.height, current: newHeightProportion}}
      });
    }
  }, [fileSectionProportions]);

  useEffect(() => {
    // Change the editor height if the height of the fileSectionSize changes
    if (filesSectionSize) {
      if (editorSize) {
        if (filesSectionSize.height !== editorSize.height) {
          setEditorSize((prev) => {
            return {...prev, height: filesSectionSize.height};
          });
        }
      } else {
        setEditorSize((prev) => {
          return {
            width: projectRef.current.offsetWidth * editorProportions.width.current,
            height: filesSectionSize.height
          };
        });
      }
    }
  }, [filesSectionSize]);

  if (!reduxProject) {
    return <h1>reduxProject is not defined</h1>
  }
  return (
    <div ref={projectRef} className="project-cell-wrapper">

      {(filesSectionSize && editorSize) &&
      <ResizableDiv width={filesSectionSize.width} height={filesSectionSize.height}
                    onResize={handleFilesSectionResize} resizeHandles={['s']}>
        {/* The maxHeight property is very important in the following divs. */}
        {/* This ensures FileBrowser section will stay contained. */}
        <div style={{display: "flex", flexDirection: "row", maxHeight:"100%"}}>

          <div style={{flexGrow: 1, marginLeft: "10px", display: "flex", flexDirection: "column", maxHeight:"100%"}}>
            <FilesBrowser
                reduxProject={reduxProject}
                onSelect={handleFileBrowserOnSelect}
                onEvent={handleFileBrowserEvent}
            />

            {/* These  are here becaused they are project level operations */}
            <div className="project-control-panel"
                 style={{display: "flex", flexDirection: "row", padding: "5px", justifyContent: "space-between"}}>
              <button className="button is-family-secondary is-small" onClick={handleProjectBundleClick}>
                Run
              </button>

              <div className="project-download-async-button-group"
                   style={{width: "80px", display: "flex", flexDirection: "column", alignItems: "center"}}>
                <button className="button is-family-secondary is-small" onClick={handleProjectDownloadClick}
                        disabled={reduxProject.downloadingZip}>
                  Download
                </button>
                <progress style={{width: "90%", visibility: reduxProject.downloadingZip ? "visible" : "hidden"}}/>
              </div>
            </div>
          </div>

          {/* enabling sw will require some changes */}
          <ResizableDiv width={editorSize.width} height={editorSize.height} onResize={handleEditorResize}
                        resizeHandles={['sw', 'w']}>
            <div style={{
              width: "calc(100% - 10px)", height: "calc(100% - 10px)", marginLeft: "10px", overflow: "hidden",
              display: "flex", flexDirection: "column", border: "3px solid lightblue"
            }}
            >
              <div className="file-cell-control-bar-wrapper">
                {editedFile && <FileCellControlBar reduxFile={editedFile}/>}
              </div>

              {(editedFile && editedFile.contentSynced) ?
                  <Suspense fallback={<textarea value={editedFile?.content || ''} onChange={(e) => handleEditorChange(e.target.value)} style={{height: "100%", fontSize: "1.2em", padding:"5px"}}/>}>
                    <CodeEditor
                        modelKey={editedFile?.localId}
                        value={editedFile?.content || ""}
                        language={editedFile?.language || CodeLanguage.UNKNOWN}
                        onChange={handleEditorChange}
                        disabled={!editedFile}
                    />
                  </Suspense>

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
      }

      {/*<pre style={{textAlign: "left"}}>{JSON.stringify(reduxProject, null, 2)}</pre>*/}
      {(reduxProject.htmlContent && reduxProject.bundleLocalId && bundlesState[reduxProject.bundleLocalId]) &&
          <PreviewTabsPanel
              title={reduxProject.title}
              html={reduxProject.htmlContent}
              code={bundlesState[reduxProject.bundleLocalId]!.code}
              err={bundlesState[reduxProject.bundleLocalId]!.err}
          />
      }
    </div>
  );
}

export default ProjectCell;
