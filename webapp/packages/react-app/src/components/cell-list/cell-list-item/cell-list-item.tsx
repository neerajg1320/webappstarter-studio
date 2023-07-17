import FileCell from "../../file-cell/file-cell";
import ActionBar from './action-bar';
import './cell-list-item.css';
import {CellItem, isReduxFile, isReduxProject} from "../../../state";
import {JSX} from "react";


interface CellListItemProps {
  item: CellItem;
}

const CellListItem:React.FC<CellListItemProps> = ({item}) => {
  return (
    <div className="cell-list-item">
      <div className="action-bar-wrapper">
        {/*<ActionBar id={item.localId}/>*/}
        <div>
          {/*<pre>{JSON.stringify(item, null, 2)}</pre>*/}
          {/*{isReduxFile(item) && <FileCell reduxFile={item} />}*/}
          {isReduxFile(item) ? <h1>ReduxFile: {item.localId}</h1> : <h2>ReduxType:{item.reduxType}</h2>}
        </div>
      </div>
    </div>
  );
}

export default CellListItem;