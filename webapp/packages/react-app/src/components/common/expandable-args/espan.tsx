import React, {useState, useEffect} from 'react';
import './espan.css';
import {debugComponent} from "../../../config/global";
import ArgItem, {ArgValueProps} from "./arg-item";

interface ExpandableSpanProps {
  obj: object;
  level: number;
  expanded: boolean;
  getType?: (item:any) => string;
  componentMap?: {[k:string]:React.FC<ArgValueProps>}
};


const ExpandableSpan:React.FC<ExpandableSpanProps> = ({obj, level:propLevel, expanded:propExpanded,
                                                        getType:propGetType, componentMap:propComponentMap}) => {
  const [expanded, setExpanded] = useState<{[k:string]:boolean}>({});

  const handleExpandClick = (k:string|number) => {
    if (debugComponent) {
      console.log(`ExpandableSpan:handleExpandClick() k:${k}`)
    }
    setExpanded((prev) => {
      return {...prev, [k]: !prev[k]};
    });
  }

  const recursiveProps = {level: propLevel+1, getType:propGetType, componentMap:propComponentMap}
  return (
    <div className="object-wrapper">
      {/*<pre>{JSON.stringify(expanded)}</pre>*/}
      <div className="object-box">
      {propExpanded &&
        Object.entries(obj).map(([k, v], index:number) => {
            return (
                <div key={index} >
                    <div className="entry" >
                      <span onClick={(e) => handleExpandClick(k)}>
                        {k}:
                      </span>
                      {typeof(v) === "object" && <i className={"fas" +  (expanded[k] ? " fa-caret-down" : " fa-caret-right")} />}
                      {typeof(v) !== "object" && <ArgItem item={v} keyName={k} expanded={expanded[k]} getType={propGetType} componentMap={propComponentMap}/>}
                    </div>
                    {typeof(v) === "object" && <ExpandableSpan obj={v} level={propLevel + 1} expanded={expanded[k]} />}
                </div>
            );
        })
      }
      </div>
    </div>
  );
};

export default ExpandableSpan;