import React, {useMemo} from "react";
import "./project-list-scroll-item.css";
import ResizableHorizontalSplitBox from "../../common/resizable-boxes/resizable-boxes-split";
import {ReduxProject} from "../../../state";

const ProjectListScrollItem = ({index, reduxProject}) => {
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



  return (
      <ResizableHorizontalSplitBox
          key={index}
          contentComponent={ContentBox}
          remainingComponent={RemainingBox}
          defaultHeight={200}
          heightConstraints={{min:50, max:400}}
          innerBoxProportions={innerBoxProportions}
          data={reduxProject}
      />
  )
}

export default ProjectListScrollItem;