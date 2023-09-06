import React,{useState} from 'react';
import "./arg-list.css";
import ArgItem, {argArrayComponentMap, getConsoleItemInfo} from "./arg-item";
import ExpandableSpan from "./espan";

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
        list.map((item:any, index:number) => {
          const itemInfo = getConsoleItemInfo(item);
          return (
            <div key={index}>
              <ArgItem item={item}
                       keyName={typeof(item) === "object" ? index : undefined}
                       expanded={expanded[index]}
                       onClick={handleArgClick}
                       itemType={itemInfo.type}
                       componentMap={argArrayComponentMap}
              />
              {itemInfo.isRecursive &&
                  <ExpandableSpan
                      obj={item}
                      level={0}
                      expanded={expanded[index]}
                      getItemInfoFunc={getConsoleItemInfo}
                      componentMap={argArrayComponentMap}
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