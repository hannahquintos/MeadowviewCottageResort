import React, { useState, useContext } from 'react';
import axios from "axios";
import { useNavigate, Link, useLocation } from 'react-router-dom';
import AuthContext from '../context/AuthProvider';

export default function Login() {

    const { setAuth } = useContext(AuthContext);

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    const [formData, setFormData] = useState({
		email: '',
		password: ''
	  });

    const [errorMessage, setErrorMessage] = useState('');

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({
			...formData,
			[name]: value
		});
	};

  axios.defaults.withCredentials = true;

  async function handleSubmit(e){
      e.preventDefault();

      try{
          const res = await axios.post("https://meadowview-cottage-resort-api.vercel.app/api/login", formData);

          if (res.data.status === "Success") {
            setAuth({ email: formData.email, token: res.data.token, role: res.data.role, userId: res.data.userId});
            navigate(from, { replace: true });
            // navigate("/activities");
          } else {
              // alert("Incorrect email or password");
              setErrorMessage("Incorrect email or password");
          }
      }
      catch(e){
          console.log(e);
          // alert("Incorrect email or password");
          setErrorMessage("Incorrect email or password");
      }
  }


    return(
      <div className='formContainer'>
        <h1>Login</h1>
        {errorMessage && (
          <p className="errorMessage"> *{errorMessage} </p>
        )}
        <form onSubmit={handleSubmit}>
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
                    <label htmlFor="password">Password</label>
                </div>
                <div>
                    <input required type="password" name="password" id="password" value={formData.password} onChange={handleChange}/> 
                </div>
            </div>
            <div>
				<button className="btn form" type="submit">Login</button>
			</div>
        </form>

        <p>Not a user yet? <Link to="/signup">Sign Up</Link></p>

      </div>
    );
  }