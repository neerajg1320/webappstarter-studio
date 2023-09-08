import './preview-tabs.css';
import TabsBulma from "../common/tabs-bulma";
import React, {useEffect, useMemo, useRef, useState} from "react";
import PreviewIframe from "./preview-iframe/preview-iframe";
import {debugComponent} from "../../config/global";
import PreviewConsole from "./preview-console";
import PreviewBundle from "./preview-bundle";

interface PreviewTabsProps {
  html: string;
  code: string;
  err: string;
  // height: string;
}

// We have to pass the height here
const PreviewTabs:React.FC<PreviewTabsProps> = ({html, code, err}) => {
  const [selectedTab, setSelectedTab] = useState<string>('Preview');
  const [count, setCount] = useState(0);

  if (debugComponent) {
    console.log(`PreviewTabs:render selectedTab=${selectedTab}`);
  }

  useEffect(() => {
    setCount((prev) => prev + 1);
  }, [code]);

  const previewChoices = useMemo(() => {
    return ['Preview', 'Console', 'Bundle'];
  }, []);

  const onTabChange = ([value, index]:[string, number]) => {
    if (debugComponent) {
      console.log(`PreviewTabs: value=${value} index=${index}`);
    }
    setSelectedTab(value);
  };

  const handleConsoleTextChange = (value:string) => {
    if (debugComponent) {
      console.log(`PreviewTabs: console text changed`);
    }
  }

  return (
    <div className="preview-tabs-wrapper">
      <div className="preview-tabs-bar">
        <TabsBulma choices={previewChoices} onChange={onTabChange} />
      </div>
      <div className="preview-tabs-panel" style={{height: "100%"}}>
        {/*{selectedTab === 'Preview' && <PreviewIframe code={code} err={err} />}*/}
        {/*{selectedTab === 'Console' && <PreviewConsole />}*/}
        <div style={{display: selectedTab === 'Preview' ? "flex" : "none", height: "100%"}}>
          <PreviewIframe html={html} code={code} err={err} />
        </div>
        <div style={{display: selectedTab === 'Console' ? "flex" : "none", height: "100%"}}>
          <PreviewConsole count={count} onChange={handleConsoleTextChange}/>
        </div>
        <div style={{display: selectedTab === 'Bundle' ? "flex" : "none", height: "100%"}}>
          <PreviewBundle bundle={code}/>
        </div>
      </div>
    </div>
  );
}

export default PreviewTabs;