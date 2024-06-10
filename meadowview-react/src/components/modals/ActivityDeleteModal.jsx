import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import axios from 'axios';

export default function ActivityDeleteModal({ open, handleClose, deleteActivity }) {

  // const deleteActivity = async () => {
  //   try {
  //     const res = await axios.get(`http://localhost:3000/api/activities/delete/${params.id}`);
  //     handleClose();

  //     if (res.status === 200) {
  //       alert("Activity successfully deleted");
  //       navigate("/activities");
  //       } else {
  //       alert("Something went wrong");
  //       }
        
  //   } catch (e) {
  //     alert("Error");
	// 	  console.log(e);
  //   }
  // };


  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {"Are you sure you want to delete this activity?"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          This action is permanent and cannot be undone.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={deleteActivity}>Delete</Button>
      </DialogActions>
    </Dialog>
  );
}
