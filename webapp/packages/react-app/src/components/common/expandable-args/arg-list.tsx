import React,{useState} from 'react';
import "./arg-list.css";
import {ClickableKeyObjectItem, DivItem, DoubleQuotedDivItem} from "./item-components";
import ExpandableSpan, {KeyValueItem, LeftItemProps, ItemInfo} from "./espan";

export const consoleComponentMap:{[k:string]:React.FC<LeftItemProps>} = {
  "object": ClickableKeyObjectItem,
  "string": DoubleQuotedDivItem,
  "default": DivItem,
}

export const getConsoleItemInfo = (value:any):ItemInfo => {
  const itemType = typeof(value);
  let component = consoleComponentMap["default"];
  if (Object.keys(consoleComponentMap).includes(itemType)) {
    component = consoleComponentMap[itemType]
  }
  return {type: itemType, isRecursive: itemType === "object", component};
}


interface ArgListProps {
  list: any[];  
}


const ArgList:React.FC<ArgListProps> = ({list}) => {
  const [expanded, setExpanded] = useState<{[k:string]:boolean}>({});

  const handleArgClick = (k:number|string) => {
    setExpanded((prev) => {
      return {...prev, [k]: !prev[k]};
    });
  }

  return (
    <div className="args-wrapper">
      {/*<pre>{JSON.stringify(expanded, null, 2)}</pre>*/}
      <div className="args-box">
      {(list && list.length > 0) &&
        list.map((value:any, index:number) => {
          const itemInfo = getConsoleItemInfo(value);

          return (
            <div key={index}>
              <KeyValueItem value={value}
                            keyName={typeof(value) === "object" ? index : undefined}
                            expanded={expanded[index]}
                            onClick={handleArgClick}
                            component={itemInfo.component}
              />
              {itemInfo.isRecursive &&
                  <ExpandableSpan
                      obj={value}
                      level={0}
                      expanded={expanded[index]}
                      getItemInfoFunc={getConsoleItemInfo}
                      componentMap={consoleComponentMap}
                  />
              }
            </div>
          );
        })
      }
      </div>
    </div>
  );
}

export default ArgList;