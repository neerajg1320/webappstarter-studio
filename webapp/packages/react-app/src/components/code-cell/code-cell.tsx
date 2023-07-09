import './code-cell.css';
import React, {useEffect, useState} from "react";
import CodeEditor from "./code-editor";
import Resizable from "./resizable";
import { Cell } from "../../state";
import { useActions } from "../../hooks/use-actions";
import { useTypedSelector } from "../../hooks/use-typed-selector";
import Preview from "./preview";
import { useCumulativeCode } from '../../hooks/use-cumulative';
import { autoBundling } from '../../config/global';

interface CodeCellProps {
  cell: Cell
}

const CodeCell: React.FC<CodeCellProps> = ({ cell }) => {
  const [autoBundle, setAutoBundle] = useState(autoBundling);
  const {updateCell, createBundle} = useActions();
  const bundle = useTypedSelector((state) => state.bundles[cell.id]);
  const cumulativeCode = useCumulativeCode(cell.id);

  // console.log(cumulativeCode);
  
  useEffect(() => {
    // Keep this request out of autoBundling condition.
    // First time i.e. after reload, fresh load we do instant bundling
    if (!bundle) {
      createBundle(cell.id, cumulativeCode);
      return;
    }

    if (autoBundle) {
      // In subsequent attempts we wait for debounce time before bundling
      const timer = setTimeout(async () => {
        // console.log("Calling bundle");
        createBundle(cell.id, cumulativeCode);
      }, 1000)

      return() => {
        clearTimeout(timer);
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cumulativeCode, cell.id, createBundle, autoBundle]);

  const onEditorChange = (value:string) => {
    // setInput(value);
    updateCell(cell.id, value);
  };

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
      <div style={{display: "flex", justifyContent: "center", gap: "20px", alignItems: "center"}}>
        <div>
        <label>File Path:</label>
        <input type="text" />
        </div>
        <button className="button is-primary is-small">
          Bundle
        </button>
      </div>
    </div>
  );
};

export default CodeCell;