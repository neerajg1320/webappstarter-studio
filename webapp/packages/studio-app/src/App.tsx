import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <h1 className="text-xl font-bold text-red-500">
        Hello Tailwind how are you doing with React
      </h1>
    </>
  )
}

export default App
