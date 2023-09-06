import React, {useState} from 'react';
import './espan.css';
import {debugComponent} from "../../../config/global";

export interface KeyValueRepresentationComponentProps {
  value: any;
  keyName?: string|number;
  expanded?: boolean;
  onClick?: (keyName:string|number) => void
}

interface KeyValueHOComponentProps extends KeyValueRepresentationComponentProps {
  component: React.FC<KeyValueRepresentationComponentProps>;
}


export type ItemInfo = {
  type:string,
  component:React.FC<KeyValueRepresentationComponentProps>
  isRecursive:boolean,
};

export type GetItemInfoFunc = (value:any) => ItemInfo;


export const KeyValueHOComponent:React.FC<KeyValueHOComponentProps> = ({
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
  const [childrenExpandedMap, setChildrenExpandedMap] = useState<{[k:string]:boolean}>({});

  const handleExpandClick = (k:string|number) => {
    if (debugComponent) {
      console.log(`ExpandableSpan:handleExpandClick() k:${k}`)
    }
    setChildrenExpandedMap((prev) => {
      return {...prev, [k]: !prev[k]};
    });
  }


  return (
    <div className="object-wrapper">
      {/*<pre>{JSON.stringify(childrenExpandedMap)}</pre>*/}
      <div className="object-box">
      {propExpanded &&
        Object.entries(obj).map(([k, v], index:number) => {
            const itemInfo = getItemInfoFunc(v)

            return (
                <div key={index} >
                  <KeyValueHOComponent
                      value={v}
                      keyName={k}
                      expanded={childrenExpandedMap[k]}
                      component={itemInfo.component}
                      onClick={(e) => handleExpandClick(k)}
                  />
                  {itemInfo.isRecursive && <ExpandableSpan obj={v} level={propLevel + 1} expanded={childrenExpandedMap[k]} {...{getItemInfoFunc}} />}
                </div>
            );
        })
      }
      </div>
    </div>
  );
};

export default ExpandableSpan;