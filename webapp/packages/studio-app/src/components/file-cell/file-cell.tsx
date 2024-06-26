import './file-cell.css';
import React, {useEffect, useMemo, useState, Suspense, lazy} from "react";
// import CodeEditor from "./code-editor";
import Resizable from "./resizable";
import { useActions } from "../../hooks/use-actions";
import { useTypedSelector } from "../../hooks/use-typed-selector";
import PreviewIframe from "../preview-section/preview-iframe/preview-iframe";
import {autoBundling, debugRedux} from '../../config/global';
import {ReduxFile, ReduxProject} from "../../state";
import FileCellControlBar, {FileCellEvent} from "./file-cell-control-bar";
import {BundleLanguage} from "../../state/bundle";
import {htmlNoScript} from "../preview-section/preview-iframe/markup";

const CodeEditor = lazy(() => import("../file-cell/code-editor"));

interface FileCellProps {
  reduxFile: ReduxFile;
  reduxProject?: ReduxProject;
}

const FileCell: React.FC<FileCellProps> = ({reduxFile, reduxProject=null}) => {
  const hotReload = useTypedSelector(state => state.application.hotReload);

  const {createCellBundle, updateFile} = useActions();

  // The bundle prop is being used in the PreviewIframe component below.
  const bundle = useTypedSelector((state) => state.bundles[reduxFile.localId]);

  if (debugRedux) {
    console.log(`FileCell:render reduxFile:${JSON.stringify(reduxFile, null, 2)}`);
  }

  useEffect(() => {
    // Keep this request out of autoBundling condition.
    // First time i.e. after reload, fresh load we do instant bundling
    if (!bundle) {
      createCellBundle(reduxFile.localId, reduxFile.content || '',   BundleLanguage.JAVASCRIPT);
      return;
    }

    if (hotReload) {
      // In subsequent attempts we wait for debounce time before bundling
      const timer = setTimeout(async () => {
        // console.log("Calling bundle");
        if (!reduxFile || !reduxFile.content) {
          console.log(`Error! no file content found`);
          return;
        }

        createCellBundle(reduxFile.localId, reduxFile.content, BundleLanguage.JAVASCRIPT);
      }, 1000)

      return() => {
        clearTimeout(timer);
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduxFile.content, hotReload]);

  // handleEditorChange goes to another component hence cellState doesn't work properly in it.
  const handleEditorChange = (value:string) => {
    console.log(`[${reduxFile.localId}]handleEditorChange:${value}`);
    console.log(`reduxFile.content:${reduxFile.content}`);

    // TBD: To be taken into redux state
    // setFileSavePartial((prev) => Object.assign(prev, {content: value}))

    updateFile({localId:reduxFile.localId, content:value})
  };

  return (
    <>
      <Resizable direction="vertical">
        <div style={{height: 'calc(100% - 10px)', display: "flex", flexDirection: "row"}}>
          <Resizable direction="horizontal">
            <Suspense fallback={<textarea value={reduxFile.content || ''} onChange={(e) => handleEditorChange(e.target.value)}  style={{height: "100%", fontSize: "1.2em", padding:"5px"}}/>}>
              <CodeEditor
                  modelKey={reduxFile.localId}
                  value={reduxFile.content || ''}
                  language={reduxFile.language}
                  onChange={handleEditorChange}
              />
            </Suspense>

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
              : <PreviewIframe id={reduxFile.localId} iteration={0} title={reduxFile.path} html={htmlNoScript} code={bundle.code} err={bundle.err}/>
            }
          </div>
        </div>
      </Resizable>

      {/* This portion has been added to support a file with cell. */}
      <FileCellControlBar reduxFile={reduxFile} />

      <div style={{height: "100px"}}>
        <h4>ModifiedKeys:</h4>
        <pre>{JSON.stringify(reduxFile.modifiedKeys, null, 2)}</pre>
      </div>
    </>
  );
};

export default React.memo(FileCell);