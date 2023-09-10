export const defaultCode = `\
const a = 1;
console.log(a);
`;

export const defaultReactCode = `\
import React from 'react';
console.log(React);
`;

export const defaultPackageTestCode = `\
import pkg from 'nested-test-pkg';
console.log(pkg);
`;

export const defaultCssCode = `\
import 'bulma/css/bulma.css';
`

export const defaultJsCssCode = `\
import pkg from 'tiny-test-pkg';
import 'bulma/css/bulma.css';
`
export const defaultReactComponentCode = `\
import React from 'react';
import ReactDOM from 'react-dom';

const App = () => <h1>Hi there!</h1>

ReactDOM.render(
  <App/>,
  document.querySelector('#root')
);
`

export const defaultReactNewCode = `\
import React from 'react';
import { createRoot } from 'react-dom/client';
const rootElement = document.getElementById('root');

const root = createRoot(rootElement);
const App = () => <h1>Hello and all</h1>;
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
`

export const defaultReactTwoComponentCode = `\
import React from 'react';
import { createRoot } from 'react-dom/client';

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

const App = () => <h2>My React App</h2>;
root.render(
  <>
    <h1>Hello</h1>
    <App />
  </>
);
`

export const defaultRootElementCode = `\
document.querySelector('#root').innerHTML = "Gekko"
`
export const defaultErrorCode = `\
console.base();
`

export const defaultAsyncErrorCode = `\
setTimeout(() => {
    console.base();
});
`