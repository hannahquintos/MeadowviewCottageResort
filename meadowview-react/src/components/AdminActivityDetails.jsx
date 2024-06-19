import React from 'react';
import {useState, useEffect} from "react";
import { useParams } from 'react-router-dom';
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import LocationOnIcon from '@mui/icons-material/LocationOn';

import ActivityDeleteModal from "./modals/ActivityDeleteModal";

export default function singleActivity() {

  const navigate = useNavigate();

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const deleteActivity = async () => {
    try {
      const res = await axios.get(`https://meadowview-cottage-resort.vercel.app/api/activities/delete/${params.id}`);
      handleClose();

      if (res.status === 200) {
        // alert("Activity successfully deleted");
        navigate("/admin/activities");
        } else {
        alert("Something went wrong");
        }
        
    } catch (e) {
      alert("Error");
		  console.log(e);
    }
  };

  const [activity, setActivity] = useState([]);

  const params = useParams();

  useEffect(() => {
    const getSingleActivity = async () => {
      let response = await fetch(`https://meadowview-cottage-resort.vercel.app/api/activities/${params.id}`);
      let data = await response.json();
      setActivity(data);
    }
    // console.log("params:" + params.id);
    
    getSingleActivity(params.id);
  }, []);

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
      <ActivityDeleteModal open={open} handleClose={handleClose} deleteActivity={deleteActivity}/>
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
              <div className="actionBtns">
                  <div className="btn edit"><Link to={`/admin/activities/${activity._id}/edit`}>Edit</Link></div>
                  <div className="btn delete" onClick={handleClickOpen}>Delete</div>
              </div>
          </div>
        </div>
    </div>
  );
}