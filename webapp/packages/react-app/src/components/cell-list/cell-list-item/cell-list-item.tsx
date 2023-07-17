import FileCell from "../../file-cell/file-cell";
import ActionBar from './action-bar';
import './cell-list-item.css';
import {CellItem, isReduxFile, isReduxProject} from "../../../state";
import {JSX} from "react";


interface CellListItemProps {
  item: CellItem;
}

const CellListItem:React.FC<CellListItemProps> = ({item}) => {
  let cell: JSX.Element;
  if (isReduxFile(item)) {
    cell = <FileCell reduxFile={item} />;
  } else if (isReduxProject(item)) {
    cell = <span>Project Cell rendered from CellListItem</span>
  } else {
    cell = <span>Invalid item of type:{item}</span>
  }

  const child = <>
    <div className="action-bar-wrapper">
      <ActionBar id={item.localId}/>
    </div>
    {
      cell
    }
  </>

  return (
    <div className="cell-list-item">
      {child}
    </div>
  );
}

export default CellListItem;