import React from 'react';
import {useState, useEffect} from "react";
import { Link } from "react-router-dom";
import Weather from "./Weather";
import useAuth from '../hooks/useAuth';
import CheckIcon from '@mui/icons-material/Check';


export default function EquipmentBookingsList() {

  const { auth } = useAuth();
  const [equipment, setEquipment] = useState([]);
  const [equipmentBookings, setEquipmentBookings] = useState([]);

  useEffect(() => {
    const getAllEquipment = async () => {
      let response = await fetch("https://meadowview-cottage-resort-api.vercel.app/api/equipment");
      let data = await response.json();
      setEquipment(data);
    }
    getAllEquipment();
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

  //filter equipment to only display equipment booked
  const bookedEquipment = equipment.filter(equipment => isEquipmentBooked(equipment._id));

  return (
    <div className="contentContainer">
      <div className="pageTitle">
        <h1>My Equipment Bookings</h1>
        <div className="btn"><Link to="/equipment">View All Equipment</Link></div>
      </div>
      {
          bookedEquipment.map((equipmentPiece) => {

            //set text colour of availablity status
            let color;
            if (equipmentPiece.availability === "Available") {
              color = "colorAvailable";
            } else {
              color = "colorUnavailable";
            }

            return (
              <Link to={`/equipment/${equipmentPiece._id}`} key={equipmentPiece._id}>
                <div className="card">
                  <img src={equipmentPiece.image} alt={equipmentPiece.equipmentName} />
                  <div className="cardText">
                    {isEquipmentBooked(equipmentPiece._id) && (
                        <div className="registered">
                          <p>Booked</p>
                          <CheckIcon />
                        </div>
                    )}
                    <h2>{equipmentPiece.equipmentName}</h2>
                    <p>{equipmentPiece.condition} Condition</p>
                  </div>
                </div>
              </Link>
            );
          })
      }
      <Weather />
    </div>
  );
}