import {useEffect, useMemo, useRef} from "react";
import './project-list-scroller.css';
import ResizableHorizontalSplitBox from "../../common/resizable-boxes/resizable-boxes-split";
import {useTypedSelector} from "../../../hooks/use-typed-selector";
import {ReduxProject} from "../../../state";
import useVisibility from "../../../hooks/use-visibility";
import useDebounceValue from "../../../hooks/use-debounce-value";

const ProjectListScroller = () => {
  const projectsState = useTypedSelector((state) => state.projects);;
  const projectList = useMemo(() => {
    return Object.entries(projectsState.data).map(([k,v]) => v).filter(item => item.confirmed)
  }, [projectsState.data]);
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

  const scrollerRef = useRef<HTMLDivElement>();
  const isScrollerVisible = useVisibility(scrollerRef);
  console.log(`ProjectListScroller:render isScrollVisible:`, isScrollerVisible);

  const handleProjectListScroll = () => {
    // console.log(`handleProjectListScroll():`);
  };

  useEffect(() => {
    console.log(`ProjectListScroller:useEffect[]`);
  }, []);

  return (
      <div ref={scrollerRef} className="project-scroll-list" onScroll={handleProjectListScroll}>
        {projectList.map((project, index) => {
          return (
              <ResizableHorizontalSplitBox
                  key={index}
                  contentComponent={ContentBox}
                  remainingComponent={RemainingBox}
                  defaultHeight={200}
                  heightConstraints={{min:50, max:400}}
                  innerBoxProportions={innerBoxProportions}
                  data={project}
              />
          );
        })}

      </div>
  )
}

export default ProjectListScroller;