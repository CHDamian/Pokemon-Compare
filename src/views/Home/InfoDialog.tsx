import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";

interface InfoDialogProps {
  open: boolean;
  title: string;
  items: string[];
  onClose: () => void;
}

const InfoDialog = ({ open, title, items, onClose }: InfoDialogProps) => (
  <Dialog open={open} onClose={onClose} fullWidth>
    <DialogTitle>{title}</DialogTitle>
    <DialogContent>
      <ul>
        {items.map((item, i) => <li key={i}>{item}</li>)}
      </ul>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose}>Zamknij</Button>
    </DialogActions>
  </Dialog>
);

export default InfoDialog;
