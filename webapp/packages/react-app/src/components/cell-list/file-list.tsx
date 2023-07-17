import './file-list.css';
import {Fragment, useEffect, useMemo} from "react";
import AddFile from "./add-cell/add-file";
import CellListItem from "./cell-list-item/cell-list-item";
import { useActions } from '../../hooks/use-actions';
import {syncCellsToServer} from '../../config/global';
import {ReduxFile, ReduxProject} from "../../state";


interface FileListProps {
  project: ReduxProject;
  files: ReduxFile[];
};


const FileList:React.FC<FileListProps> = ({project, files}) => {
  const { fetchCells } = useActions();

  useEffect(() => {
    if (syncCellsToServer) {
      fetchCells();
    }
  // eslint-disable-next-line
  }, []);

  // const cells = useTypedSelector(({cells: {order, data}}) => {
  //   return order.map((id) => data[id])
  // });

  const renderedItems = useMemo(() => {
    if (files.length > 0) {
      return files.map(item => (
          <Fragment key={item.localId}>
            <CellListItem item={item} />
            <AddFile project={project} forceVisible={false}/>
          </Fragment>
      ));
    }
    return [];
  }, [files]);

  return (
    <div className="cell-list">
      <AddFile project={project} forceVisible={files.length === 0}/>
      <div>{renderedItems}</div>
    </div>
  
  );
}

export default FileList;