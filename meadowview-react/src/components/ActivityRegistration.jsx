import React, { useState, useEffect } from 'react';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { useParams } from 'react-router-dom';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';

export default function CreateRegistration() {

    const { auth } = useAuth();
    const navigate = useNavigate();

    const [activity, setActivity] = useState([]);

    const params = useParams();

    useEffect(() => {
        const getSingleActivity = async () => {
        let response = await fetch(`https://meadowview-cottage-resort-api.vercel.app/api/activities/${params.id}`);
        let data = await response.json();
        setActivity(data);
        }
    
        getSingleActivity(params.id);
    }, []);


    const [formData, setFormData] = useState([
        {ageGroup: '', firstName: '', lastName: ''}
    ]);

    const handleChange = (event, index) => {
        let data = [...formData];
        data[index][event.target.name] = event.target.value;
        setFormData(data);
	};

    const handleSubmit = async (e) => {
        e.preventDefault();

		try {
			const res = await axios.post("https://meadowview-cottage-resort-api.vercel.app/api/activityRegistrations/create", {activityId: activity._id, userId: auth.userId, participants: formData});

			if (res.status === 200) {
                // alert("Activity registration was successful");
                navigate("/activities/registrations");
			} else {
			    alert("Something went wrong");
			}
		} catch (e) {
			alert("Error");
			console.log(e);
		}
    }

    const addFields = () => {
        let object = {
            ageGroup: '',
            firstName: '',
            lastName: ''
        }
        setFormData([...formData, object])
    }

    const removeFields = (index) => {
        let data = [...formData];
        data.splice(index, 1);
        setFormData(data);
    }

	return (
	<div className="border">
		<div className="content">
			<div>
				<h1 className="adminHeading">Register for {activity.activityName}</h1>
			</div>
			<div className="divider"></div>
            <form onSubmit={handleSubmit}>
                {formData.map((form, index) => {
                    return (
                        <div key={index}>
                            <div>
                                <div>
                                    <label htmlFor="ageGroup">Age Group</label>
                                </div>
                                <div>
                                    <select id="ageGroup" name="ageGroup" value={form.ageGroup} onChange={event => handleChange(event, index)}>
                                        <option value="">Select an age group</option>
                                        <option value="Adult">Adult</option>
                                        <option value="Child">Child</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <div>
                                    <label htmlFor="firstName">First Name</label>
                                </div>
                                <div>
                                    <input id="firstName" type="text" name="firstName" value={form.firstName} onChange={event => handleChange(event, index)}/>
                                </div>
                            </div>
                            <div>
                                <div>
                                    <label htmlFor="lastName">Last Name</label>
                                </div>
                                <div>
                                    <input id="lastName" type="text" name="lastName" value={form.lastName} onChange={event => handleChange(event, index)}/>
                                </div>
                            </div>
                            <div className="participantAction remove">
                                <p>Remove Participant</p>
                                <RemoveCircleIcon className="iconColor" onClick={() => removeFields(index)}/>
                            </div>
                        </div>
                    )
                })}
            </form>
            <div className="participantAction">
                <p>Add Participant</p>
                <AddCircleIcon className="iconColor" onClick={addFields}/>
            </div>
            <div>
                <button className="btn form" onClick={handleSubmit}>Register</button>
            </div>
		</div>
	</div>
	);
};