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
  onClick?: (keyName:string|number) => void
`;

interface ExpandableSpanProps {
  itemInfo: ItemInfo;
  keyName: string|number|null;
  parentInfo: ItemInfo|null;
  // The following three can be derived from itemInfo
  // type: string;
  // traversalFunc: TraversalFunc|null;
  // enclosingClass: string|null;

  level: number;
  initialExpanded: boolean;
  getItemInfoFunc: GetItemInfoFunc;
  onClick?: (itemInfo:ItemInfo) => void
};


const ExpandableSpan:React.FC<ExpandableSpanProps> = ({
                                                        itemInfo,
                                                        keyName,

                                                        // type,
                                                        // traversalFunc,
                                                        // enclosingClass,

                                                        parentInfo,
                                                        level:propLevel,
                                                        initialExpanded,
                                                        getItemInfoFunc,
                                                        onClick:propOnClick,
                                                      }) => {
  const [expanded, setExpanded] = useState<boolean>(initialExpanded);

  const handleHOComponentClick = (itemInfo:ItemInfo) => {
    setExpanded((prev) => !prev);

    if (propOnClick) {
      propOnClick(itemInfo)
    }
  }

  return (
    <div className="object-wrapper">
      {/*<pre>{JSON.stringify(childrenExpandedMap)}</pre>*/}
      <KeyValueHOComponent
          // value={itemInfo.value}
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

                                    // type={childItemInfo.type}
                                    // traversalFunc={childItemInfo.traversalFunc}
                                    // enclosingClass={childItemInfo.enclosingClass}

                                    parentInfo={itemInfo}
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