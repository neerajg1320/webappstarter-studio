import React,{useState} from 'react';
import ExpandableSpan from './espan';
import "./arg-list.css";

interface ArgListProps {
  list: any[];  
}

interface ArgProps {
  item: any;
  index: number;
  expanded: boolean;
  onClick?: (index:number) => void;
}
const Arg:React.FC<ArgProps> = ({item, index, expanded, onClick:propOnClick}) => {
  const handleExpandClick = (index:number) => {
    if (propOnClick) {
      propOnClick(index)
    }
  }
  return (
    <>
    {(typeof(item) === "object") ?
        <div  className="arg-object" >
          <span onClick={(e) => handleExpandClick(index)}>{index}:&gt;</span>
          <ExpandableSpan obj={item} level={1} expanded={expanded}/>
        </div>
        :
        <span>{item}</span>
    }
    </>
  );
}

const ArgList:React.FC<ArgListProps> = ({list}) => {
  const [expanded, setExpanded] = useState<{[k:string]:boolean}>({});

  const handleArgClick = (k:number) => {
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