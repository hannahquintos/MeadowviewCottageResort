import React from 'react';
import {useState, useEffect} from "react";
import { Link } from "react-router-dom";
import Weather from "./Weather";
import useAuth from '../hooks/useAuth';
import LocationOnIcon from '@mui/icons-material/LocationOn';

export default function ActivityRegistrationsList() {

  const { auth } = useAuth();
  const [activities, setActivities] = useState([]);
  const [activityRegistrations, setActivityRegistrations] = useState([]);

  useEffect(() => {
    const getAllActivities = async () => {
      let response = await fetch("http://localhost:3000/api/activities", {
        method: 'GET',
        credentials: 'include' // include cookies in the request
      })
      let data = await response.json();
      setActivities(data);
    }
    getAllActivities();
  }, []);

  useEffect(() => {
    const getAllActivityRegistrations = async () => {
      let response = await fetch(`http://localhost:3000/api/activityRegistrations/${auth.userId}`);
      let data = await response.json();
      setActivityRegistrations(data);
    }
    getAllActivityRegistrations();
  }, []);

  const isActivityRegistered = (activityId) => {
    return activityRegistrations.some(registration => registration.activityId === activityId);
  };

  //filter activities to only display registered activities
  const registeredActivities = activities.filter(activity => isActivityRegistered(activity._id));

  return (
    <div className="contentContainer">
      <div className="pageTitle">
        <h1>My Registered Activities</h1>
        <div className="btn"><Link to="/activities">View All Activities</Link></div>
      </div>
        {
          registeredActivities.map((activity) => (
            <Link to={`/activities/${activity._id}`} key={activity._id}>
                <div className="card">
                    <img src={activity.image} alt={activity.activityName} />
                    <div className="cardText">
                        <p>{activity.startTime}</p>
                        <h2>{activity.activityName}</h2>
                        <div className="location">
                            <LocationOnIcon/>
                            <p>{activity.location}</p>
                        </div>
                    </div>
                </div>
            </Link>
          ))
        }
        <Weather />
    </div>
  );
}