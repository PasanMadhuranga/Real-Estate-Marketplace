import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
} from "../redux/user/userSlice";
import { useNavigate } from "react-router-dom";

export default function WarningDialog({
  handleClose,
  open,
  title,
  subtitle,
  deleteBtnText,
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.user.currentUser);

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const response = await axios.delete(
        `/api/user/delete/${currentUser._id}`
      );
      if (response.success === false) {
        dispatch(deleteUserFailure(response.message));
        return;
      }
      dispatch(deleteUserSuccess());
      handleClose();
      navigate("/");
    } catch (error) {
      console.log(error);
      dispatch(deleteUserFailure(error.response));
    }
  };
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{title || "Warning!"}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {subtitle || "All your data will be lost."}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} autoFocus>
          cancel
        </Button>
        <Button onClick={handleDeleteUser} color="error">
          Delete My Account
        </Button>
      </DialogActions>
    </Dialog>
  );
}
