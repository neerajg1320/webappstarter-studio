import React, {useState} from 'react';
import './expandable-span.css';
import {debugComponent} from "../../../config/global";
import {GetItemInfoFunc, ItemInfo, KeyValueRepresentationComponentProps, TraversalFunc} from "./expandable-span-item";
import {key} from "localforage";


export interface KeyValueHOComponentProps extends KeyValueRepresentationComponentProps {
  component: React.FC<KeyValueRepresentationComponentProps>;
}

export const KeyValueHOComponent:React.FC<KeyValueHOComponentProps> = ({
                                                                         // value,
                                                                         itemInfo,
                                                                         keyName,
                                                                         parentInfo,
                                                                         expanded=false,
                                                                         onClick,
                                                                         component
                                                                       }) => {
  // console.log(`KeyValueHOComponent:`, value, keyName, parentInfo, component)
  return React.createElement(component, {itemInfo, keyName, parentInfo, expanded, onClick}, null);
}

// KeyValueRepresentationComponentProps
const temp = `
  itemInfo: ItemInfo;
  keyName?: string|number|null;
  parentInfo: ItemInfo|null;
  expanded?: boolean;
  onClick?: (keyName:string|number|null, itemInfo:ItemInfo) => void
`;

interface ExpandableSpanProps {
  itemInfo: ItemInfo;
  keyName: string|number|null;
  parentInfo: ItemInfo|null;
  expanded: boolean;
  onClick?: (keyName:string|number|null, itemInfo:ItemInfo) => void;
  level: number;
  getItemInfoFunc: GetItemInfoFunc;
};


const ExpandableSpan:React.FC<ExpandableSpanProps> = ({
                                                        itemInfo,
                                                        keyName,
                                                        parentInfo,
                                                        level:propLevel,
                                                        expanded: initialExpanded,
                                                        getItemInfoFunc,
                                                        onClick:propOnClick,
                                                      }) => {
  const [expanded, setExpanded] = useState<boolean>(initialExpanded);

  const handleHOComponentClick = (itemInfo:ItemInfo) => {
    setExpanded((prev) => !prev);

    if (propOnClick) {
      propOnClick(keyName, itemInfo)
    }
  }

  return (
    <div className="object-wrapper">
      {/*<pre>{JSON.stringify(childrenExpandedMap)}</pre>*/}
      <KeyValueHOComponent
          itemInfo={itemInfo}
          keyName={keyName}
          parentInfo={parentInfo}
          expanded={expanded}
          component={itemInfo.component}
          onClick={(e) => handleHOComponentClick(itemInfo)}
      />
      <div className={`${itemInfo.enclosingClass||''}`}>
      {(expanded && itemInfo.traversalFunc) &&
        itemInfo.traversalFunc(itemInfo.value).map(([k, v], index:number) => {
            const childItemInfo = getItemInfoFunc(v)
            if (debugComponent) {
              console.log(`k:${k} v:${v} type:${itemInfo.type} itemInfo(v)`, childItemInfo);
            }

            return (
                <div key={index} >
                    <ExpandableSpan itemInfo={childItemInfo}
                                    keyName={k}
                                    parentInfo={itemInfo}
                                    level={propLevel + 1}
                                    expanded={false}
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