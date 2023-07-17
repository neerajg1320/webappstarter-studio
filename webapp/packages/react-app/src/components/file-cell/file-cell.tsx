import './file-cell.css';
import React, {useEffect, useRef, useMemo, useState} from "react";
import CodeEditor from "./code-editor";
import Resizable from "./resizable";
import { Cell } from "../../state";
import { useActions } from "../../hooks/use-actions";
import { useTypedSelector } from "../../hooks/use-typed-selector";
import Preview from "./preview";
import { useCumulativeCode } from '../../hooks/use-cumulative';
import {autoBundling, combineCellsCode} from '../../config/global';
import {randomIdGenerator} from "../../state/id";
import {getFileNameFromPath, replaceFilePart} from "../../utils/path";
import {createFileFromString, readFileContent} from "../../utils/file";
import {ReduxFile} from "../../state/file";
import {file} from "jscodeshift";


interface CodeCellProps {
  // cell: Cell
}

const FileCell: React.FC<CodeCellProps> = () => {
  const autoBundle = useMemo(() => {
    return autoBundling;
  }, []);
  const {updateCell, createCellBundle, createFile, updateFile, deleteFile} = useActions();

  // const cellState = useTypedSelector((state) => state.cells.data[cell.id]);
  // const cellContents = cellState.content;
  // const cumulativeCode =  useCumulativeCode(cell.id);
  // const inputCode = combineCellsCode ? cumulativeCode : cellContents;
  const selectFileInputRef = useRef<HTMLInputElement | null>(null);
  const currentProjectId = useTypedSelector((state) => state.projects.currentProjectId);

  // TBD: These local states can be done with and taken directly to redux
  const [filePath, setFilePath] = useState<string>('src/index.js');
  const [entryPoint, setEntryPoint] = useState<boolean>(false);
  const [fileUpdatePartial, setFileUpdateParital] = useState({});

  const fileLocalId = useMemo<string>(() => {
    return randomIdGenerator();
  }, []);

  const filesListState = useTypedSelector((state) => state.files);
  const fileState = useMemo<ReduxFile|null>(() => {
    // console.log(`We should update fileState`);
    if (fileLocalId) {
      return filesListState.data[fileLocalId];
    }
    return null;
  }, [filesListState, fileLocalId]);

  // The bundle prop is being used in the Preview component below.
  const bundle = useTypedSelector((state) => state.bundles[fileLocalId]);


  console.log(`FileCell:render fileState:${JSON.stringify(fileState, null, 2)}`);
  useEffect(() => {
    createFile(fileLocalId, filePath, createFileFromString('', ''), 'javascript');
  }, [])

  useEffect(() => {
    // if (!fileState || !fileState.content) {
    //   console.log(`Error! no file content found`);
    //   return;
    // }

    // Keep this request out of autoBundling condition.
    // First time i.e. after reload, fresh load we do instant bundling
    if (!bundle) {
      createCellBundle(fileLocalId, fileState?.content || '');
      return;
    }

    if (autoBundle) {
      // In subsequent attempts we wait for debounce time before bundling
      const timer = setTimeout(async () => {
        // console.log("Calling bundle");
        if (!fileState || !fileState.content) {
          console.log(`Error! no file content found`);
          return;
        }

        createCellBundle(fileLocalId, fileState.content);
      }, 1000)

      return() => {
        clearTimeout(timer);
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fileState?.content, fileLocalId, createCellBundle, autoBundle]);

  // onEditorChange goes to another component hence cellState doesn't work properly in it.
  const onEditorChange = (value:string) => {
    console.log(`onEditorChange:${value}`);

    // Don't use cellState for filePath
    // updateCell(cell.id, value, filePath);
    setFileUpdateParital((prev) => Object.assign(prev, {content: value}))
    updateFile({localId:fileLocalId, content:value})
  };

  const handleBundleClick = () => {
    if (!fileState || !fileState.content) {
      console.log(`Error! no file contents found`)
      return;
    }
    createCellBundle(fileLocalId, fileState.content);
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) {
      console.log('No file selected');
      return;
    }

    const file = e.target.files[0];

    // here we should keep modify the fileInputPath where we replace fileName part
    setFilePath(replaceFilePart(filePath, file.name))

    const fileContent = await readFileContent(file);
    console.log(`fileContent: ${fileContent}`);

    // updateCell(cell.id, fileContent, filePath);
    setFileUpdateParital((prev) => Object.assign(prev, {content: fileContent}))
  }

  const handleEntryPointChange = (checked: boolean) => {
    setEntryPoint(checked);
    // console.log(`fileState: ${JSON.stringify(fileState)}`);
    // updateProject({localId: currentProjectId, entry_file:filePkid, entry_path:filePath})
    setFileUpdateParital((prev) => Object.assign(prev, {isEntryPoint: checked}));
    updateFile({localId: fileLocalId, isEntryPoint: checked})
  }

  const handleFilePathChange = (filePath:string) => {
    setFilePath(filePath);
    setFileUpdateParital((prev) => Object.assign(prev, {path: filePath}))
    updateFile({localId: fileLocalId, path: filePath})
  }

  const handleSaveClick = () => {
    if (!currentProjectId) {
      console.error(`We need to set a project`);
      return;
    }

    if (!fileState?.content) {
      console.error(`We need to add code`);
      return;
    }

    const fileName = getFileNameFromPath(filePath);
    const file = createFileFromString(fileState.content, fileName);

    if (fileState?.pkid && fileState?.pkid > 0) {
      if (fileUpdatePartial) {
        console.log(`fileUpdatePartial:`, fileUpdatePartial);
        updateFile(Object.assign({localId: fileLocalId, localFile:file}, fileUpdatePartial));
      }
    } else {
      // This has to change as this is causing screwup :). This has to be done at the beginning
      // This has to happen either in useEffect(, []) or has to happen before component is created.
      // createFile(fileLocalId, filePath, file, 'javascript', currentProjectId, entryPoint);
    }

    setFileUpdateParital({});
  }

  return (
    <div>
      <Resizable direction="vertical">
        <div style={{height: 'calc(100% - 10px)', display: "flex", flexDirection: "row"}}>
          <Resizable direction="horizontal">
            <CodeEditor initialValue={fileState?.content || ''} onChange={onEditorChange} />
          </Resizable>
          <div className="progress-wrapper">
            {
              !bundle || bundle.loading 
              ? 
                <div className="progress-cover">
                  <progress className="progress is-small is-primary" max="100">
                    Loading
                  </progress>
                </div>
              : <Preview code={bundle.code} err={bundle.err}/>
            }
          </div>
        </div>
      </Resizable>

      <pre>{JSON.stringify(fileUpdatePartial, null, 2)}</pre>

      {/* This portion has been added to support a file with cell. */}
      <div style={{
          display: "flex", justifyContent: "center", gap: "60px", alignItems: "center",
          marginTop: "5px"
        }}
      >
        <div style={{display:"flex", flexDirection:"row", gap:"20px", alignItems:"center"}}>
          <span>localId: {fileLocalId}</span>
          <span>Pkid: {fileState?.pkid}</span>
        </div>

        <div style={{display:"flex", flexDirection:"column", gap:"5px", alignItems: "center"}}>
          <button
              className="button is-family-primary is-small"
              onClick={() => {selectFileInputRef.current!.click()}}
          >
            Select File
          </button>
          <input ref={selectFileInputRef} type="file" style={{display: "none"}} onChange={handleFileChange}/>
        </div>

        <div style={{display:"flex", flexDirection:"row", gap:"20px", alignItems:"center"}}>
          <div style={{display:"flex", flexDirection:"row", gap:"5px", alignItems:"center"}}>
            <label>EntryPoint</label>
            <input
                type="checkbox"
                checked={fileState && fileState.isEntryPoint || false}
                onChange={(e) => handleEntryPointChange(e.target.checked)}
            />
          </div>
          <div>
            <label>File Path:</label>
            <input type="text" value={filePath} onChange={(e) => handleFilePathChange(e.target.value)} />
          </div>
        </div>

        <div style={{display:"flex", flexDirection:"row", gap:"20px", alignItems:"center"}}>
          <button
              className="button is-primary is-small"
              onClick={() => handleSaveClick()}
              disabled={!(fileState?.content && filePath)}
          >
            Save
          </button>
          <button
              className="button is-family-secondary is-small"
              onClick={() => handleBundleClick()}
              disabled={!(fileState?.content && fileState?.content.length > 0)}
          >
            Bundle
          </button>
        </div>
      </div>
    </div>
  );
};

export default FileCell;