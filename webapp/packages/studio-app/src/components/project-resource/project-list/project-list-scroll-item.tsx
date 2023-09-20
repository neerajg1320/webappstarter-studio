import React, {useEffect, useMemo, useRef} from "react";
import "./project-list-scroll-item.css";
import ResizableHorizontalSplitBox from "../../common/resizable-boxes/resizable-boxes-split";
import {ReduxProject} from "../../../state";
import useVisibility from "../../../hooks/use-visibility";
import useDebounceValue from "../../../hooks/use-debounce-value";
import {debugComponent} from "../../../config/global";

const ProjectListScrollItem = ({index, reduxProject}) => {
  const scrollItemRef = useRef<HTMLDivElement>();
  const innerBoxProportions = useMemo(() => {
    return {
      width: {min:0.1, current:0.2, max:0.8}
    }
  }, [])

  const ContentBox = ({data:project}:{data:ReduxProject}) => {
    return (
        <div className="content-box">
          <h2>{project.title}</h2>
          <span>{project.description}</span>
        </div>
    );
  };
  const RemainingBox = ({data:project}:{data:ReduxProject}) => {
    return (
        <div className="remaining-box" >
          <pre>{project.bundle}</pre>
        </div>
    );
  };

  //  TBD: The visibility logic can be taken out to a function like withVisibility()
  const isVisible = useVisibility(scrollItemRef);
  // The useDebounceValue value here solves the initial visibility for all during the layout
  const debouncedVisible = useDebounceValue(isVisible, 100);
  if (debugComponent || true) {
    console.log(`ResizableHorizontalSplitBox: ${reduxProject.title.padEnd(20)} isVisible:${isVisible.toString().padEnd(5)} debouncedVisible:${debouncedVisible}`);
  }

  useEffect(() => {
    if (debugComponent || true) {
      console.log(`useEffect[debouncedVisible] ${reduxProject.title.padEnd(20)}: ${debouncedVisible}`);
    }
  }, [debouncedVisible]);
  // visibility logic ends


  return (
      <div ref={scrollItemRef}>
        <ResizableHorizontalSplitBox
            key={index}
            contentComponent={ContentBox}
            remainingComponent={RemainingBox}
            defaultHeight={200}
            heightConstraints={{min:50, max:400}}
            innerBoxProportions={innerBoxProportions}
            data={reduxProject}
        />
      </div>
  )
}

export default ProjectListScrollItem;