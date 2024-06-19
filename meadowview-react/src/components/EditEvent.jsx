import {useState, useEffect} from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { Link } from "react-router-dom";

export default function EditEvent() {

    const [event, setEvent] = useState([]);

    const params = useParams();
  
    useEffect(() => {
      const getSingleEvent = async () => {
        let response = await fetch(`http://localhost:3000/api/events/${params.id}`);
        let data = await response.json();
        setEvent(data);
        setFormData(data);
      }
      // console.log("params:" + params.id);
      
      getSingleEvent(params.id);
    }, []);

	const navigate = useNavigate();

	const [formData, setFormData] = useState({
		eventName: '',
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
		const res = await axios.post(`http://localhost:3000/api/events/update/${params.id}`, formData);

		if (res.status === 200) {
		// alert("Event successfully updated");
		navigate(`/admin/events/${event._id}`);
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
				<h1 className="adminHeading">Edit Event</h1>
			</div>
            <div className="divider"></div>
			<form onSubmit={handleSubmit}>
				<div>
					<div>
						<label htmlFor="eventName">Event Name</label>
					</div>
					<div>
						<input required id="eventName" type="text" name="eventName" value={formData.eventName} onChange={handleChange}/>
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
				<div className="actionBtns">
                    <div className="btn cancel"><Link to={`/admin/events/${event._id}`}>Cancel</Link></div>
                    <button className="btn form" type="submit">Save</button>
				</div>
			</form>
		</div>
	</div>
	);
};