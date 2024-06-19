import React from 'react';
import {useState, useEffect} from "react";
import { useParams } from 'react-router-dom';
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import UserDeleteModal from "./modals/UserDeleteModal";

export default function singleUser() {

  const navigate = useNavigate();

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const deleteUser = async () => {
    try {
      const res = await axios.get(`https://meadowview-cottage-resort-api.vercel.app/api/users/delete/${params.id}`);
      handleClose();

      if (res.status === 200) {
        // alert("User successfully deleted");
        navigate("/admin/users");
        } else {
        alert("Something went wrong");
        }
        
    } catch (e) {
      alert("Error");
		  console.log(e);
    }
  };

  const [user, setUser] = useState([]);

  const params = useParams();

  useEffect(() => {
    const getSingleUser = async () => {
      let response = await fetch(`https://meadowview-cottage-resort-api.vercel.app/api/users/${params.id}`);
      let data = await response.json();
      setUser(data);
    }
    
    getSingleUser(params.id);
  }, []);

  return (
    <div className="border">
        <UserDeleteModal open={open} handleClose={handleClose} deleteUser={deleteUser}/>
        <div className="content">
            <div>
                <h1 className="adminHeading">{user.lastName}, {user.firstName}</h1>
            </div>
            <div className="divider"></div>
            <div>
                <p><span className="bold">First Name:</span> {user.firstName}</p>
                <p><span className="bold">Last Name:</span> {user.lastName}</p>
                <p><span className="bold">Email:</span> {user.email}</p>
                <p><span className="bold">Phone Number:</span> {user.phone}</p>
                <p><span className="bold">Role:</span> {user.role}</p>
            </div>
            <div className="actionBtns">
                <div className="btn edit"><Link to={`/admin/users/${user._id}/edit`}>Edit</Link></div>
                <div className="btn delete" onClick={handleClickOpen}>Delete</div>
            </div>
        </div>
    </div>
  );
}