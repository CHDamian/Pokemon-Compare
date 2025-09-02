import { Snackbar, Alert } from "@mui/material";

interface CompareAlertProps {
  open: boolean;
  onClose: () => void;
}

const CompareAlert = ({ open, onClose }: CompareAlertProps) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={4000}
      onClose={onClose}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <Alert severity="info" onClose={onClose}>
        Wybierz dwóch Pokémonów do porównania!
      </Alert>
    </Snackbar>
  );
};

export default CompareAlert;
