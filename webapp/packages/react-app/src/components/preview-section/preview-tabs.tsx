import './preview-tabs.css';
import TabsBulma from "../common/tabs-bulma";
import React, {useEffect, useMemo, useRef, useState} from "react";
import PreviewIframe from "./preview-iframe";
import {debugComponent} from "../../config/global";
import PreviewConsole from "./preview-console";

interface PreviewTabsProps {
  code: string;
  err: string
}

const PreviewTabs:React.FC<PreviewTabsProps> = ({code, err}) => {
  const [selectedTab, setSelectedTab] = useState<string>('Console');
  const previewPanelRef = useRef<HTMLDivElement|null>(null);

  if (debugComponent || true) {
    console.log(`PreviewTabs:render selectedTab=${selectedTab}`);
  }

  const previewChoices = useMemo(() => {
    return ['Preview', 'Console'];
  }, []);

  const onTabChange = ([value, index]:[string, number]) => {
    // console.log(`PreviewTabs: value=${value} index=${index}`);
    setSelectedTab(value);
  };

  const handleConsoleChange = (value:string) => {
    previewPanelRef.current?.scrollIntoView();
  }

  return (
    <div className="preview-tabs-wrapper">
      <div className="preview-tabs-bar">
        <TabsBulma choices={previewChoices} onChange={onTabChange} />
      </div>
      <div ref={previewPanelRef} className="preview-tabs-panel">
        {/*{selectedTab === 'Preview' && <PreviewIframe code={code} err={err} />}*/}
        {/*{selectedTab === 'Console' && <PreviewConsole />}*/}
        <div style={{display: selectedTab === 'Preview' ? "flex" : "none", height: "100%"}}>
          <PreviewIframe code={code} err={err} />
        </div>
        <div style={{display: selectedTab === 'Console' ? "flex" : "none", height: "100%"}}>
          <PreviewConsole onChange={handleConsoleChange}/>
        </div>
      </div>
    </div>
  );
}

export default PreviewTabs;