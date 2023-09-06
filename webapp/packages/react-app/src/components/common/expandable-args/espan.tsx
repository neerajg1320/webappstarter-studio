import React, {useState} from 'react';
import './espan.css';
import {debugComponent} from "../../../config/global";

export interface KeyValueRepresentationComponentProps {
  value: any;
  keyName?: string|number;
  parentType: string;
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
  traversalFunc: TraversalFunc|null,
};

export type GetItemInfoFunc = (value:any) => ItemInfo;




export const KeyValueHOComponent:React.FC<KeyValueHOComponentProps> = ({
                                                                         value,
                                                                         keyName,
                                                                         parentType,
                                                                         expanded=false,
                                                                         onClick,
                                                                         component
                                                                       }) => {

  return React.createElement(component, {value, keyName, parentType, expanded, onClick}, null);
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
  type: string;
  traversalFunc: TraversalFunc;
  level: number;
  expanded: boolean;
  getItemInfoFunc: GetItemInfoFunc;
};


const ExpandableSpan:React.FC<ExpandableSpanProps> = ({
                                                        objectOrArray:propObjectOrArray,
                                                        type,
                                                        traversalFunc,
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
      <div className={type === "array" ? "array-horizontal-box" : "object-vertical-box"}>
      {propExpanded &&
        // Object.entries(obj)
        // arr.map((v, index) => [index,v])
        traversalFunc(propObjectOrArray).map(([k, v], index:number) => {
            const itemInfo = getItemInfoFunc(v)
            if (debugComponent) {
              console.log(`k:${k} v:${v} itemInfo(v)`, itemInfo);
            }

            return (
                <div key={index} >
                  <KeyValueHOComponent
                      value={v}
                      keyName={k}
                      parentType={type}
                      expanded={childrenExpandedMap[k]}
                      component={itemInfo.component}
                      onClick={(e) => handleExpandClick(k)}
                  />
                  {(itemInfo.isRecursive && itemInfo.traversalFunc) &&
                      <>
                      {/*<pre>{JSON.stringify(itemInfo.traversalFunc(v))}</pre>*/}
                        <ExpandableSpan objectOrArray={v}
                                        type={itemInfo.type}
                                        traversalFunc={itemInfo.traversalFunc}
                                        level={propLevel + 1}
                                        expanded={childrenExpandedMap[k]}
                                        {...{getItemInfoFunc}}
                        />
                      </>
                  }
                </div>
            );
        })
      }
      </div>
    </div>
  );
};

export default ExpandableSpan;