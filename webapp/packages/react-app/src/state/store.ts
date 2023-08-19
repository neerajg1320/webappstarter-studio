import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from '@redux-devtools/extension';

import thunk from 'redux-thunk';
import reducers from './reducers';
import { reduxManualTest } from '../config/global';
import { persistMiddleware } from './middlewares/persist-middleware';
import {ActionType} from "./action-types";

const composeEnhancers = composeWithDevTools({
  // Specify name here, actionsDenylist, actionsCreators and other options if needed
});

export const store = createStore(
  reducers,
  {},
  composeEnhancers(
      applyMiddleware(persistMiddleware, thunk)
  ),
);

export const populateStoreManual = () => {
  populateStoreManualOne();
  // populateStoreManualThree();
}

export const populateStoreManualOne = () => {
  // The import syntax doesn't work inside block
  // const {ActionType} = require("./action-types");

  console.log(store.getState());

  // Manually dispatch actions

  store.dispatch({
    type: ActionType.INSERT_CELL_AFTER,
    payload: {
      id: null,
      type: 'code',
      content: "console.log('Make this cool');"
    }
  });

  console.log(store.getState());
}

export const populateStoreManualThree = () => {
  // The import syntax doesn't work inside block
  // const {ActionType} = require("./action-types");

  console.log(store.getState());

  // Manually dispatch actions

  store.dispatch({
      type: ActionType.INSERT_CELL_AFTER,
      payload: {
          id: null,
          type: 'code',
          content: "print('hello');"
      }
  });

  console.log(store.getState());

  store.dispatch({
      type: ActionType.INSERT_CELL_AFTER,
      payload: {
          id: null,
          type: 'code',
          content: "const print = (val) => console.log(val);"
      }
  });

  console.log(store.getState());

  // Insert after first cell
  const firstCellId = store.getState().cells.order[0]
  store.dispatch({
      type: ActionType.INSERT_CELL_AFTER,
      payload: {
          id: firstCellId,
          type: 'text',
      }
  });

  console.log(store.getState());
}

if (reduxManualTest) {
  populateStoreManual();
}
