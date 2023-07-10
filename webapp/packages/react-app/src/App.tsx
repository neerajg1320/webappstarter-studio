import CellList from "./components/cell-list/cell-list";
import { useActions } from "./hooks/use-actions";
import { useTypedSelector } from "./hooks/use-typed-selector";


const App = () => {
  const { createAndSetProject, updateProject, createProjectBundle} = useActions();
  const projectsState = useTypedSelector((state) => state.projects);

  const handleInputChange = (value:string) => {
    if (Object.keys(projectsState.data).length < 1) {
      createAndSetProject(value, "reactjs");
    } else {
      const project = Object.entries(projectsState.data)[0][1];
      updateProject(project.id, value, "reactjs");
    }
  };

  const handleBundleClick = () => {
    if (Object.keys(projectsState.data).length > 0) {
      const project = Object.entries(projectsState.data)[0][1];

      // TBD: The project starting file is assumed to be index.js, we will soon add a check
      createProjectBundle(project.id, `${project.name}/index.js`);
    }
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
          <button
            className="button is-primary is-small"
            onClick={handleBundleClick}
          >
              Bundle
          </button>
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