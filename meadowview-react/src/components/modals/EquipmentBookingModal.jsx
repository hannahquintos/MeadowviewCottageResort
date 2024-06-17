import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function EquipmentBookingModal({ open, handleClose, bookEquipment }) {

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {"Would you like to book this equipment?"}
      </DialogTitle>
      <DialogContent>
        {/* <DialogContentText id="alert-dialog-description">
          This action is permanent and cannot be undone.
        </DialogContentText> */}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={bookEquipment}>Confirm Booking</Button>
      </DialogActions>
    </Dialog>
  );
}
