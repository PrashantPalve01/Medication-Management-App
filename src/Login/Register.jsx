
import {useState}from 'react'

function Register() {
        const [email,setEmail]= useState("");
        const [password,setPassword]=useState("")
        const [fname,setFname]=useState("")
        const [lname,setLname]=useState("")
  return (
    <>
        <>
        <div className='main-div'>
            <div className='login-form'>
                <h1><center>Sign Up</center></h1>
                <form action="">
                    <div className='mb-3'>
                        <label >First Name</label>
                        <input 
                            type="text"
                            className='form-control'
                            placeholder='First Name'
                            value={password}
                            onChange={(e)=>setFname(e.target.value)}
                        />
                    </div>
                    <div className='mb-3'>
                        <label >Last Name</label>
                        <input 
                            type="text"
                            className='form-control'
                            placeholder='Last Name'
                            value={password}
                            onChange={(e)=>setLname(e.target.value)}
                        />
                    </div>
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
                    
                </form>
            </div>
        </div>
    </>
    </>
  )
}

export default Register