import React, {useState, useEffect} from 'react';
import './espan.css';

interface ExpandableSpanProps {
  obj: object;
  level: number;
  expanded: boolean;
};

const ExpandableSpan:React.FC<ExpandableSpanProps> = ({obj, level:propLevel, expanded:propExpanded}) => {
  const [expanded, setExpanded] = useState<{[k:string]:boolean}>({});

  const handleExpandClick = (k:string) => {
    console.log(`ExpandableSpan:handleExpandClick() k:${k}`)
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
                  {typeof(v) === "object" ?
                    <div className="entry-object" onClick={(e) => handleExpandClick(k)}>
                      <span>{k}:&gt;</span>
                      <ExpandableSpan obj={v} level={propLevel + 1} expanded={expanded[k]} />
                    </div>
                    :
                    <div className="entry" >
                      <span>{k}:{v}</span>
                    </div>
                  }
                </div>
            );
        })
      }
      </div>
    </div>
  );
};

export default ExpandableSpan;