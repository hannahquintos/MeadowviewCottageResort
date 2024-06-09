import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CreateActivity() {
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

	  const navigate = useNavigate();

	  const handleSubmit = async (e) => {
		e.preventDefault();
		console.log('Form submitted'); // Debugging statement
	
		try {
		  console.log('Sending request...'); // Debugging statement
		  const response = await fetch('http://localhost:3000/api/activities/create', {
			method: 'POST',
			headers: {
			  'Content-Type': 'application/json'
			},
			body: JSON.stringify(formData)
		  });
		  console.log('Response received'); // Debugging statement
	
		  if (!response.ok) {
			throw new Error('Network response was not ok');
		  }
		  const result = await response.json();
		  console.log('Success:', result); // Debugging statement
		  navigate('/activities'); // Redirect to the activities list page
		} catch (error) {
		  console.error('Error:', error);
		}
	  };
	
	//   const handleSubmit = async (e) => {
	// 	e.preventDefault();
	// 	try {
	// 	  const response = await fetch('http://localhost:3000/api/activities/create', {
	// 		method: 'POST',
	// 		headers: {
	// 		  'Content-Type': 'application/json'
	// 		},
	// 		body: JSON.stringify(formData)
	// 	  });
	// 	  if (!response.ok) {
	// 		throw new Error('Network response was not ok');
	// 	  }
	// 	  const result = await response.json();
	// 	  console.log('Success:', result);
	// 	  navigate('/activities'); // Redirect to the activities list page
	// 	} catch (error) {
	// 	  console.error('Error:', error);
	// 	}
	//   };
	
	  return (
<div className="border">
			<div className="content">
				<div>
					<h1>Add New Activity</h1>
				</div>
				<form onSubmit={handleSubmit}>
					<div>
						<div>
							<label htmlFor="activityName">Activity Name</label>
						</div>
						<div>
							<input id="activityName" type="text" name="activityName" value={formData.activityName} onChange={handleChange}/>
						</div>
					</div>
					<div>
						<div>
							<label htmlFor="startTime">Start Time</label>
						</div>
						<div>
							<input id="startTime" type="datetime-local" name="startTime" value={formData.startTime} onChange={handleChange}/>
						</div>
					</div>
					<div>
						<div>
							<label htmlFor="endTime">End Time</label>
						</div>
						<div>
							<input id="endTime" type="datetime-local" name="endTime" value={formData.endTime} onChange={handleChange}/>
						</div>
					</div>
					<div>
						<div>
							<label htmlFor="location">Location</label>
						</div>
						<div>
							<input id="location" type="text" name="location" value={formData.location} onChange={handleChange}/>
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
					<div>
						<button type="submit">Submit</button>
					</div>
				</form>
			</div>
		</div>
	  );
	};