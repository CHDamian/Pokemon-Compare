import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePokemonCompare } from "../../context/PokemonCompareContext";
import { Typography } from "@mui/material";

import CompareAlert from "./CompareAlert";
import CompareTable from "./CompareTable";

const Compare = () => {
  const { selected } = usePokemonCompare();
  const navigate = useNavigate();

  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    if (selected.length !== 2) {
      setShowAlert(true);
      navigate("/", { replace: true });
    }
  }, [selected, navigate]);

  if (selected.length !== 2) {
    return (
      <CompareAlert open={showAlert} onClose={() => setShowAlert(false)} />
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <Typography variant="h4" gutterBottom align="center">
        Porównanie Pokémonów
      </Typography>
      <CompareTable selected={selected} />
    </div>
  );
};

export default Compare;
