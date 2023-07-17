import './file-cell.css';
import React, {useEffect, useRef, useMemo, useState} from "react";
import CodeEditor from "./code-editor";
import Resizable from "./resizable";
import { useActions } from "../../hooks/use-actions";
import { useTypedSelector } from "../../hooks/use-typed-selector";
import Preview from "./preview";
import {autoBundling, debugRedux} from '../../config/global';
import {getFileNameFromPath, replaceFilePart} from "../../utils/path";
import {createFileFromString, readFileContent} from "../../utils/file";
import {ReduxFile, ReduxFilePartial} from "../../state/file";

interface CodeCellProps {
  reduxFile: ReduxFile
}

const FileCell: React.FC<CodeCellProps> = ({reduxFile}) => {
  const autoBundle = useMemo(() => {
    return autoBundling;
  }, []);

  const {createCellBundle, updateFile, saveFile} = useActions();

  const selectFileInputRef = useRef<HTMLInputElement | null>(null);
  // const currentProjectId = useTypedSelector((state) => state.projects.currentProjectId);

  // TBD: These local states can be done with and taken directly to redux
  const [fileUpdatePartial, setFileUpdateParital] = useState<ReduxFilePartial>({} as ReduxFilePartial);

  // The bundle prop is being used in the Preview component below.
  const bundle = useTypedSelector((state) => state.bundles[reduxFile.localId]);

  if (debugRedux) {
    console.log(`FileCell:render fileState:${JSON.stringify(reduxFile, null, 2)}`);
  }


  useEffect(() => {
    // Keep this request out of autoBundling condition.
    // First time i.e. after reload, fresh load we do instant bundling
    if (!bundle) {
      createCellBundle(reduxFile.localId, reduxFile.content || '');
      return;
    }

    if (autoBundle) {
      // In subsequent attempts we wait for debounce time before bundling
      const timer = setTimeout(async () => {
        // console.log("Calling bundle");
        if (!reduxFile || !reduxFile.content) {
          console.log(`Error! no file content found`);
          return;
        }

        createCellBundle(reduxFile.localId, reduxFile.content);
      }, 1000)

      return() => {
        clearTimeout(timer);
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduxFile.content, reduxFile.localId, createCellBundle, autoBundle]);

  // onEditorChange goes to another component hence cellState doesn't work properly in it.
  const onEditorChange = (value:string) => {
    // console.log(`onEditorChange:${value}`);

    // Don't use cellState for filePath
    // updateCell(cell.id, value, filePath);
    setFileUpdateParital((prev) => Object.assign(prev, {content: value}))
    updateFile({localId:reduxFile.localId, content:value})
  };

  const handleBundleClick = () => {
    if (!reduxFile || !reduxFile.content) {
      console.log(`Error! no file contents found`)
      return;
    }
    createCellBundle(reduxFile.localId, reduxFile.content);
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) {
      console.log('No file selected');
      return;
    }

    const file = e.target.files[0];

    // here we should keep modify the fileInputPath where we replace fileName part

    const filePath = replaceFilePart(reduxFile.path, file.name);
    updateFile({localId:reduxFile.localId, path:filePath});

    const fileContent = await readFileContent(file);
    console.log(`fileContent: ${fileContent}`);

    // updateCell(cell.id, fileContent, filePath);
    setFileUpdateParital((prev) => Object.assign(prev, {content: fileContent}))
  }

  const handleEntryPointChange = (checked: boolean) => {
    // console.log(`fileState: ${JSON.stringify(fileState)}`);
    // updateProject({localId: currentProjectId, entry_file:filePkid, entry_path:filePath})
    setFileUpdateParital((prev) => Object.assign(prev, {isEntryPoint: checked}));
    updateFile({localId: reduxFile.localId, isEntryPoint: checked})
  }

  const handleFilePathChange = (filePath:string) => {
    // setFilePath(filePath);
    setFileUpdateParital((prev) => Object.assign(prev, {path: filePath}))
    updateFile({localId: reduxFile.localId, path: filePath})
  }

  const handleSaveClick = () => {

    if (!reduxFile.content) {
      console.error(`We need to add code`);
      return;
    }

    const fileName = getFileNameFromPath(reduxFile.path);
    const file = createFileFromString(reduxFile.content, fileName);

    if (reduxFile.pkid && reduxFile.pkid > 0) {
      if (Object.keys(fileUpdatePartial).length > 0) {
        console.log(`fileUpdatePartial:`, fileUpdatePartial);
        fileUpdatePartial['localFile'] = file;
        saveFile(Object.assign({localId: reduxFile.localId, pkid: reduxFile.pkid}, fileUpdatePartial))
        // updateFile(Object.assign({localId: reduxFile.localId, localFile:file}, fileUpdatePartial));
      }
    } else {
      // This has to change as this is causing screwup :). This has to be done at the beginning
      // This has to happen either in useEffect(, []) or has to happen before component is created.
      // createFile(fileState.localId, filePath, file, 'javascript', currentProjectId, entryPoint);

      // We got error with this
      //reduxFile['localFile'] = file;


      const createFilePartial = {...reduxFile, ...fileUpdatePartial, localFile: file};

      saveFile(createFilePartial);
    }

    setFileUpdateParital({} as ReduxFilePartial);
  }

  return (
    <div>
      <Resizable direction="vertical">
        <div style={{height: 'calc(100% - 10px)', display: "flex", flexDirection: "row"}}>
          <Resizable direction="horizontal">
            <CodeEditor initialValue={reduxFile.content || ''} onChange={onEditorChange} />
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

      {/* This portion has been added to support a file with cell. */}
      <div style={{
          display: "flex", justifyContent: "center", gap: "60px", alignItems: "center",
          marginTop: "5px"
        }}
      >
        <div style={{display:"flex", flexDirection:"row", gap:"20px", alignItems:"center"}}>
          <span>localId: {reduxFile.localId}</span>
          <span>Pkid: {reduxFile.pkid}</span>
          <span>Project: {reduxFile.projectLocalId}</span>
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
                checked={(reduxFile && reduxFile.isEntryPoint) || false}
                onChange={(e) => handleEntryPointChange(e.target.checked)}
            />
          </div>
          <div>
            <label>File Path:</label>
            <input type="text" value={reduxFile.path || ''} onChange={(e) => handleFilePathChange(e.target.value)} />
          </div>
        </div>

        <div style={{display:"flex", flexDirection:"row", gap:"20px", alignItems:"center"}}>
          <button
              className="button is-primary is-small"
              onClick={() => handleSaveClick()}
              disabled={!(Object.keys(fileUpdatePartial).length > 0)}
          >
            Save
          </button>
          <button
              className="button is-family-secondary is-small"
              onClick={() => handleBundleClick()}
              disabled={!(reduxFile.content && reduxFile.content.length > 0)}
          >
            Bundle
          </button>
        </div>
      </div>

      <div style={{height: "100px"}}>
        <pre>{JSON.stringify(fileUpdatePartial, null, 2)}</pre>
      </div>
    </div>
  );
};

export default FileCell;