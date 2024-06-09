import React, { useState } from 'react';
import axios from "axios";
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {

    const history = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    async function submit(e){
        e.preventDefault();

        try{
            await axios.post("http://localhost:3000/api/login",{
                email, password
            })
            .then(res=>{
                if(res.data=="exist"){
                    //if email exists in the system, redirect to activities page
                    history("/activities");
                } else if(res.data="notexist"){
                    //if email does not exist, show alert
                    alert("Incorrect email or password");
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
        <h1>Login</h1>
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
				<button type="submit" onClick={submit}>Login</button>
			</div>
        </form>

        <p>Not a user yet? <Link to="/signup">Sign Up</Link></p>

      </div>
    );
  }