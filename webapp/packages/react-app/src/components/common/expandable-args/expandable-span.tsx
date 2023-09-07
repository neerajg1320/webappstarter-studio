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
  initialExpanded: boolean;
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
                                                        initialExpanded,
                                                        getItemInfoFunc
                                                      }) => {
  const [expanded, setExpanded] = useState<boolean>(initialExpanded);

  const handleExpandClick = (itemInfo:ItemInfo) => {
    if (itemInfo.type === "folder") {
      setExpanded((prev) => !prev);
    } else if (itemInfo.type === "file") {
      if (itemInfo.value.info.reduxFile) {
        console.log(`File ${itemInfo.value.info.reduxFile.path} has been clicked`);
      }
    }
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
                    <ExpandableSpan itemInfo={childItemInfo}
                                    keyName={k}
                                    type={childItemInfo.type}
                                    traversalFunc={childItemInfo.traversalFunc}
                                    enclosingClass={childItemInfo.enclosingClass}
                                    parentType={itemInfo.type}
                                    level={propLevel + 1}
                                    initialExpanded={false}
                                    {...{getItemInfoFunc}}
                    />
                </div>
            );
        })
      }
      </div>
    </div>
  );
};

export default ExpandableSpan;