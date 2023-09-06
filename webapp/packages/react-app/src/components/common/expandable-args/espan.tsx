import React, {useState} from 'react';
import './espan.css';
import {debugComponent} from "../../../config/global";

export interface LeafItemProps {
  value: any;
  keyName?: string|number;
  expanded?: boolean;
  onClick?: (keyName:string|number) => void
}

interface ComponentItemProps extends LeafItemProps {
  component: React.FC<LeafItemProps>;
}


export type ItemInfo = {
  type:string,
  component:React.FC<LeafItemProps>
  isRecursive:boolean,
};

export type GetItemInfoFunc = (value:any) => ItemInfo;


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
};


const ExpandableSpan:React.FC<ExpandableSpanProps> = ({obj, level:propLevel, expanded:propExpanded,
                                                        getItemInfoFunc}) => {
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
                  {itemInfo.isRecursive && <ExpandableSpan obj={v} level={propLevel + 1} expanded={expanded[k]} {...{getItemInfoFunc}} />}
                </div>
            );
        })
      }
      </div>
    </div>
  );
};

export default ExpandableSpan;