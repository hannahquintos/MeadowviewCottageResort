import {useState, useEffect} from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { Link } from "react-router-dom";

export default function EditEquipment() {

    const [equipment, setEquipment] = useState([]);

    const params = useParams();
  
    useEffect(() => {
      const getSingleEquipment = async () => {
        let response = await fetch(`http://localhost:3000/api/equipment/${params.id}`);
        let data = await response.json();
        setEquipment(data);
        setFormData(data);
      }
      // console.log("params:" + params.id);
      
      getSingleEquipment(params.id);
    }, []);

	const navigate = useNavigate();

	const [formData, setFormData] = useState({
		equipmentName: '',
		condition: '',
		availability: '',
		image: '',
		description: ''
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
		const res = await axios.post(`http://localhost:3000/api/equipment/update/${params.id}`, formData);

		if (res.status === 200) {
		alert("Equipment successfully updated");
		navigate(`/admin/equipment/${equipment._id}`);
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
				<h1 className="adminHeading">Edit Equipment</h1>
			</div>
            <div className="divider"></div>
			<form onSubmit={handleSubmit}>
			<div>
					<div>
						<label htmlFor="equipmentName">Equipment Name</label>
					</div>
					<div>
						<input id="equipmentName" type="text" name="equipmentName" value={formData.equipmentName} onChange={handleChange}/>
					</div>
				</div>
				<div>
					<div>
						<label htmlFor="condition">Condition</label>
					</div>
					<div>
						<select name="condition" value={formData.condition} onChange={handleChange}>
							<option value="">Select a condition</option>
							<option value="Excellent">Excellent</option>
							<option value="Good">Good</option>
							<option value="Poor">Poor</option>							
						</select>
					</div>
				</div>
				<div>
					<div>
						<label htmlFor="availability">Availability</label>
					</div>
					<div>
						<select name="availability" value={formData.availability} onChange={handleChange}>
							<option value="">Select availability</option>
							<option value="Available">Available</option>
							<option value="Unavailable">Unavailable</option>
						</select>
					</div>
				</div>
				<div>
					<div>
						<label htmlFor="image">Image</label>
					</div>
					<div>
						<input id="image" type="text" name="image" value={formData.image} onChange={handleChange}/>
					</div>
				</div>
				<div>
					<div>
						<label htmlFor="description">Description</label>
					</div>
					<div>
						<textarea id="description" name="description" value={formData.description} onChange={handleChange}/>
					</div>
				</div>
				<div className="actionBtns">
                    <div className="btn cancel"><Link to={`/admin/equipment/${equipment._id}`}>Cancel</Link></div>
                    <button className="btn form" type="submit">Save</button>
				</div>
			</form>
		</div>
	</div>
	);
};