import ProjectCell from "./components/project-cell/project-cell";
import CellList from "./components/cell-list/cell-list";
import {ProjectResource} from "./components/project-resource/project-resource";
import {useEffect} from "react";
import {useActions} from "./hooks/use-actions";
import {useTypedSelector} from "./hooks/use-typed-selector";

const App = () => {
  const { fetchProjects, fetchFiles } = useActions();
  const projectState = useTypedSelector((state) => state.projects);
  // const filesState = useTypedSelector((state) => state.files);
  // console.log('ProjectCell: rendered', JSON.stringify(projectsState, null, 2));

  useEffect(() => {
    fetchProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Fetch files if projects are fetched
    if (Object.keys(projectState.data).length > 0) {
      fetchFiles();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectState]);

  return (
    <div style={{display:"flex", flexDirection:"column", alignItems: "center"}}>
      <ProjectResource />
      <ProjectCell />
      <div style={{width: "100%", marginTop: "10px"}}>
        <CellList />
      </div>
    </div>
  );
}

export default App;