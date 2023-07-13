import ProjectCell from "./components/project-cell/project-cell";
import CellList from "./components/cell-list/cell-list";
import {ProjectResource} from "./components/project-resource/project-resource";

const App = () => {
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