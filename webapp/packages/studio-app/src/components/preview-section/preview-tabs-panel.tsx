import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import './preview-tabs-panel.css';
import TabsBulma from "../common/tabs-bulma";
import PreviewIframe from "./preview-iframe/preview-iframe";
import {debugComponent} from "../../config/global";
import PreviewConsole from "./preview-console";
import PreviewBundle from "./preview-bundle";
import PreviewBuild from "./preview-build";
import {ElementLifeCycleInfo, getInitialLifecycleInfo, initialLifecycleInfo} from "../common/lifecycle/info";

interface PreviewTabsProps {
  title: string;
  html: string;
  code: string;
  err: string;
}

// We have to pass the height here
const PreviewTabsPanel:React.FC<PreviewTabsProps> = ({title, html, code, err}) => {
  const debugComponentLifecycle = true;
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
    console.log(`PreviewTabsPanel:render(${lifecyleInfo.current.count}) '${title} '[${html.length}, ${code.length}, ${err.length}]`);
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
    return ['Build', 'Preview', 'Console', 'Bundle'];
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

  return (
    <div className="preview-tabs-wrapper">
      <div className="preview-tabs-bar">
        <TabsBulma choices={previewChoices} value={selectedTabIndex} onChange={onTabChange} />
      </div>
      <div className="preview-tabs-panel" >
        <div className="preview-tab" style={{display: (bundleSuccess && previewChoices[selectedTabIndex] === 'Preview') ? "flex" : "none"}}>
          <PreviewIframe html={html} code={code} err={err} />
        </div>
        <div className="preview-tab" style={{display: (bundleSuccess && previewChoices[selectedTabIndex] === 'Console') ? "flex" : "none"}}>
          <PreviewConsole count={count} onChange={handleConsoleTextChange}/>
        </div>
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