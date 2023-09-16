import React, {SyntheticEvent, useState} from 'react';
import {Resizable, ResizeHandleAxis, ResizeCallbackData} from 'react-resizable';
import './resizable-div.css';

export type ElementSize = {width:number, height:number}

interface ResizableDivProps {
  width:number;
  height: number;
  children?: JSX.Element;
  onResize?: (e: SyntheticEvent, data: ResizeCallbackData) => any;
  resizeHandles?: ResizeHandleAxis[];
}

const ResizableDiv:React.FC<ResizableDivProps> = ({width, height, children, onResize:propOnResize, resizeHandles}) => {
  const handleResize = (event, {node, size, handle}) => {
    if (propOnResize) {
      propOnResize(event, {node, size, handle});
    }
  };

  const handleResizeStart = (event, {node, size, handle}) => {
    // console.log(`handleResizeStart`);
  }

  const handleResizeStop = (event, {node, size, handle}) => {
    // console.log(`handleResizeStop`);
  }

  return (
      <Resizable
          height={height} width={width}
          onResize={handleResize} onResizeStart={handleResizeStart} onResizeStop={handleResizeStop}
          resizeHandles={resizeHandles}
      >
        <div className="resizable-div" style={{width: width + 'px', height: height + 'px'}}>
          {children}
        </div>
      </Resizable>
  );
}

export default ResizableDiv;