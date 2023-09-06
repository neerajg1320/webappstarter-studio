import React,{useState} from 'react';
import "./arg-list.css";
import ArgItem, {argArrayComponentMap, expandableSpanComponentMap, getConsoleItemType} from "./arg-item";
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
          return (
            <div key={index}>
              <ArgItem item={item} keyName={index} expanded={expanded[index]} onClick={handleArgClick}
                       getType={getConsoleItemType} componentMap={argArrayComponentMap}
              />
              {typeof(item) === "object" && <ExpandableSpan obj={item} level={0} expanded={expanded[index]} getType={getConsoleItemType} componentMap={expandableSpanComponentMap}/>}
            </div>
          );
        })
      }
      </div>
    </div>
  );
}

export default ArgList;