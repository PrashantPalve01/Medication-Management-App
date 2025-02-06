import { Routes,Route } from 'react-router-dom'
import './App.css'
import Login from './Login/Login'
import Register from './Login/Register'
import {ToastContainer} from "react-toastify"

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
      </Routes>
      <ToastContainer/>
    </>
  )
}

export default App
