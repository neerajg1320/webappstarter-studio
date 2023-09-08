import './resizable.css';
import React, {useEffect, useState} from "react";
import {ResizableBox, ResizableBoxProps} from "react-resizable";

interface ResizableProps {
    children?: React.ReactNode;
    direction: "horizontal" | "vertical";
}

class CalmResizeObserver extends ResizeObserver {
  constructor(callback: ResizeObserverCallback) {
    super((entries, observer) => {
      requestAnimationFrame(() => {
        callback(entries, observer);
      });
    });
  }
}

const Resizable: React.FC<ResizableProps> = ({children, direction}) => {
    const widthProportion:number = 0.75;
    const heightProportion:number = 0.5;

    let resizableBoxProps: ResizableBoxProps;
    const [innerHeight, setInnerHeight] = useState(window.innerHeight);
    const [innerWidth, setInnerWidth] = useState(window.innerWidth);
    const [width, setWidth] = useState(window.innerWidth * widthProportion);

    // Added later for trial
    const [height, setHeight] = useState(window.innerHeight * heightProportion);

    // TBD: We should be saving the proportion if the horizontal is moved
    // We need to preserve this when window is resized
    useEffect(() => {
        let timer: any;

        const listener = () => {
            if (timer) {
                clearTimeout(timer);
            }

            // console.log(window.innerWidth, window.innerHeight);
            timer = setTimeout(() => {
                setInnerHeight(window.innerHeight);
                setInnerWidth(window.innerWidth);
                if (window.innerWidth * widthProportion < width) {
                    setWidth(window.innerWidth * widthProportion);
                }

              if (window.innerHeight * heightProportion < height) {
                setHeight(window.innerHeight * heightProportion);
              }
            }, 100);
        }

        // https://stackoverflow.com/questions/49384120/resizeobserver-loop-limit-exceeded
        window.ResizeObserver = CalmResizeObserver;

        window.addEventListener('resize', listener);

        return () => {
          window.removeEventListener('resize', listener)
        };
    }, [width]);

    if (direction === 'horizontal') {
        // Horizontal
        resizableBoxProps = {
            className: 'resize-horizontal',
            minConstraints: [innerWidth * 0.2, Infinity],
            maxConstraints: [innerWidth * 0.75, Infinity],
            height: Infinity,
            width: width,
            resizeHandles: ['e'],
            onResizeStop: (event, data) => {
                // console.log(data.size);
                setWidth(data.size.width);
            }
        };
    } else {
        // Vertical
        resizableBoxProps = {
            minConstraints: [Infinity, 150],
            maxConstraints: [Infinity, innerHeight * 0.9],
            height: height,
            width: Infinity,
            resizeHandles: ['s']
        };
    }

    return (
        <ResizableBox {...resizableBoxProps}>
            {children}
        </ResizableBox>
    )
}

export default Resizable;
