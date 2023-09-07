import React, {useState} from 'react';
import './expandable-span.css';
import {debugComponent} from "../../../config/global";
import {GetItemInfoFunc, KeyValueRepresentationComponentProps, TraversalFunc} from "./expandable-span-item";

export interface KeyValueHOComponentProps extends KeyValueRepresentationComponentProps {
  component: React.FC<KeyValueRepresentationComponentProps>;
}

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



interface ExpandableSpanProps {
  expandableValue: object;
  type: string;
  traversalFunc: TraversalFunc;
  enclosingClass: string|null;
  level: number;
  expanded: boolean;
  getItemInfoFunc: GetItemInfoFunc;
};


const ExpandableSpan:React.FC<ExpandableSpanProps> = ({
                                                        expandableValue,
                                                        type,
                                                        traversalFunc,
                                                        enclosingClass,
                                                        level:propLevel,
                                                        expanded,
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
      <div className={`${enclosingClass||''}`}>
      {expanded &&
        traversalFunc(expandableValue).map(([k, v], index:number) => {
            const childItemInfo = getItemInfoFunc(v)
            if (debugComponent) {
              console.log(`k:${k} v:${v} type:${type} itemInfo(v)`, childItemInfo);
            }

            return (
                <div key={index} >
                  <KeyValueHOComponent
                      value={v}
                      keyName={k}
                      parentType={type}
                      expanded={childrenExpandedMap[k]}
                      component={childItemInfo.component}
                      onClick={(e) => handleExpandClick(k)}
                  />
                  {(childItemInfo.isRecursive && childItemInfo.traversalFunc) &&
                      <>
                      {/*<pre>{JSON.stringify(childItemInfo.traversalFunc(v))}</pre>*/}
                        <ExpandableSpan expandableValue={v}
                                        type={childItemInfo.type}
                                        traversalFunc={childItemInfo.traversalFunc}
                                        enclosingClass={childItemInfo.enclosingClass}
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