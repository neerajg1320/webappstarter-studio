import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import './preview-tabs-panel.css';
import TabsBulma from "../common/tabs-bulma";
import PreviewIframe from "./preview-iframe/preview-iframe";
import {debugComponent, enableConsole} from "../../config/global";
import PreviewConsole from "./preview-console";
import PreviewBundle from "./preview-bundle";
import PreviewBuild from "./preview-build";
import {ElementLifeCycleInfo, getInitialLifecycleInfo} from "../common/lifecycle/info";
import {deleteScriptEntryPathFromHtml} from "../../utils/markup";
import {ReduxProject} from "../../state/project";
import {getProjectEntryPath} from "../../state/helpers/project-helpers";

interface PreviewTabsProps {
  id: string;
  iteration: number;
  title: string;
  html: string;
  code: string;
  err: string;
  reduxProject: ReduxProject
}

// We have to pass the height here
const PreviewTabsPanel:React.FC<PreviewTabsProps> = ({id, iteration, title, html, code, err, reduxProject}) => {
  const debugComponentLifecycle = false;
  const lifecyleInfo = useRef<ElementLifeCycleInfo>();
  const [selectedTabIndex, setSelectedTabIndex] = useState<number>(1);
  const [count, setCount] = useState(0);
  const bundleSuccess = useMemo<boolean>(() => {
    return err === '';
  }, [err]);

  useEffect(() => {
    if (debugComponentLifecycle) {
      console.log(`PreviewTabsPanel:useEffect[]  ${title.padEnd(20)}  created`);
    }
    return () => {
      if (debugComponentLifecycle) {
        console.log(`PreviewTabsPanel:useEffect[]  ${title.padEnd(20)}  destroyed `);
        lifecyleInfo.current = {count:0, timestamps:[]};
      }
    }
  }, []);

  if (debugComponent || true) {
    if (debugComponentLifecycle) {
      if (!lifecyleInfo.current) {
        lifecyleInfo.current = getInitialLifecycleInfo();
      }
      lifecyleInfo.current.count += 1;
      lifecyleInfo.current.timestamps.push(new Date());
    }
    // console.log(`PreviewTabsPanel:render(${lifecyleInfo.current.count}) '${title} '[${html.length}]`);
    // console.log(`PreviewTabsPanel:render(${lifecyleInfo.current.count}) '${title} '[${code.length}]`);
    // console.log(`PreviewTabsPanel:render(${lifecyleInfo.current.count}) '${title} '[${err.length}]`);
  }

  useEffect(() => {
    if (!bundleSuccess) {
      setSelectedTabIndex(0);
    }
  }, [bundleSuccess]);

  if (debugComponent) {
    console.log(`PreviewTabs:render selectedTab=${selectedTabIndex} err:'${err}' bundleSuccess:${bundleSuccess}`);
  }

  useEffect(() => {
    setCount((prev) => prev + 1);
  }, [code, err]);

  const previewChoices:string[] = useMemo(() => {
    const tabs = ['Build', 'Preview', 'Bundle']
    if (enableConsole) {
      tabs.push('Console');
    }
    return tabs;
  }, []);

  const onTabChange = ([value, index]:[string, number]) => {
    if (debugComponent) {
      console.log(`PreviewTabs: value=${value} index=${index}`);
    }
    if (bundleSuccess) {
      setSelectedTabIndex(index);
    }
  };

  const handleConsoleTextChange = useCallback((value:string) => {
    if (debugComponent) {
      console.log(`PreviewTabs: console text changed`);
    }
  }, []);

  const bundlerEntryFile = useMemo<string>(() => {
    // console.log(reduxProject.entry_path);
    return getProjectEntryPath(reduxProject);
  }, [reduxProject.entryFileLocalId]);

  const modifiedHtml = useMemo<string|null>(() => {
    if (html) {
      return deleteScriptEntryPathFromHtml(html, bundlerEntryFile, 'preview-tabs');
    }
    return null;
  }, [html, reduxProject]);

  return (
    <div className="preview-tabs-wrapper">
      <div className="preview-tabs-bar">
        <TabsBulma choices={previewChoices} value={selectedTabIndex} onChange={onTabChange} />
      </div>
      <div className="preview-tabs-panel" >
        <div className="preview-tab" style={{display: (bundleSuccess && previewChoices[selectedTabIndex] === 'Preview') ? "flex" : "none"}}>
          {modifiedHtml ? <PreviewIframe id={id} iteration={iteration} title={title} html={modifiedHtml} code={code} err={err} /> : <h2>html not populated</h2>}
        </div>
        {enableConsole &&
          <div className="preview-tab"
               style={{display: (bundleSuccess && previewChoices[selectedTabIndex] === 'Console') ? "flex" : "none"}}>
            <PreviewConsole count={count} onChange={handleConsoleTextChange}/>
          </div>
        }
        <div className="preview-tab" style={{display: (bundleSuccess && previewChoices[selectedTabIndex] === 'Bundle') ? "flex" : "none" }}>
          <PreviewBundle bundle={code}/>
        </div>
        <div className="preview-tab" style={{display: (!bundleSuccess || previewChoices[selectedTabIndex] === 'Build' ? "flex" : "none")}}>
          <PreviewBuild err={err}/>
        </div>
      </div>
    </div>
  );
}

export default React.memo(PreviewTabsPanel);