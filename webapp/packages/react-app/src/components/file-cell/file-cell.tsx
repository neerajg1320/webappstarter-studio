import './file-cell.css';
import React, {useEffect, useRef, useMemo, useState} from "react";
import CodeEditor from "./code-editor";
import Resizable from "./resizable";
import { useActions } from "../../hooks/use-actions";
import { useTypedSelector } from "../../hooks/use-typed-selector";
import Preview from "./preview";
import {autoBundling, debugRedux} from '../../config/global';
import {ReduxFile, ReduxFilePartial} from "../../state/file";
import FileControlBar from "./file-control-bar";

interface CodeCellProps {
  reduxFile: ReduxFile
}

const FileCell: React.FC<CodeCellProps> = ({reduxFile}) => {
  const autoBundle = useMemo(() => {
    return autoBundling;
  }, []);

  const {createCellBundle, updateFile} = useActions();

  // TBD: These local states can be done with and taken directly to redux
  const [fileSavePartial, setFileSavePartial] = useState<ReduxFilePartial>({} as ReduxFilePartial);

  // The bundle prop is being used in the Preview component below.
  const bundle = useTypedSelector((state) => state.bundles[reduxFile.localId]);

  if (debugRedux) {
    console.log(`FileCell:render reduxFile:${JSON.stringify(reduxFile, null, 2)}`);
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
  }, [reduxFile.content, autoBundle]);

  // handleEditorChange goes to another component hence cellState doesn't work properly in it.
  const handleEditorChange = (value:string) => {
    console.log(`[${reduxFile.localId}]handleEditorChange:${value}`);
    console.log(`reduxFile.content:${reduxFile.content}`);

    // TBD: To be taken into redux state
    setFileSavePartial((prev) => Object.assign(prev, {content: value}))

    updateFile({localId:reduxFile.localId, content:value})
  };


  return (
    <div>
      <Resizable direction="vertical">
        <div style={{height: 'calc(100% - 10px)', display: "flex", flexDirection: "row"}}>
          <Resizable direction="horizontal">
            <CodeEditor localId={reduxFile.localId}
                        initialValue={reduxFile.content || ''}
                        onChange={handleEditorChange}
            />
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
      <FileControlBar reduxFile={reduxFile} />

      <div style={{height: "100px"}}>
        <pre>{JSON.stringify(fileSavePartial, null, 2)}</pre>
      </div>
    </div>
  );
};

export default React.memo(FileCell);