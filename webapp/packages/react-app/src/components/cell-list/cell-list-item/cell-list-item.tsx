import { Cell } from "../../../state";
import FileCell from "../../file-cell/file-cell";
import TextEditor from "../../text-cell/text-editor";
import ActionBar from './action-bar';
import './cell-list-item.css';

interface CellListItemProps {
  cell: Cell;
}

const CellListItem:React.FC<CellListItemProps> = ({cell}) => {
  let child: JSX.Element;

  if (cell.type === 'code') {
    child = <>
      <div className="action-bar-wrapper">
        <ActionBar id={cell.id}/>
      </div>
      <FileCell cell={cell} />
    </>
  } else {
    child = <>
      <TextEditor cell={cell} />
      <ActionBar id={cell.id}/>
    </>
  }

  return (
    <div className="cell-list-item">
      {child}
    </div>
  );
}

export default CellListItem;