import React from 'react';
import {useState, useEffect} from "react";
import { useParams } from 'react-router-dom';
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import EquipmentDeleteModal from "./modals/EquipmentDeleteModal";

export default function singleEquipment() {

  const navigate = useNavigate();

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const deleteEquipment = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/api/equipment/delete/${params.id}`);
      handleClose();

      if (res.status === 200) {
        // alert("Equipment successfully deleted");
        navigate("/admin/equipment");
        } else {
        alert("Something went wrong");
        }
        
    } catch (e) {
      alert("Error");
		  console.log(e);
    }
  };

  const [equipment, setEquipment] = useState([]);

  const params = useParams();

  useEffect(() => {
    const getSingleEquipment = async () => {
      let response = await fetch(`http://localhost:3000/api/equipment/${params.id}`);
      let data = await response.json();
      setEquipment(data);
    }
    // console.log("params:" + params.id);
    
    getSingleEquipment(params.id);
  }, []);

  //set text colour of availablity status
  var color;
  if (equipment.availability === "Available") {
  color = "colorAvailable";
  } else {
  color = "colorUnavailable";
  }

  return (
    <div className="border">
      <EquipmentDeleteModal open={open} handleClose={handleClose} deleteEquipment={deleteEquipment}/>
      <div className="detailsContent">
          <div>
              <img className="detailsImg" src={equipment.image} alt={equipment.equipmentName} />
          </div>
          <div className="detailsInfo">
              <p className={color} id="detailsAvailability">{equipment.availability}</p>
              <h1>{equipment.equipmentName}</h1>
              <p>{equipment.condition} Condition</p>
              <p>{equipment.description}</p>
              <div className="actionBtns">
                  <div className="btn edit"><Link to={`/admin/equipment/${equipment._id}/edit`}>Edit</Link></div>
                  <div className="btn delete" onClick={handleClickOpen}>Delete</div>
              </div>
          </div>
        </div>
    </div>
  );
}