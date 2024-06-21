import React from 'react';
import axios from 'axios';
import {useState, useEffect} from "react";
import { useParams } from 'react-router-dom';
import { Link } from "react-router-dom";
import EquipmentBookingModal from "./modals/EquipmentBookingModal";
import DeleteBookingModal from "./modals/DeleteBookingModal";
import useAuth from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import CheckIcon from '@mui/icons-material/Check';

export default function singleEquipment() {

  const { auth } = useAuth();
  const [equipment, setEquipment] = useState([]);
  const [equipmentBookings, setEquipmentBookings] = useState([]);
  const [equipmentBooking, setEquipmentBooking] = useState([]);
  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    const getSingleEquipment = async () => {
      let response = await fetch(`https://meadowview-cottage-resort-api.vercel.app/api/equipment/${params.id}`);
      let data = await response.json();
      setEquipment(data);
    }

    getSingleEquipment(params.id);
  }, []);

  useEffect(() => {
    const getAllEquipmentBookings = async () => {
      let response = await fetch(`https://meadowview-cottage-resort-api.vercel.app/api/equipmentBookings/${auth.userId}`);
      let data = await response.json();
      setEquipmentBookings(data);
    }
    getAllEquipmentBookings();
  }, []);

  const isEquipmentBooked = (equipmentId) => {
    return equipmentBookings.some(booking => booking.equipmentId === equipmentId);
  };

  const getSingleEquipmentBooking = async (equipmentBookingId) => {
    const response = await fetch(`https://meadowview-cottage-resort-api.vercel.app/api/equipmentBookings/details/${equipmentBookingId}`);
    const data = await response.json();
    setEquipmentBooking(data);
  };

  useEffect(() => {
    if (isEquipmentBooked(equipment._id)) {
      const equipmentBooking = equipmentBookings.find(booking => booking.equipmentId === equipment._id);
      if (equipmentBooking) {
        getSingleEquipmentBooking(equipmentBooking._id);
      }
    }
  }, [equipmentBookings, equipment]);

    //set text colour of availablity status
    let color;
    let isAvailable;
    if (equipment.availability === "Available") {
    color = "colorAvailable";
    isAvailable = true;
    } else {
    color = "colorUnavailable";
    }

    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
      setOpen(true);
    };

    const handleClose = () => {
      setOpen(false);
    };

    const bookEquipment = async () => {
      try {
        const formData = {
          equipmentId: params.id,
          userId: auth.userId
        };
  
        const res = await axios.post("https://meadowview-cottage-resort-api.vercel.app/api/equipmentBookings/create", formData);

        handleClose();

        if (res.status === 200) {
          // alert("Equipment booking successfully created");
          navigate("/equipment/bookings");
          } else {
          alert("Something went wrong");
          }
          
      } catch (e) {
        alert("Error");
        console.log(e);
      }

    };

    const deleteBooking = async (equipmentBookingId) => {

      try {
        const res = await axios.get(`https://meadowview-cottage-resort-api.vercel.app/api/equipmentBookings/delete/${equipmentBookingId}`);
        handleClose();
  
        if (res.status === 200) {
          // alert("Equipment booking successfully deleted");
          navigate("/equipment/bookings");
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
          <div className="detailsContent">
              <div>
                  <img className="detailsImg" src={equipment.image} alt={equipment.equipmentName} />
              </div>
              <div className="detailsInfo">
                  {!isEquipmentBooked(equipment._id) && (
                    <div>
                      <p className={color} id="detailsAvailability">{equipment.availability}</p>
                    </div>
                  )}
                  <h1>{equipment.equipmentName}</h1>
                  <p>{equipment.condition} Condition</p>
                  <p>{equipment.description}</p>
                  {isEquipmentBooked(equipment._id) ? (
                    <div className="registered">
                      <p>Booked</p>
                      <CheckIcon />
                      <DeleteBookingModal open={open} handleClose={handleClose} deleteBooking={() => deleteBooking(equipmentBooking._id)}/>
                      <div className="btn deleteBooking" onClick={handleClickOpen}>Delete Booking</div>
                    </div>
                  ) : (
                    isAvailable && (
                      <div>
                        <EquipmentBookingModal open={open} handleClose={handleClose} bookEquipment={() => bookEquipment(equipment._id)} />
                        <div className="btn form" onClick={handleClickOpen}>Book</div>
                      </div>
                    )
                  )}
              </div>
          </div>
      </div>
    );
  }