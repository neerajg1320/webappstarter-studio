import React, {useState, useEffect} from 'react';
import './espan.css';
import {debugComponent} from "../../../config/global";

export interface LeftItemProps {
  value: any;
  keyName?: string|number;
  expanded?: boolean;
  onClick?: (keyName:string|number) => void
}

interface ComponentItemProps extends LeftItemProps {
  component: React.FC<LeftItemProps>;
}


export type ItemInfo = {
  type:string,
  component:React.FC<LeftItemProps>
  isRecursive:boolean,
};

export type GetItemInfoFunc = (value:any) => ItemInfo;
export type StringComponentMap = {[k:string]:React.FC<LeftItemProps>};


export const KeyValueItem:React.FC<ComponentItemProps> = ({
                                               value,
                                               keyName,
                                               expanded=false,
                                               onClick,
                                               component
                                             }) => {

  return React.createElement(component, {value, keyName, expanded, onClick}, null);
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
                      value={v}
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