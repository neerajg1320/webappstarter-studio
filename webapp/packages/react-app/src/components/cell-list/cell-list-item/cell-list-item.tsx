import FileCell from "../../file-cell/file-cell";
import ActionBar from './action-bar';
import './cell-list-item.css';
import {CellItem, isReduxFile, isReduxProject, ReduxFile} from "../../../state";
import {JSX} from "react";


interface CellListItemProps {
  item: CellItem;
}

const CellListItem:React.FC<CellListItemProps> = ({item}) => {
  const file = item as ReduxFile;

  return (
    <div className="cell-list-item">
      <div className="action-bar-wrapper">
        <ActionBar id={item.localId}/>
      </div>
      <FileCell reduxFile={file} />
    </div>
  );
}

export default CellListItem;