import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";

export default function WarningDialog({
  handleClose,
  open,
  title,
  subtitle,
  deleteBtnText,
  handleDelete,
}) {

  
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
        <Button onClick={handleDelete} color="error">
            {deleteBtnText || "Delete"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
