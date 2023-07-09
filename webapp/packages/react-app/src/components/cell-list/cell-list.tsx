import './cell-list.css';
import { Fragment, useEffect } from "react";
import { useTypedSelector } from "../../hooks/use-typed-selector";
import AddCell from "./add-cell/add-cell";
import CellListItem from "./cell-list-item/cell-list-item";
import { useActions } from '../../hooks/use-actions';
import { serverConnect } from '../../config/global';

const CellList:React.FC = () => {
  const { fetchCells } = useActions();

  useEffect(() => {
    if (serverConnect) {
      fetchCells();
    }
  // eslint-disable-next-line
  }, []);

  const cells = useTypedSelector(({cells: {order, data}}) => {
    return order.map((id) => data[id])
  });

  const renderedCells = cells.map(cell => (
    <Fragment key={cell.id}>
      <CellListItem cell={cell} />
      <AddCell prevCellId={cell.id} forceVisible={false}/>
    </Fragment>
  ));
  
  return (
    <div className="cell-list">
      <AddCell prevCellId={null} forceVisible={cells.length === 0}/>
      <div>{renderedCells}</div>
    </div>
  
  );
}

export default CellList;