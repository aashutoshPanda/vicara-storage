import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import ShareIcon from '@material-ui/icons/Share';

import {Divider} from '@material-ui/core'

import {
  selectCheckedFolderKeys,
  selectCheckedFileKeys,
} from "../../store/slices/checkBoxSlice";
import { useDispatch, useSelector } from "react-redux";

export default function FormDialog() {
  const [open, setOpen] = React.useState(false);

  const dispatch = useDispatch();
  const checkedFolderKeys = useSelector(selectCheckedFolderKeys);
  const checkedFileKeys = useSelector(selectCheckedFileKeys);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  let deactive =
    checkedFolderKeys.length + checkedFileKeys.length !== 1 ? true : false;

  return (
    <div style={{margin:"10px"}}>
      <Button disabled={deactive} startIcon={<ShareIcon/>} variant="outlined" style={{color:"blue"}} onClick={handleClickOpen}>
        Share
      </Button>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Share with Users</DialogTitle>
        <Divider/>
        <DialogContent>
          <DialogContentText>
            Share link, or add users to share with-
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Add people"
            type=""
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleClose} color="primary">
            Subscribe
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
