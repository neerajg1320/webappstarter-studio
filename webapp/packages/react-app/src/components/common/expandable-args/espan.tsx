import React, {useState, useEffect} from 'react';
import './espan.css';
import {debugComponent} from "../../../config/global";
import ArgItem, {ArgValueProps, GetItemTypeFunc} from "./arg-item";



interface ExpandableSpanProps {
  obj: object;
  level: number;
  expanded: boolean;
  getItemType: GetItemTypeFunc;
  componentMap: {[k:string]:React.FC<ArgValueProps>}
};


const ExpandableSpan:React.FC<ExpandableSpanProps> = ({obj, level:propLevel, expanded:propExpanded,
                                                        getItemType:propGetType, componentMap:propComponentMap}) => {
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

                      <ArgItem item={v} keyName={k} expanded={expanded[k]} getItemType={propGetType} componentMap={propComponentMap} onClick={(e) => handleExpandClick(k)} />

                    </div>
                    {typeof(v) === "object" && <ExpandableSpan obj={v} level={propLevel + 1} expanded={expanded[k]} getItemType={propGetType} componentMap={propComponentMap} />}
                </div>
            );
        })
      }
      </div>
    </div>
  );
};

export default ExpandableSpan;