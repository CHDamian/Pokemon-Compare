import { Box, Button, Typography } from "@mui/material";
import { type Pokemon } from "../../types/Pokemon";
import { useNavigate } from "react-router-dom";

interface CompareBarProps {
  selected: Pokemon[];
  onToggle: (p: Pokemon) => void;
}

const CompareBar = ({ selected, onToggle }: CompareBarProps) => {
  const navigate = useNavigate();

  return (
    <Box mb={2}>
      <Typography>Wybrano do porównania: {selected.length} / 2</Typography>

      {selected.length > 0 && (
        <Box mt={1}>
          {selected.map((p) => (
            <Button
              key={p.id}
              variant="outlined"
              size="small"
              onClick={() => onToggle(p)}
              sx={{ mr: 1 }}
            >
              Usuń {p.name}
            </Button>
          ))}
        </Box>
      )}

      <Box mt={1}>
        <Button
          variant="contained"
          color="primary"
          disabled={selected.length !== 2}
          onClick={() => navigate("/compare")}
        >
          Przejdź do porównania
        </Button>
      </Box>
    </Box>
  );
};

export default CompareBar;
