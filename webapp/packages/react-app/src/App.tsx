import ProjectCell from "./components/project-cell/project-cell";
import CellList from "./components/cell-list/cell-list";
import {ProjectResource} from "./components/project-resource/project-resource";
import {useEffect} from "react";
import {useActions} from "./hooks/use-actions";

const App = () => {
  const { fetchProjects, fetchFiles } = useActions();

  // console.log('ProjectCell: rendered', JSON.stringify(projectsState, null, 2));

  useEffect(() => {
    fetchProjects();
    fetchFiles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  return (
    <div style={{display:"flex", flexDirection:"column", alignItems: "center"}}>
      <ProjectResource />
      <ProjectCell />
      <div style={{
          // border: "solid 2px white", 
          width: "100%", marginTop: "10px"
        }}
      >
        <CellList />
      </div>
    </div>
  );
}

export default App;