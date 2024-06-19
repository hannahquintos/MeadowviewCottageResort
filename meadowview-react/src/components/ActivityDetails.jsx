import React from 'react';
import {useState, useEffect} from "react";
import { useParams } from 'react-router-dom';
import { Link } from "react-router-dom";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CheckIcon from '@mui/icons-material/Check';
import useAuth from '../hooks/useAuth';
import RegistrationDeleteModal from "./modals/RegistrationDeleteModal";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function SingleActivity() {

  const { auth } = useAuth();
  const [activity, setActivity] = useState([]);
  const [activityRegistrations, setActivityRegistrations] = useState([]);
  const [activityRegistration, setActivityRegistration] = useState([]);
  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    const getSingleActivity = async () => {
      let response = await fetch(`https://meadowview-cottage-resort.vercel.app/api/activities/${params.id}`);
      let data = await response.json();
      setActivity(data);
    }
    
    getSingleActivity(params.id);
  }, []);

  useEffect(() => {
    const getAllActivityRegistrations= async () => {
      let response = await fetch(`https://meadowview-cottage-resort.vercel.app/api/activityRegistrations/${auth.userId}`);
      let data = await response.json();
      setActivityRegistrations(data);
    }
    getAllActivityRegistrations();
  }, []);

  const isActivityRegistered = (activityId) => {
    return activityRegistrations.some(registration => registration.activityId === activityId);
  };

  const getSingleActivityRegistration = async (activityRegistrationId) => {
    const response = await fetch(`https://meadowview-cottage-resort.vercel.app/api/activityRegistrations/details/${activityRegistrationId}`);
    const data = await response.json();
    setActivityRegistration(data);
    // console.log("activity registration: ", data);
  };

  useEffect(() => {
    if (isActivityRegistered(activity._id)) {
      const activityRegistration = activityRegistrations.find(registration => registration.activityId === activity._id);
      if (activityRegistration) {
        getSingleActivityRegistration(activityRegistration._id);
      }
    }
  }, [activityRegistrations, activity]);

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const deleteRegistration = async (activityRegistrationId) => {
    try {
      const res = await axios.get(`https://meadowview-cottage-resort.vercel.app/api/activityRegistrations/delete/${activityRegistrationId}`);
      handleClose();

      if (res.status === 200) {
        // alert("Activity registration successfully deleted");
        navigate("/activities/registrations");
        } else {
        alert("Something went wrong");
        }
        
    } catch (e) {
      alert("Error");
		  console.log(e);
    }
  };

  const formatDate = (startTime, endTime) => {
    const date = { month: 'short', day: 'numeric' };
    const time = { hour: 'numeric', minute: 'numeric', hour12: true };

    const start= new Date(startTime);
    const end = new Date(endTime);

    const formattedDate = new Intl.DateTimeFormat('en-US', date).format(start);
    const formattedStartTime = new Intl.DateTimeFormat('en-US', time).format(start);
    const formattedEndTime = new Intl.DateTimeFormat('en-US', time).format(end);

    return `${formattedDate} | ${formattedStartTime} - ${formattedEndTime}`;
  };

  return (
    <div className="border">
        <div className="detailsContent">
            <div>
                <img className="detailsImg" src={activity.image} alt={activity.activityName} />
            </div>
            <div className="detailsInfo">
                {activity.startTime && activity.endTime && (
                  <p className="detailsDate">{formatDate(activity.startTime, activity.endTime)}</p>
                )}
                <h1>{activity.activityName}</h1>
                <div className="location">
                  <LocationOnIcon/>
                    <p>{activity.location}</p>
                </div>
                <p>{activity.description}</p>
                {isActivityRegistered(activity._id) ? (
                    <div className="registered">
                      <p>Registered</p>
                      <CheckIcon/>
                    </div>
                  ) : (
                    <div className="btn"><Link to={`/activities/${activity._id}/register`}>Register</Link></div>
                  )}
            </div>
        </div>
        {isActivityRegistered(activity._id) && (
            <div className="registrationContent">
                <div className="divider"></div>
                <h2 className="bookingHeading">Registration Details</h2>
                {activityRegistration.participants && (
                  <div>
                    {activityRegistration.participants.map((participant, index) => (
                      <div key={index} className="participant">
                        <p className="bold">{participant.firstName} {participant.lastName}</p>
                        <p>{participant.ageGroup}</p>
                      </div>
                    ))}
                  </div>
                    )}
                <RegistrationDeleteModal open={open} handleClose={handleClose} deleteRegistration={() => deleteRegistration(activityRegistration._id)}/>
                <div className="btn delete" onClick={handleClickOpen}>Delete</div>
            </div>
          )}
    </div>
  );
}