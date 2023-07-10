import CellList from "./components/cell-list/cell-list";
import { useActions } from "./hooks/use-actions";
import { useTypedSelector } from "./hooks/use-typed-selector";

const App = () => {
  const {setCurrentProject} = useActions();
  // const projectsState = useTypedSelector((state) => state.projects);

  const handleInputChange = (value:string) => {
    setCurrentProject(value, "reactjs");
    // console.log(projectsState);
  };

  return (
    <div style={{display:"flex", flexDirection:"column", alignItems: "center"}}>
      <div style={{
          margin: "20px", 
          display: "flex", width: "20%", justifyContent:"space-around"
        }}
      >
        <label>Project</label>
        <input type="text" onChange={(e) => {handleInputChange(e.target.value)}} />
      </div>
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