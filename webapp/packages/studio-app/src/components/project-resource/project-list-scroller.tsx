import './project-list-scroller.css';
import ResizableHorizontalSplitBox from "../common/resizable-boxes/resizable-boxes-split";
import {useTypedSelector} from "../../hooks/use-typed-selector";
import {useMemo} from "react";

const ProjectListScroller = () => {
  const projectsState = useTypedSelector((state) => state.projects);;
  const projectList = useMemo(() => {
    return Object.entries(projectsState.data).map(([k,v]) => v).filter(item => item.confirmed)
  }, [projectsState.data]);

  const ContentBox = ({name, data:project}) => {
    return (
        <div className="content-box">
          <h2>{project.title}</h2>
          <p>{project.description}</p>
        </div>
    );
  };
  const RemainingBox = ({title, data}) => {
    return (
        <div className="remaining-box" >
          <h1>From Body of {title}</h1>
          <h2>From Body of {title}</h2>
        </div>
    );
  };
  return (
      <div className="project-scroll-list">
        {projectList.map((project, index) => {
          return (
              <ResizableHorizontalSplitBox
                  contentComponent={ContentBox}
                  remainingComponent={RemainingBox}
                  defaultHeight={200}
                  heightConstraints={{min:50, max:400}}
                  data={project}
              />
          );
        })}

      </div>
  )
}

export default ProjectListScroller;