import {useState}from 'react'
import { Link } from 'react-router-dom';
import "./loginpage.css"
function Login() {
    const [email,setEmail]= useState("");
    const [password,setPassword]=useState("")
  return (
    <>
        <div className='main-div'>
            <div className='login-form'>
                <h1><center>Login</center></h1>
                <form action="">
                    <div className='mb-3'>
                        <label >Email Address</label>
                        <input 
                            type="email"
                            className='form-control'
                            placeholder='Enter email'
                            value={email}
                            onChange={(e)=>setEmail(e.target.value)}
                        />
                    </div>
                    <div className='mb-3'>
                        <label >Password</label>
                        <input 
                            type="password"
                            className='form-control'
                            placeholder='Enter Password'
                            value={password}
                            onChange={(e)=>setPassword(e.target.value)}
                        />
                    </div>
                    <div className='d-grid'>
                        <button type='submit' className='btn btn-primary'>
                            Submit
                        </button>
                    </div>
                    <div className='signup'>
                        <p>Have not any account ? <button className='signup-btn'><Link to="./Register">Sign Up</Link></button></p>
                    </div>
                </form>
            </div>
        </div>
    </>
  )
}

export default Login