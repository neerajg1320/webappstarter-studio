import { useTypedSelector } from "./use-typed-selector";

export const useCumulativeCode = (cellId: string) => {

  return useTypedSelector((state) => {
    const {data, order} = state.cells;
    const orderedCells = order.map(id => data[id]);

    // We need to ensure that we define jsxFactory and jsxFragment in esbuild settings
    // We use var show as we redeclare it. let and const don't allow redeclaration.
    const showFuncCode = `
    import _React from "react";
    import { createRoot as _createRoot } from "react-dom/client";

    var show = (value) => {
      const rootElement = document.getElementById("root");

      if (typeof(value) === 'object') {
        // Check for finding a React element
        if (value.$$typeof && value.props) {
          const root = _createRoot(rootElement);
          root.render(value);
        } else {
          rootElement.innerHTML = JSON.stringify(value);
        }
      } else {
        rootElement.innerHTML = value;
      }
    };
    `;

    const showFuncNoopCode = `
      var show = (value) => {};
    `

    const cumCode = [];

    // Pick all the code cells till we reach the current cell inclusive
    for (let c of orderedCells) {
      if (c.type === 'code') {
        if (c.id === cellId) {
          cumCode.push(showFuncCode);
        } else {
          // This can be optimized.
          cumCode.push(showFuncNoopCode);
        }
        cumCode.push(c.content);
      }
      if (c.id === cellId) {
        break;
      }
    }
    return cumCode;
  }).join('\n');
}