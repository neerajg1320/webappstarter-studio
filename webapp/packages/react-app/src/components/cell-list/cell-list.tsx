import './cell-list.css';
import {Fragment, useEffect, useMemo} from "react";
import AddCell from "./add-cell/add-cell";
import CellListItem from "./cell-list-item/cell-list-item";
import { useActions } from '../../hooks/use-actions';
import {syncCellsToServer} from '../../config/global';
import {CellItem} from "../../state";


interface CellListProps {
  items: (CellItem)[]
};


const CellList:React.FC<CellListProps> = ({items}) => {
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
    if (items.length > 0) {
      return items.map(item => (
          <Fragment key={item.localId}>
            <CellListItem item={item} />
            <AddCell prevCellId={item.localId} forceVisible={false}/>
          </Fragment>
      ));
    }
    return [];
  }, [items]);

  return (
    <div className="cell-list">
      <AddCell prevCellId={null} forceVisible={items.length === 0}/>
      <div>{renderedItems}</div>
    </div>
  
  );
}

export default CellList;