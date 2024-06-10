import React, { useState } from 'react';
import axios from "axios";
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
		email: '',
		password: ''
	  });

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({
			...formData,
			[name]: value
		});
	};

    async function handleSubmit(e){
        e.preventDefault();

        try{
            const res = await axios.post("http://localhost:3000/api/login", formData);

            if (res.data === "exist") {
              // If the email exists in the system, redirect to the activities page
              navigate("/activities");
            } else if (res.data === "notexist") {
              // If the email does not exist, show alert
              alert("Incorrect email or password");
            }
        }
        catch(e){
            console.log(e);
            alert("Invalid email or password");
        }
    }


    return(
      <div>
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
            <div>
                <div>
                    <label htmlFor="email">Email</label>
                </div>
                <div>
                    <input type="email" name="email" id="email" value={formData.email} onChange={handleChange}/> 
                </div>
            </div>
            <div>
                <div>
                    <label htmlFor="password">Password</label>
                </div>
                <div>
                    <input type="password" name="password" id="password" value={formData.password} onChange={handleChange}/> 
                </div>
            </div>
            <div>
				<button type="submit">Login</button>
			</div>
        </form>

        <p>Not a user yet? <Link to="/signup">Sign Up</Link></p>

      </div>
    );
  }