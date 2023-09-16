import React, {useState} from 'react';
import {Resizable, ResizeHandleAxis} from 'react-resizable';
import './resizable-div.css';

type Size = {width:number, height:number}

interface ResizableDivProps {
  width:number;
  height: number;
  children?: JSX.Element;
  onChange?: (size:Size) => void;
  resizeHandles?: ResizeHandleAxis[];
}

const ResizableDiv:React.FC<ResizableDivProps> = ({width:initialWidth, height:initialHeight, children, resizeHandles}) => {
  const [state, setState] = useState<Size>({
    width: initialWidth,
    height: initialHeight,
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
          resizeHandles={resizeHandles}
      >
        <div className="resizable-div" style={{width: state.width + 'px', height: state.height + 'px'}}>
          {children}
        </div>
      </Resizable>
  );
}

export default ResizableDiv;