import React from 'react';
import {useState, useEffect} from "react";
import { useParams } from 'react-router-dom';
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import CancelIcon from '@mui/icons-material/Cancel';
import AddIcon from '@mui/icons-material/Add';

import EventDeleteModal from "./modals/EventDeleteModal";
import EventStaffDeleteModal from "./modals/EventStaffDeleteModal";


export default function singleEvent() {


  const [event, setEvent] = useState([]);
  const [eventStaff, setEventStaff] = useState([]);

  const params = useParams();
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
      const res = await axios.get(`https://meadowview-cottage-resort-api.vercel.app/api/events/delete/${params.id}`);
      handleClose();

      if (res.status === 200) {
        // alert("Event successfully deleted");
        navigate("/admin/events");
        } else {
        alert("Something went wrong");
        }
        
    } catch (e) {
      alert("Error");
		  console.log(e);
    }
  };

  const [openDeleteStaff, setOpenDeleteStaff] = React.useState(false);

  const handleClickOpenDeleteStaff = () => {
    setOpenDeleteStaff(true);
  };

  const handleCloseDeleteStaff = () => {
    setOpenDeleteStaff(false);
  };

  const deleteEventStaff = async (eventStaffId) => {
    try {
      const res = await axios.get(`https://meadowview-cottage-resort-api.vercel.app/api/eventStaff/delete/${eventStaffId}`);
      handleCloseDeleteStaff();

      if (res.status === 200) {
        // alert("Event staff successfully deleted");
        //update eventStaff
        setEventStaff((prevEventStaff) =>
          prevEventStaff.filter((staff) => staff._id !== eventStaffId)
        );
        } else {
        alert("Something went wrong");
        }
        
    } catch (e) {
      alert("Error");
		  console.log(e);
    }
  };

  useEffect(() => {
    const getSingleEvent = async () => {
      let response = await fetch(`https://meadowview-cottage-resort-api.vercel.app/api/events/${params.id}`);
      let data = await response.json();
      setEvent(data);
    }
    // console.log("params:" + params.id);
    
    getSingleEvent(params.id);
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
        <div className="staffContent">
            <div className="divider"></div>
            <div id="assignStaffHeader">
              <h2 className="staffHeading">Event Staff</h2>
              <div className='btn add'>
                <Link to={`/admin/events/${event._id}/assignStaff`}>
                  <div className="addContainer">
                      Assign Staff
                      <AddIcon/> 
                  </div>
                </Link>
              </div>
            </div>
            {eventStaff.length > 0 && (
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell id="staffTableHeading">Staff Member</TableCell>
                      <TableCell align="right"></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {eventStaff.map((staff) => (
                      <TableRow
                        key={staff._id}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      >
                        <TableCell component="th" scope="row">
                          {staff.userDetails.lastName}, {staff.userDetails.firstName}
                        </TableCell>
                        <TableCell align="right">
                          <EventStaffDeleteModal openDeleteStaff={openDeleteStaff} handleCloseDeleteStaff={handleCloseDeleteStaff} deleteEventStaff={() => deleteEventStaff(staff._id)}/>
                          <CancelIcon className="iconColor" onClick={handleClickOpenDeleteStaff}/>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>   
            )}
        </div>
    </div>
  );
}