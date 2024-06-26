import React, { useState, useEffect } from 'react';
import axios from "axios";
import { useNavigate } from 'react-router-dom';

export default function CreateActivity() {

	const navigate = useNavigate();

	const [formData, setFormData] = useState({
		activityName: '',
		startTime: '',
		endTime: '',
		location: '',
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
		const res = await axios.post("https://meadowview-cottage-resort-api.vercel.app/api/activities/create", formData);

		if (res.status === 200) {
		// alert("Activity successfully created");
		navigate("/admin/activities");
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
				<h1 className="adminHeading">Add New Activity</h1>
			</div>
			<div className="divider"></div>
			<form onSubmit={handleSubmit}>
				<div>
					<div>
						<label htmlFor="activityName">Activity Name</label>
					</div>
					<div>
						<input required id="activityName" type="text" name="activityName" value={formData.activityName} onChange={handleChange}/>
					</div>
				</div>
				<div>
					<div>
						<label htmlFor="startTime">Start Time</label>
					</div>
					<div>
						<input required id="startTime" type="datetime-local" name="startTime" value={formData.startTime} onChange={handleChange}/>
					</div>
				</div>
				<div>
					<div>
						<label htmlFor="endTime">End Time</label>
					</div>
					<div>
						<input required id="endTime" type="datetime-local" name="endTime" value={formData.endTime} onChange={handleChange}/>
					</div>
				</div>
				<div>
					<div>
						<label htmlFor="location">Location</label>
					</div>
					<div>
						<input required id="location" type="text" name="location" value={formData.location} onChange={handleChange}/>
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