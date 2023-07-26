import './resizable.css';
import React, {useEffect, useState} from "react";
import {ResizableBox, ResizableBoxProps} from "react-resizable";

interface ResizableProps {
    children?: React.ReactNode;
    direction: "horizontal" | "vertical";
}

const Resizable: React.FC<ResizableProps> = ({children, direction}) => {
    let resizableBoxProps: ResizableBoxProps;
    const [innerHeight, setInnerHeight] = useState(window.innerHeight);
    const [innerWidth, setInnerWidth] = useState(window.innerWidth);
    const [width, setWidth] = useState(window.innerWidth * 0.75);
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
                if (window.innerWidth * 0.75 < width) {
                    setWidth(window.innerWidth * 0.75);
                }
            }, 100);
        }

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
            height: 300,
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
