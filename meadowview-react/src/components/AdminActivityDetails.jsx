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
      const res = await axios.get(`http://localhost:3000/api/activities/delete/${params.id}`);
      handleClose();

      if (res.status === 200) {
        alert("Activity successfully deleted");
        navigate("/activities");
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
      let response = await fetch(`http://localhost:3000/api/activities/${params.id}`);
      let data = await response.json();
      setActivity(data);
    }
    // console.log("params:" + params.id);
    
    getSingleActivity(params.id);
  }, []);

  return (
    <div className="border">
      <ActivityDeleteModal open={open} handleClose={handleClose} deleteActivity={deleteActivity}/>
      <div className="detailsContent">
          <div>
              <img className="detailsImg" src={activity.image} alt={activity.activityName} />
          </div>
          <div className="detailsInfo">
              <p className="detailsDate">{activity.startTime}</p>
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