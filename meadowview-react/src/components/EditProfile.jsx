import {useState, useEffect} from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { Link } from "react-router-dom";

export default function EditUser() {

    const [user, setUser] = useState([]);

    const params = useParams();
  
    useEffect(() => {
      const getSingleUser = async () => {
        let response = await fetch(`http://localhost:3000/api/users/${params.id}`);
        let data = await response.json();
        setUser(data);
        setFormData(data);
      }
      // console.log("params:" + params.id);
      
      getSingleUser(params.id);
    }, []);

	const navigate = useNavigate();

	const [formData, setFormData] = useState({
		firstName: '',
		lastName: '',
		email: '',
		phone: '',
		role: user.role
	  });

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({
			...formData,
			[name]: value
		});
	};

	const handleSubmit = async (e) => {
	e.preventDefault();

	try {
		const res = await axios.post(`http://localhost:3000/api/users/update/${params.id}`, formData);

		if (res.status === 200) {
		// alert("Profile successfully updated");
		navigate(`/profile/${user._id}`);
		} else {
		alert("Something went wrong");
		}
	} catch (e) {
		alert("Error");
		console.log(e);
	}
	};

	return (
	<div className="border">
		<div className="content">
			<div>
				<h1>Edit Profile</h1>
			</div>
            <div className="divider"></div>
			<form onSubmit={handleSubmit}>
				<div>
					<div>
						<label htmlFor="firstName">First Name</label>
					</div>
					<div>
						<input id="firstName" type="text" name="firstName" value={formData.firstName} onChange={handleChange}/>
					</div>
				</div>
				<div>
					<div>
						<label htmlFor="lastName">Last Name</label>
					</div>
					<div>
						<input id="lastName" type="text" name="lastName" value={formData.lastName} onChange={handleChange}/>
					</div>
				</div>
				<div>
					<div>
						<label htmlFor="email">Email</label>
					</div>
					<div>
						<input id="email" type="text" name="email" value={formData.email} onChange={handleChange}/>
					</div>
				</div>
				<div>
					<div>
						<label htmlFor="phone">Phone Number</label>
					</div>
					<div>
						<input id="phone" type="text" name="phone" value={formData.phone} onChange={handleChange}/>
					</div>
				</div>
				<div className="actionBtns">
                    <div className="btn cancel"><Link to={`/profile/${user._id}`}>Cancel</Link></div>
                    <button className="btn form" type="submit">Save</button>
				</div>
			</form>
		</div>
	</div>
	);
};