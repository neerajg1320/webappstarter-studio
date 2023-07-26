import './preview-tabs.css';
import TabsBulma from "../common/tabs-bulma";
import {useMemo, useState} from "react";



const PreviewTabs = () => {
  const previewChoices = useMemo(() => {
    return ['Preview', 'Console'];
  }, []);

  const onTabChange = ([value, index]:[string, number]) => {
    console.log(`PreviewTabs: value=${value} index=${index}`);
  };

  return (
    <>
    <TabsBulma choices={previewChoices} onChange={onTabChange} />
    </>
  );
}

export default PreviewTabs;