import React, {useState, useEffect} from 'react';
import './espan.css';
import {debugComponent} from "../../../config/global";
import ArgItem from "./arg-item";

interface ExpandableSpanProps {
  obj: object;
  level: number;
  expanded: boolean;
};

const ExpandableSpan:React.FC<ExpandableSpanProps> = ({obj, level:propLevel, expanded:propExpanded}) => {
  const [expanded, setExpanded] = useState<{[k:string]:boolean}>({});

  const handleExpandClick = (k:string|number) => {
    if (debugComponent) {
      console.log(`ExpandableSpan:handleExpandClick() k:${k}`)
    }
    setExpanded((prev) => {
      return {...prev, [k]: !prev[k]};
    });
  }

  return (
    <div className="object-wrapper">
      {/*<pre>{JSON.stringify(expanded)}</pre>*/}
      <div className="object-box">
      {propExpanded &&
        Object.entries(obj).map(([k, v], index:number) => {
            return (
                <div key={index} >
                    <div className="entry" >
                      {typeof(v) !== "object" && <span>{k}:</span>}
                      <ArgItem item={v} index={k} expanded={expanded[k]} onClick={handleExpandClick}/>
                    </div>

                </div>
            );
        })
      }
      </div>
    </div>
  );
};

export default ExpandableSpan;