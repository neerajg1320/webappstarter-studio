import React, {useState} from 'react';
import {Resizable} from 'react-resizable';
import './resizable-div.css';

type Size = {width:number, height:number}

interface ResizableDivProps {
  width:number;
  height: number;
  children?: JSX.Element;
  onChange?: (size:Size) => void;
}

const ResizableDiv:React.FC<ResizableDivProps> = ({width, height, children}) => {
  const [state, setState] = useState<Size>({
    width: 200,
    height: 200,
  });

  const handleResize = (event, {node, size, handle}) => {
    // console.log(`handleResize`);
    setState({width: size.width, height: size.height})
  };

  const handleResizeStart = (event, {node, size, handle}) => {
    console.log(`handleResizeStart`);
  }

  const handleResizeStop = (event, {node, size, handle}) => {
    console.log(`handleResizeStop`);
  }

  return (
      <Resizable
          height={state.height} width={state.width}
          onResize={handleResize} onResizeStart={handleResizeStart} onResizeStop={handleResizeStop}
          resizeHandles={['se', 'sw', 's', 'w']}
      >
        {/* class react-resizable will be added to following div"*/}
        <div className="resizable-div" style={{width: state.width + 'px', height: state.height + 'px'}}>
          {children}
        </div>
      </Resizable>
  );
}

export default ResizableDiv;