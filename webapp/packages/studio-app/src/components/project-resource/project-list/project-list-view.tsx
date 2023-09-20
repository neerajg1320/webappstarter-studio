import {useState} from "react";
import ProjectListScroller from "./project-list-scroller";
import ProjectListGrid from "./project-list-grid";
import './project-list-view.css';

const ProjectListView = () => {
  const [isPreviewLayout, setPreviewLayout] = useState<boolean>(false);

  return (
      <div className="project-list-view">
        <div className="project-list-view-control-bar">
          <div className="project-list-view-control-bar-setting">
            <label>Preview Mode</label>
            <input type="checkbox" checked={isPreviewLayout} onChange={(e) => setPreviewLayout(e.target.checked)}/>
          </div>
        </div>
        <div className="project-list-view-panel">
          <ProjectListScroller visibility={isPreviewLayout}/>
          <ProjectListGrid  visibility={!isPreviewLayout}/>
        </div>
      </div>
  )

}

export default ProjectListView;