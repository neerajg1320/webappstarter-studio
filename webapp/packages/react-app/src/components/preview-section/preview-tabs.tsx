import './preview-tabs.css';
import TabsBulma from "../common/tabs-bulma";
import React, {useEffect, useMemo, useState} from "react";
import PreviewIframe from "./preview-iframe";
import {debugComponent} from "../../config/global";
import PreviewConsole from "./preview-console";

interface PreviewTabsProps {
  code: string;
  err: string
}

const PreviewTabs:React.FC<PreviewTabsProps> = ({code, err}) => {
  const [selectedTab, setSelectedTab] = useState<string>('Console');

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

  return (
    <div className="preview-tabs-wrapper">
      <div className="preview-tabs-bar">
        <TabsBulma choices={previewChoices} onChange={onTabChange} />
      </div>
      <div className="preview-tabs-panel">
        {/*{selectedTab === 'Preview' && <PreviewIframe code={code} err={err} />}*/}
        {/*{selectedTab === 'Console' && <PreviewConsole />}*/}
        <div style={{display: selectedTab === 'Preview' ? "flex" : "none", height: "100%"}}>
          <PreviewIframe code={code} err={err} />
        </div>
        <div style={{display: selectedTab === 'Console' ? "flex" : "none", height: "100%"}}>
          <PreviewConsole />
        </div>
      </div>
    </div>
  );
}

export default PreviewTabs;