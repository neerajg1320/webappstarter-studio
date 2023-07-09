export const defaultJSCode = `\
const a = 2 + 3;
console.log(a);
`

export const defaultCssCode = `\
import 'bulma/css/bulma.css';
`

export const defaultReactCode = `\
import ReactDOM from 'react-dom';
import React from 'react';

const App = () => <h1>hello</h1>;

const root = ReactDOM.createRoot(
  document.getElementById('root')
);

root.render(<App />);
`

export const defaultReactComponentCode = `\
const App = () => {
  return <div>
    <h1>Hello</h1>
    <button onClick={() => console.log('Click')}>Click Me</button>
  </div>;
}
`

export const defaultErrorCode = `\
console.abcdef();
`

export const defaultAsyncErrorCode = `\
setTimeout(() => {
  console.abcd();
}, 1000);
`