import './preview-tabs-panel.css';
import TabsBulma from "../common/tabs-bulma";
import React, {useEffect, useMemo, useRef, useState} from "react";
import PreviewIframe from "./preview-iframe/preview-iframe";
import {debugComponent} from "../../config/global";
import PreviewConsole from "./preview-console";
import PreviewBundle from "./preview-bundle";
import PreviewBuild from "./preview-build";

interface PreviewTabsProps {
  html: string;
  code: string;
  err: string;
  // height: string;
}

// We have to pass the height here
const PreviewTabsPanel:React.FC<PreviewTabsProps> = ({html, code, err}) => {
  const [selectedTabIndex, setSelectedTabIndex] = useState<number>(1);
  const [count, setCount] = useState(0);
  const bundleSuccess = useMemo<boolean>(() => {
    return err === '';
  }, [err]);

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

  const handleConsoleTextChange = (value:string) => {
    if (debugComponent) {
      console.log(`PreviewTabs: console text changed`);
    }
  }

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

export default PreviewTabsPanel;