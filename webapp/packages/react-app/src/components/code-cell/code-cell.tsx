import './code-cell.css';
import React, {useEffect, useRef, useMemo} from "react";
import CodeEditor from "./code-editor";
import Resizable from "./resizable";
import { Cell } from "../../state";
import { useActions } from "../../hooks/use-actions";
import { useTypedSelector } from "../../hooks/use-typed-selector";
import Preview from "./preview";
import { useCumulativeCode } from '../../hooks/use-cumulative';
import {autoBundling, combineCellsCode} from '../../config/global';

interface CodeCellProps {
  cell: Cell
}

const CodeCell: React.FC<CodeCellProps> = ({ cell }) => {
  const autoBundle = useMemo(() => {
    return autoBundling;
  }, []);
  const {updateCell, createCellBundle} = useActions();
  // The bundle prop is being used in the Preview component below.
  const bundle = useTypedSelector((state) => state.bundles[cell.id]);
  const cellState = useTypedSelector((state) => state.cells.data[cell.id]);
  const cellCode = cellState.content;
  const cumulativeCode =  useCumulativeCode(cell.id);
  const inputCode = combineCellsCode ? cumulativeCode : cellCode;
  const filePathInputRef = useRef<HTMLInputElement | null>(null);
  const selectFileInputRef = useRef<HTMLInputElement | null>(null);
  
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
    updateCell(cell.id, value, filePathInputRef.current!.value);
  };

  const handleInputChange  = (value:string) => {
    updateCell(cell.id, cellState.content, value);
  }

  const handleBundleClick = () => {
    createCellBundle(cell.id, inputCode);
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) {
      console.log('No file selected');
      return;
    }

    console.log(e.target.files[0]);
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
      <div style={{display: "flex", justifyContent: "center", gap: "60px", alignItems: "center"}}>
        <div style={{display:"flex", flexDirection:"row", gap:"20px"}}>
          <button
              className="button is-family-primary is-small"
              onClick={() => {selectFileInputRef.current!.click()}}
          >
            Select File
          </button>
          <input ref={selectFileInputRef} type="file" style={{display: "none"}} onChange={handleFileChange}/>
          <div>
            <label>File Path:</label>
            <input ref={filePathInputRef} type="text" onChange={(e) => handleInputChange(e.target.value)}/>
          </div>
        </div>

        <div style={{display:"flex", flexDirection:"row", gap:"20px"}}>
          <button className="button is-primary is-small" onClick={() => handleBundleClick()}>
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