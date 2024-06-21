import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function EventStaffDeleteModal({ openDeleteStaff, handleCloseDeleteStaff, deleteEventStaff }) {

  return (
    <Dialog
      open={openDeleteStaff}
      onClose={handleCloseDeleteStaff}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {"Are you sure you want to remove this staff member?"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          This action is permanent and cannot be undone.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseDeleteStaff}>Cancel</Button>
        <Button onClick={deleteEventStaff}>Remove</Button>
      </DialogActions>
    </Dialog>
  );
}
