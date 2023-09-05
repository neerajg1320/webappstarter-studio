import React,{useState} from 'react';
import ExpandableSpan from './espan';
import "./args.css";

interface ArgsProps {
  list: any[];  
}

const Args:React.FC<ArgsProps> = ({list}) => {
  const [expanded, setExpanded] = useState<{[k:string]:boolean}>({});

  const handleExpandClick = (k:number) => {
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
            <>  
            {(typeof(item) === "object") ?
                <div  className="arg-object" onClick={(e) => handleExpandClick(index)}>
                  <span>{index}:&gt;</span> 
                  <ExpandableSpan obj={item} level={1} expanded={expanded[index]}/>
                </div>
            :
                <span>{item}</span>
            }
            </>  
          );
        })
      }
      </div>
    </div>
  );
}

export default Args;