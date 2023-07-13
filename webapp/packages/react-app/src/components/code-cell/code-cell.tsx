import './code-cell.css';
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


interface CodeCellProps {
  cell: Cell
}

const CodeCell: React.FC<CodeCellProps> = ({ cell }) => {
  const autoBundle = useMemo(() => {
    return autoBundling;
  }, []);
  const {updateCell, createCellBundle, createFile} = useActions();
  // The bundle prop is being used in the Preview component below.
  const bundle = useTypedSelector((state) => state.bundles[cell.id]);
  const cellState = useTypedSelector((state) => state.cells.data[cell.id]);
  const cellCode = cellState.content;
  const cumulativeCode =  useCumulativeCode(cell.id);
  const inputCode = combineCellsCode ? cumulativeCode : cellCode;
  const selectFileInputRef = useRef<HTMLInputElement | null>(null);
  const currentProjectId = useTypedSelector((state) => state.projects.currentProjectId);
  const [filePath, setFilePath] = useState<string>('src/index.js');

  // console.log(`CodeCell:render currentProjectId:${JSON.stringify(currentProjectId, null, 2)}`);
  
  useEffect(() => {
    // Keep this request out of autoBundling condition.
    // First time i.e. after reload, fresh load we do instant bundling
    if (!bundle) {
      createCellBundle(cell.id, inputCode);
      return;
    }

    if (autoBundle) {
      // In subsequent attempts we wait for debounce time before bundling
      const timer = setTimeout(async () => {
        // console.log("Calling bundle");
        createCellBundle(cell.id, inputCode);
      }, 1000)

      return() => {
        clearTimeout(timer);
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputCode, cell.id, createCellBundle, autoBundle]);

  // onEditorChange goes to another component hence cellState doesn't work properly in it.
  const onEditorChange = (value:string) => {
    // Don't use cellState for filePath
    updateCell(cell.id, value, filePath);
  };

  const handleBundleClick = () => {
    createCellBundle(cell.id, inputCode);
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

    updateCell(cell.id, fileContent, filePath);
  }

  const handleSaveClick = () => {
    if (!currentProjectId) {
      console.error(`We need to set a project`);
      return;
    }

    if (!cellCode) {
      console.error(`We need to add code`);
      return;
    }

    const fileName = getFileNameFromPath(filePath);
    const file = createFileFromString(cellCode, fileName);

    const _localId = randomIdGenerator();
    createFile(_localId, filePath, file, 'javascript', currentProjectId);
  }

  return (
    <div>
      <Resizable direction="vertical">
        <div style={{height: 'calc(100% - 10px)', display: "flex", flexDirection: "row"}}>
          <Resizable direction="horizontal">
            <CodeEditor initialValue={cell.content} onChange={onEditorChange} />
          </Resizable>
          {/* <pre>{code}</pre> */}
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
      <div style={{
          display: "flex", justifyContent: "center", gap: "60px", alignItems: "center",
          marginTop: "5px"
        }}
      >
        <div style={{display:"flex", flexDirection:"row", gap:"20px", alignItems:"center"}}>
          <div style={{display:"flex", flexDirection:"column", gap:"5px", alignItems: "center"}}>
            <button
                className="button is-family-primary is-small"
                onClick={() => {selectFileInputRef.current!.click()}}
            >
              Select File
            </button>
            <input ref={selectFileInputRef} type="file" style={{display: "none"}} onChange={handleFileChange}/>
          </div>
          <div>
            <label>File Path:</label>
            <input type="text" value={filePath} onChange={(e) => setFilePath(e.target.value)} />
          </div>
        </div>

        <div style={{display:"flex", flexDirection:"row", gap:"20px", alignItems:"center"}}>
          <button
              className="button is-primary is-small"
              onClick={() => handleSaveClick()}
              disabled={!(cellCode && filePath)}
          >
            Save
          </button>
          <button
              className="button is-family-secondary is-small"
              onClick={() => handleBundleClick()}
              disabled={!(cellCode && cellCode.length > 0)}
          >
            Bundle
          </button>
        </div>
      </div>
    </div>
  );
};

export default CodeCell;