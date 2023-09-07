import React, {useState} from 'react';
import './expandable-span.css';
import {debugComponent} from "../../../config/global";
import {GetItemInfoFunc, ItemInfo, KeyValueRepresentationComponentProps} from "./expandable-span-item";


export interface KeyValueHOComponentProps extends KeyValueRepresentationComponentProps {
  component: React.FC<KeyValueRepresentationComponentProps>;
}

export const KeyValueHOComponent:React.FC<KeyValueHOComponentProps> = ({
                                                                         itemInfo,
                                                                         keyName,
                                                                         parentInfo,
                                                                         expanded=false,
                                                                         level,
                                                                         onClick,
                                                                         component
                                                                       }) => {
  return React.createElement(component, {itemInfo, keyName, parentInfo, expanded, level, onClick}, null);
}


interface ExpandableSpanProps extends KeyValueRepresentationComponentProps {
  getItemInfoFunc: GetItemInfoFunc;
};


const ExpandableSpan:React.FC<ExpandableSpanProps> = ({
                                                        itemInfo,
                                                        keyName=null,
                                                        parentInfo,
                                                        expanded: initialExpanded=false,
                                                        level:propLevel,
                                                        onClick:propOnClick,
                                                        getItemInfoFunc,

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
      {/* The Representation of the Compoenent */}
      <KeyValueHOComponent
          itemInfo={itemInfo}
          keyName={keyName}
          parentInfo={parentInfo}
          expanded={expanded}
          level={propLevel}
          onClick={(e) => handleHOComponentClick(itemInfo)}
          component={itemInfo.component}
      />

      {/* We traverse the item if it has a traversalFunc and the state is expanded */}
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
                                    expanded={false}
                                    level={propLevel + 1}
                                    onClick={propOnClick}
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