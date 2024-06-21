import {useState, useEffect} from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { Link } from "react-router-dom";

export default function EditEvent() {

    const [event, setEvent] = useState([]);
    const [staff, setStaff] = useState([]);
    const [eventStaff, setEventStaff] = useState([]);
    const [availableStaff, setAvailableStaff] = useState([]);

	const navigate = useNavigate();
    const params = useParams();
  
    useEffect(() => {
      const getSingleEvent = async () => {
        let response = await fetch(`https://meadowview-cottage-resort-api.vercel.app/api/events/${params.id}`);
        let data = await response.json();
        setEvent(data);
        setFormData(data);
      }
      // console.log("params:" + params.id);
      
      getSingleEvent(params.id);
    }, []);

    useEffect(() => {
        const getAllStaff = async () => {
          let response = await fetch("https://meadowview-cottage-resort-api.vercel.app/api/staff");
          let data = await response.json();
          setStaff(data);
        }
        getAllStaff();
      }, []);

    useEffect(() => {
    const getEventStaff = async () => {
        let response = await fetch(`https://meadowview-cottage-resort-api.vercel.app/api/eventStaff/${params.id}`);
        let data = await response.json();
        setEventStaff(data);
    }
    // console.log("params:" + params.id);
    
    getEventStaff(params.id);
    }, []);

    useEffect(() => {
        const staffId = eventStaff.map((user) => user.userId);
        const availableStaff = staff.filter((staff) => !staffId.includes(staff._id));
        setAvailableStaff(availableStaff);
    }, [staff, eventStaff]);
    

	const [formData, setFormData] = useState({
		eventId: event._id,
		userId: ''
	  });

    //need to wait until event object is retrieved before setting eventId in formData
    useEffect(() => {
        if (event && event._id) {
            setFormData((prevData) => ({ ...prevData, eventId: event._id }));
        }
    }, [event]);

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
		const res = await axios.post("https://meadowview-cottage-resort-api.vercel.app/api/eventStaff/create", formData);

		if (res.status === 200) {
		// alert("Event staff successfully updated");
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
				<h1 className="adminHeading">Assign Staff Member to {event.eventName}</h1>
			</div>
            <div className="divider"></div>
			<form onSubmit={handleSubmit}>
                <div>
					<div>
						<label htmlFor="userId">Staff Member</label>
					</div>
					<div>
						<select required name="userId" value={formData.userId} onChange={handleChange}>
							<option value="">Select a staff member</option>
                            {availableStaff.map((user) => (
                                <option value={user._id}>{user.firstName} {user.lastName}</option>
                            ))}
						</select>
					</div>
				</div>
				<div className="actionBtns">
                    <div className="btn cancel"><Link to={`/admin/events/${event._id}`}>Cancel</Link></div>
                    <button className="btn form" type="submit">Assign</button>
				</div>
			</form>
		</div>
	</div>
	);
};