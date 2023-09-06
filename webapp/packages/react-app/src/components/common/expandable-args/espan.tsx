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

export type TraversalFunc = (value:any) => [string, any][];

export type ItemInfo = {
  type:string,
  component:React.FC<KeyValueRepresentationComponentProps>
  isRecursive:boolean,
  isArray: boolean,
  traversalFunc: TraversalFunc|null,
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


export const ObjectTraversalFunc:TraversalFunc= (value) => {
  return Object.entries(value);
}

export const ArrayTraversalFunc:TraversalFunc= (value) => {
  return value.map((item:any, index:number) => {
    return [index, item];
  });
}

interface ExpandableSpanProps {
  objectOrArray: object;
  isArray: boolean;
  level: number;
  expanded: boolean;
  getItemInfoFunc: GetItemInfoFunc;
};


const ExpandableSpan:React.FC<ExpandableSpanProps> = ({
                                                        objectOrArray:propObjectOrArray,
                                                        isArray=false,
                                                        level:propLevel,
                                                        expanded:propExpanded,
                                                        getItemInfoFunc
                                                      }) => {
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
      <div className={isArray ? "array-horizontal-box" : "object-vertical-box"}>
      {propExpanded &&
        Object.entries(propObjectOrArray).map(([k, v], index:number) => {
            const itemInfo = getItemInfoFunc(v)
            console.log(`itemInfo:`, itemInfo);

            return (
                <div key={index} >
                  <KeyValueHOComponent
                      value={v}
                      keyName={k}
                      expanded={childrenExpandedMap[k]}
                      component={itemInfo.component}
                      onClick={(e) => handleExpandClick(k)}
                  />
                  {itemInfo.isRecursive && <ExpandableSpan objectOrArray={v} isArray={itemInfo.isArray} level={propLevel + 1} expanded={childrenExpandedMap[k]} {...{getItemInfoFunc}} />}
                </div>
            );
        })
      }
      </div>
    </div>
  );
};

export default ExpandableSpan;