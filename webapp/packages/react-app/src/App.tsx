import Project from "./components/project/project";
import CellList from "./components/cell-list/cell-list";

const App = () => {
  return (
    <div style={{display:"flex", flexDirection:"column", alignItems: "center"}}>
      <Project />
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