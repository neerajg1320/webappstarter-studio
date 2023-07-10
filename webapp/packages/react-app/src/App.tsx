import CellList from "./components/cell-list/cell-list";

const App = () => {
  return (
    <div style={{display:"flex", flexDirection:"column", alignItems: "center"}}>
      <div style={{
          margin: "20px", 
          display: "flex", width: "20%", justifyContent:"space-around"
        }}
      >
        <label>Project</label>
        <input type="text"/>
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