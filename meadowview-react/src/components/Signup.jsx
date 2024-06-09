import React, { useState } from 'react';
import axios from "axios";
import { useNavigate, Link } from 'react-router-dom';

export default function Signup() {

    const history = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    async function submit(e){
        e.preventDefault();

        try{
            await axios.post("http://localhost:3000/api/signup",{
                email, password
            })
            .then(res=>{
                if(res.data=="exist"){
                    //if email already exists in the system, show alert
                    alert("An account with this email already exists")
                } else if(res.data=="notexist"){
                    //if email is does not exist, redirect to home page
                    history("/");
                }
            })
            .catch(e=>{
                alert("Invalid email or password");
                console.log(e);
            })
        }
        catch(e){
            console.log(e);
        }
    }


    return(
      <div>
        <h1>Sign Up</h1>
        <form action="POST">
            <div>
                <div>
                    <label htmlFor="email">Email</label>
                </div>
                <div>
                    <input type="email" onChange={(e)=>{setEmail(e.target.value)}} name="email" id="email" /> 
                </div>
            </div>
            <div>
                <div>
                    <label htmlFor="password">Password</label>
                </div>
                <div>
                    <input type="password" onChange={(e)=>{setPassword(e.target.value)}} name="password" id="password" /> 
                </div>
            </div>
            <div>
				<button type="submit" onClick={submit}>Sign Up</button>
			</div>
        </form>

        <p>Already a user? <Link to="/login">Login</Link></p>

      </div>
    );
  }