import React,{useState} from 'react';
import "./arg-list.css";
import Arg from "./arg";

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
              <Arg item={item} index={index} expanded={expanded[index]} onClick={handleArgClick} />
            </div>
          );
        })
      }
      </div>
    </div>
  );
}

export default ArgList;