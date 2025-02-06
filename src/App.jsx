import { Routes,Route } from 'react-router-dom'
import './App.css'
import Login from './Login/Login'
import Register from './Login/Register'

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
      </Routes>
    </>
  )
}

export default App
