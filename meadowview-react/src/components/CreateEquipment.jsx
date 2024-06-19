import React, { useState } from 'react';
import axios from "axios";
import { useNavigate } from 'react-router-dom';

export default function CreateEquipment() {

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
		const res = await axios.post("https://meadowview-cottage-resort.vercel.app/api/equipment/create", formData);

		if (res.status === 200) {
		// alert("Equipment successfully created");
		navigate("/admin/equipment");
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
				<h1 className="adminHeading">Add New Equipment</h1>
			</div>
			<div className="divider"></div>
			<form onSubmit={handleSubmit}>
				<div>
					<div>
						<label htmlFor="equipmentName">Equipment Name</label>
					</div>
					<div>
						<input required id="equipmentName" type="text" name="equipmentName" value={formData.equipmentName} onChange={handleChange}/>
					</div>
				</div>
				<div>
					<div>
						<label htmlFor="condition">Condition</label>
					</div>
					<div>
						<select required name="condition" value={formData.condition} onChange={handleChange}>
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
						<select required name="availability" value={formData.availability} onChange={handleChange}>
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
						<input required id="image" type="text" name="image" value={formData.image} onChange={handleChange}/>
					</div>
				</div>
				<div>
					<div>
						<label htmlFor="description">Description</label>
					</div>
					<div>
						<textarea required id="description" name="description" value={formData.description} onChange={handleChange}/>
					</div>
				</div>
				<div>
					<button className="btn form" type="submit">Submit</button>
				</div>
			</form>
		</div>
	</div>
	);
};