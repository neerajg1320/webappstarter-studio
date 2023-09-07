import React, {useState} from 'react';
import './expandable-span.css';
import {debugComponent} from "../../../config/global";
import {GetItemInfoFunc, ItemInfo, KeyValueRepresentationComponentProps, TraversalFunc} from "./expandable-span-item";

export interface KeyValueHOComponentProps extends KeyValueRepresentationComponentProps {
  component: React.FC<KeyValueRepresentationComponentProps>;
}

export const KeyValueHOComponent:React.FC<KeyValueHOComponentProps> = ({
                                                                         // value,
                                                                         itemInfo,
                                                                         keyName,
                                                                         parentType,
                                                                         expanded=false,
                                                                         onClick,
                                                                         component
                                                                       }) => {
  // console.log(`KeyValueHOComponent:`, value, keyName, parentType, component)
  return React.createElement(component, {itemInfo, keyName, parentType, expanded, onClick}, null);
}



interface ExpandableSpanProps {
  itemInfo: ItemInfo;
  keyName: string|number|null;
  type: string;
  traversalFunc: TraversalFunc|null;
  enclosingClass: string|null;
  parentType: string|null;
  level: number;
  // expanded: boolean;
  getItemInfoFunc: GetItemInfoFunc;
};


const ExpandableSpan:React.FC<ExpandableSpanProps> = ({
                                                        itemInfo,
                                                        keyName,
                                                        type,
                                                        traversalFunc,
                                                        enclosingClass,
                                                        parentType=null,
                                                        level:propLevel,
                                                        // expanded,
                                                        getItemInfoFunc
                                                      }) => {
  // const [childrenExpandedMap, setChildrenExpandedMap] = useState<{[k:string]:boolean}>({});
  const [expanded, setExpanded] = useState<boolean>(false);
  const handleExpandClick = (itemInfo:ItemInfo) => {
    if (debugComponent) {
      console.log(`ExpandableSpan:handleExpandClick() itemInfo:${
        JSON.stringify(itemInfo, 
            function (key, value) {
            if (key === "parent") {
              if (value != null) {
                return value.info.name;
              }
            }
            return value;
          }, 
            2)
      }`)
    }
    setExpanded((prev) => !prev);
  }


  return (
    <div className="object-wrapper">
      {/*<pre>{JSON.stringify(childrenExpandedMap)}</pre>*/}
      <KeyValueHOComponent
          // value={itemInfo.value}
          itemInfo={itemInfo}
          keyName={keyName}
          parentType={parentType}
          expanded={expanded}
          component={itemInfo.component}
          onClick={(e) => handleExpandClick(itemInfo)}
      />
      <div className={`${enclosingClass||''}`}>
      {(expanded && traversalFunc) &&
        traversalFunc(itemInfo.value).map(([k, v], index:number) => {
            const childItemInfo = getItemInfoFunc(v)
            if (debugComponent) {
              console.log(`k:${k} v:${v} type:${type} itemInfo(v)`, childItemInfo);
            }

            return (
                <div key={index} >

                    <>
                    {/*<pre>{JSON.stringify(childItemInfo.traversalFunc(v))}</pre>*/}
                      <ExpandableSpan itemInfo={childItemInfo}
                                      keyName={k}
                                      type={childItemInfo.type}
                                      traversalFunc={childItemInfo.traversalFunc}
                                      enclosingClass={childItemInfo.enclosingClass}
                                      parentType={itemInfo.type}
                                      level={propLevel + 1}
                                      // expanded={childrenExpandedMap[k]}
                                      {...{getItemInfoFunc}}
                      />
                    </>

                </div>
            );
        })
      }
      </div>
    </div>
  );
};

export default ExpandableSpan;