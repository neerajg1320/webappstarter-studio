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

  // Here we will subscribe to console messages if selection is console.
  useEffect(() => {
    if (debugComponent || true) {
      console.log(`PreviewTabs:useEffect[selectedTab] selectedTab=${selectedTab}`);
    }

    return () => {
      if (debugComponent || true) {
        console.log(`PreviewTabs:useEffect[selectedTab] destroyped`);
      }
    };
  }, [selectedTab]);

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
      <div >
      <TabsBulma choices={previewChoices} onChange={onTabChange} />
      </div>
      {selectedTab === 'Preview' && <PreviewIframe code={code} err={err} />}
      {selectedTab === 'Console' && <PreviewConsole />}
    </div>
  );
}

export default PreviewTabs;