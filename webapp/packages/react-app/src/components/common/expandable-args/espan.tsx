import React, {useState, useEffect} from 'react';
import './espan.css';
import {debugComponent} from "../../../config/global";


export type ItemInfo = {
  type:string,
  component:React.FC<LeftItemArgs>
  isRecursive:boolean,
};

export type GetItemInfoFunc = (item:any) => ItemInfo;
export type StringComponentMap = {[k:string]:React.FC<LeftItemArgs>};

export interface LeftItemArgs {
  item: any;
  keyName?: string|number;
  expanded?: boolean;
  onClick?: (keyName:string|number) => void
}

interface KeyValueItemProps extends LeftItemArgs{
  // item: any;
  // keyName?: number|string;
  // expanded?: boolean;
  // onClick?: (keyName:number|string) => void;
  component: React.FC<LeftItemArgs>;
}

export const KeyValueItem:React.FC<KeyValueItemProps> = ({
                                               item,
                                               keyName,
                                               expanded=false,
                                               onClick,
                                               component
                                             }) => {

  return React.createElement(component, {item, keyName, expanded, onClick}, null);
}

interface ExpandableSpanProps {
  obj: object;
  level: number;
  expanded: boolean;
  getItemInfoFunc: GetItemInfoFunc;
  componentMap: StringComponentMap
};


const ExpandableSpan:React.FC<ExpandableSpanProps> = ({obj, level:propLevel, expanded:propExpanded,
                                                        getItemInfoFunc, componentMap}) => {
  const [expanded, setExpanded] = useState<{[k:string]:boolean}>({});

  const handleExpandClick = (k:string|number) => {
    if (debugComponent) {
      console.log(`ExpandableSpan:handleExpandClick() k:${k}`)
    }
    setExpanded((prev) => {
      return {...prev, [k]: !prev[k]};
    });
  }


  return (
    <div className="object-wrapper">
      {/*<pre>{JSON.stringify(expanded)}</pre>*/}
      <div className="object-box">
      {propExpanded &&
        Object.entries(obj).map(([k, v], index:number) => {
            const itemInfo = getItemInfoFunc(v)

            return (
                <div key={index} >
                  <KeyValueItem
                      item={v}
                      keyName={k}
                      expanded={expanded[k]}
                      component={itemInfo.component}
                      onClick={(e) => handleExpandClick(k)}
                  />
                  {itemInfo.isRecursive && <ExpandableSpan obj={v} level={propLevel + 1} expanded={expanded[k]} {...{getItemInfoFunc, componentMap}} />}
                </div>
            );
        })
      }
      </div>
    </div>
  );
};

export default ExpandableSpan;