import React, { useState } from 'react';
import axios from "axios";
import { useNavigate, Link } from 'react-router-dom';

export default function CreateUser() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
		email: '',
		password: '',
        firstName: '',
        lastName: '',
        phone: '',
        role: ''
	  });
    
    const [errorMessage, setErrorMessage] = useState('');

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
            const res = await axios.post("http://localhost:3000/api/signup", formData);

            if (res.data === "exist") {
              //if email already exists in the system, show alert
              //lert("An account with this email already exists");
              setErrorMessage("An account with this email already exists");
            } else if (res.data === "notexist") {
              //if email is does not exist, redirect to home page
              navigate("/admin/users");
            }
        }
        catch(e){
            console.log(e);
            alert("Invalid email");
        }
    }


    return(
    <div className="border">
		<div className="content">
			<div>
				<h1 className="adminHeading">Create User Account</h1>
			</div>
			<div className="divider"></div>
            {errorMessage && (
            <p className="errorMessage"> *{errorMessage} </p>
            )}
			<form onSubmit={handleSubmit}>
            <div>
                <div>
                    <label htmlFor="firstName">First Name</label>
                </div>
                <div>
                    <input required type="text" name="firstName" id="firstName" value={formData.firstName} onChange={handleChange}/> 
                </div>
            </div>
            <div>
                <div>
                    <label htmlFor="lastName">Last Name</label>
                </div>
                <div>
                    <input required type="text" name="lastName" id="lastName" value={formData.lastName} onChange={handleChange}/> 
                </div>
            </div>
            <div>
                <div>
                    <label htmlFor="email">Email</label>
                </div>
                <div>
                    <input required type="email" name="email" id="email" value={formData.email} onChange={handleChange}/> 
                </div>
            </div>
            <div>
                <div>
                    <label htmlFor="phone">Phone Number</label>
                </div>
                <div>
                    <input required type="text" name="phone" id="phone" value={formData.phone} onChange={handleChange}/> 
                </div>
            </div>
            <div>
                <div>
                    <label htmlFor="role">Role</label>
                </div>
                <div>
                    <select required name="role" value={formData.role} onChange={handleChange}>
                        <option value="">Select a role</option>
                        <option value="Guest">Guest</option>
                        <option value="Admin">Admin</option>
                    </select>
                </div>
			</div>
            <div>
                <div>
                    <label htmlFor="password">Password</label>
                </div>
                <div>
                    <input required type="password" name="password" id="password" value={formData.password} onChange={handleChange}/> 
                </div>
            </div>
            <div>
				<button className="btn form" type="submit">Submit</button>
			</div>
        </form>
		</div>
	</div>
    );
  }