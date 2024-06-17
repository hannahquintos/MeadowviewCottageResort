import React from 'react';
import {useState, useEffect} from "react";
import { useParams } from 'react-router-dom';
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import LocationOnIcon from '@mui/icons-material/LocationOn';

import EventDeleteModal from "./modals/EventDeleteModal";

export default function singleEvent() {

  const navigate = useNavigate();

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const deleteEvent = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/api/events/delete/${params.id}`);
      handleClose();

      if (res.status === 200) {
        alert("Event successfully deleted");
        navigate("/events");
        } else {
        alert("Something went wrong");
        }
        
    } catch (e) {
      alert("Error");
		  console.log(e);
    }
  };

  const [event, setEvent] = useState([]);

  const params = useParams();

  useEffect(() => {
    const getSingleEvent = async () => {
      let response = await fetch(`http://localhost:3000/api/events/${params.id}`);
      let data = await response.json();
      setEvent(data);
    }
    // console.log("params:" + params.id);
    
    getSingleEvent(params.id);
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
      <EventDeleteModal open={open} handleClose={handleClose} deleteEvent={deleteEvent}/>
      <div className="detailsContent">
          <div>
              <img className="detailsImg" src={event.image} alt={event.eventName} />
          </div>
          <div className="detailsInfo">
                {event.startTime && event.endTime && (
                  <p className="detailsDate">{formatDate(event.startTime, event.endTime)}</p>
                )}
              <h1>{event.eventName}</h1>
              <div className="location">
                  <LocationOnIcon/>
                  <p>{event.location}</p>
              </div>
              <p>{event.description}</p>
              <div className="actionBtns">
                  <div className="btn edit"><Link to={`/admin/events/${event._id}/edit`}>Edit</Link></div>
                  <div className="btn delete" onClick={handleClickOpen}>Delete</div>
              </div>
          </div>
        </div>
    </div>
  );
}