import CellList from "./components/cell-list/cell-list";
import { useActions } from "./hooks/use-actions";
import { useTypedSelector } from "./hooks/use-typed-selector";
import { createCellBundle } from "./state/action-creators";

const App = () => {
  const {setCurrentProject} = useActions();
  // const projectsState = useTypedSelector((state) => state.projects);

  const handleInputChange = (value:string) => {
    setCurrentProject(value, "reactjs");
    // console.log(projectsState);
  };

  const handleBundleClick = () => {
    const result = createCellBundle()
  }

  return (
    <div style={{display:"flex", flexDirection:"column", alignItems: "center"}}>
      <div style={{
          margin: "20px", 
          display: "flex", width: "20%", justifyContent:"space-around", gap: "40px"
        }}
      >
        <div style={{display: "flex", gap: "20px"}}>
        <label>Project</label>
        <input type="text" onChange={(e) => {handleInputChange(e.target.value)}} />
        </div>
        <div>
          <button className="button is-primary is-small">Bundle</button>
        </div>
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