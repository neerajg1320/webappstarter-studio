import React, {useState, useEffect, useRef, useLayoutEffect, ElementType} from 'react';
import {Resizable} from 'react-resizable';
import {ElementSize, ElementProportions, DimensionConstraints} from './resizable.ts';
import './resizable-boxes-split.css';
import './resizable.css';
import useWindowSize from "../../../hooks/use-window-size";
import useVisibility from "../../../hooks/use-visibility";
import useDebounceValue from "../../../hooks/use-debounce-value";
import {debugComponent} from "../../../config/global";

interface ResizableHorizontalSplitBoxProps {
  contentComponent: ElementType;
  remainingComponent: ElementType;
  preserveProportion?: boolean;
  defaultHeight: number;
  heightConstraints: DimensionConstraints;
  innerBoxProportions: ElementProportions;
  data: any;
}

const defaultInnerProportions:ElementProportions = {
  width: {min:0.1, current:0.5, max:0.9}
}

// ResizableSplitBox: Two Resizable boxes where the height of both remains equal but the width can change
// We had to use inline-flex
const ResizableHorizontalSplitBox:React.FC<ResizableHorizontalSplitBoxProps>  = ({
                                                                                   contentComponent:PropContentComponent,
                                                                                   remainingComponent:PropRemainingComponent,
                                                                                   preserveProportion=true,
                                                                                   defaultHeight=200,
                                                                                   heightConstraints={min:100, max:Infinity},
                                                                                   innerBoxProportions,
                                                                                   data:propData,
                                                                                 }) => {
  const [innerProportions, setInnerProportions] = useState<ElementProportions>(innerBoxProportions);
  /* We derive the width and height from outerSize innerWidth=(innerProportions.width.current * outerSize.width) innerHeight=(outerHeight)*/
  const [innerSize, setInnerSize] = useState<ElementSize>({width: 0, height: 0});
  /* The width doesn't matter in outerBox as we make it 100% */
  const [outerSize, setOuterSize] = useState<ElementSize>({width: 0, height: defaultHeight});

  /* We reset the width of the inner as per innerProportions.width.current when the size of the window changes */
  const outerBoxRef = useRef<HTMLDivElement>();
  const windowSize = useWindowSize();

  //  TBD: The visibility logic can be taken out to a function like withVisibility()
  const isVisible = useVisibility(outerBoxRef);
  // The useDebounceValue value here solves the initial visibility for all during the layout
  const debouncedVisible = useDebounceValue(isVisible, 100);
  if (debugComponent) {
    console.log(`ResizableHorizontalSplitBox: ${propData.title.padEnd(20)} isVisible:${isVisible.toString().padEnd(5)} debouncedVisible:${debouncedVisible}`);
  }

  useEffect(() => {
    if (debugComponent) {
      console.log(`useEffect[debouncedVisible] ${propData.title.padEnd(20)}: ${debouncedVisible}`);
    }
  }, [debouncedVisible]);
  // visibility logic ends

  useLayoutEffect(() => {
    console.log(`useLayoutEffect[windowSize] width=${outerBoxRef.current.offsetWidth} height=${outerBoxRef.current.offsetHeight}`);

    // We do not use updateInnerWidth as we do not want to update the innerProportions.width.current
    setInnerSize((prev) => {
      return {...prev, width: outerBoxRef.current.offsetWidth * innerProportions.width.current}
    });
  }, [windowSize]);

  // This will update the outer height if within bounds
  const updateOuterHeight = (height:number) => {
    const {min, max} = heightConstraints;
    if ((min < height) && (height < max)) {
      setOuterSize((prev) => {
        return {...prev, height};
      });
    }
  };

  const handleOuterResize = (event, {node, size, handle}) => {
    // console.log(`handleOuterResize:`, size);
    updateOuterHeight(size.height);
  }

  // This will update the inner width and recompute the inner width proportion if within bounds
  const updateInnerWidth = (width:number) => {
    const newInnerWidthProportion = width / outerBoxRef.current.offsetWidth;

    if ((innerProportions.width.min < newInnerWidthProportion) && (newInnerWidthProportion < innerProportions.width.max)) {
      setInnerSize((prev) => {
        return {...prev, width};
      });
      if (preserveProportion) {
        setInnerProportions((prev) => {
          return {...prev, width: {...prev.width, current: newInnerWidthProportion}};
        });
      }
    }
  }

  const handleInnerResize = (event, {node, size, handle}) => {
    // console.log(`handleInnerResize:`, size.width, outerBoxRef.current.offsetWidth);
    updateInnerWidth(size.width);

    if (handle === 'se') {
      const heightDelta = size.height - innerSize.height;
      updateOuterHeight(outerSize.height + heightDelta);
    }
  }

  // We adjust the height of the inner when the outer box height is changed
  useEffect(() => {
    if (innerSize.height !== outerSize.height) {
      setInnerSize((prev) => {
        return {...prev, height:outerSize.height};
      });
    }
  }, [outerSize]);

  return (
      <>
        {/*  All components must begin with Caps */}
        <Resizable width={Infinity} height={outerSize.height} onResize={handleOuterResize}  resizeHandles={['s']}>
          <div ref={outerBoxRef} className="outer-box" style={{width: "100%", height: (outerSize.height) + 'px'}}>

            <Resizable width={innerSize.width} height={innerSize.height} onResize={handleInnerResize} resizeHandles={['e', 'se']}>
              <div className="inner-box" style={{width: (innerSize.width) + 'px', height: (innerSize.height) + 'px', border:""}}>
                <PropContentComponent title="Thor" data={propData} />
              </div>
            </Resizable>

            <PropRemainingComponent name="Loki" data={propData} />
          </div>
        </Resizable>
      </>
  )
}

export default ResizableHorizontalSplitBox;