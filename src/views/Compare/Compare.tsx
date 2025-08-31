import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePokemonCompare } from "../../context/PokemonCompareContext";
import {
  Typography,
  Snackbar,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Box,
} from "@mui/material";
import { typeColors } from "../../utils/typeColors";

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
      <>
        <Snackbar
          open={showAlert}
          autoHideDuration={4000}
          onClose={() => setShowAlert(false)}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert severity="info" onClose={() => setShowAlert(false)}>
            Wybierz dwóch Pokémonów do porównania!
          </Alert>
        </Snackbar>
      </>
    );
  }

  const [first, second] = selected;

  return (
    <div style={{ padding: "20px" }}>
      <Typography variant="h4" gutterBottom align="center">
        Porównanie Pokémonów
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Pokémon</TableCell>
              {selected.map(pokemon => (
                <TableCell key={pokemon.id} align="center">
                  <Typography variant="h6" gutterBottom>
                    {pokemon.name}
                  </Typography>
                  <img
                    src={pokemon.sprites.front_default}
                    alt={pokemon.name}
                    width={96}
                    height={96}
                  />
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {/* Typy */}
            <TableRow>
              <TableCell>
                <strong>Typy</strong>
              </TableCell>
              {selected.map(pokemon => (
                <TableCell key={pokemon.id} align="center">
                  <Box display="flex" gap={1} justifyContent="center" flexWrap="wrap">
                    {pokemon.types.map((t, i) => (
                      <Chip
                        key={i}
                        label={t.type.name}
                        sx={{
                          backgroundColor: typeColors[t.type.name] || "#ccc",
                          color: "#fff",
                          fontWeight: "bold",
                        }}
                      />
                    ))}
                  </Box>
                </TableCell>
              ))}
            </TableRow>

            {/* Umiejętności */}
            <TableRow>
              <TableCell>
                <strong>Umiejętności</strong>
              </TableCell>
              {selected.map(pokemon => (
                <TableCell key={pokemon.id} align="center">
                  <Box display="flex" gap={1} justifyContent="center" flexWrap="wrap">
                    {pokemon.abilities.map((a, i) => (
                      <Chip key={i} label={a.ability.name} />
                    ))}
                  </Box>
                </TableCell>
              ))}
            </TableRow>

            {/* Statystyki */}
            {first.stats.map((s, i) => {
              const statName = s.stat.name;
              const statA = first.stats.find(stat => stat.stat.name === statName)?.base_stat ?? 0;
              const statB = second.stats.find(stat => stat.stat.name === statName)?.base_stat ?? 0;

              const colorA =
                statA > statB ? "success" : statA < statB ? "default" : "info";
              const colorB =
                statB > statA ? "success" : statB < statA ? "default" : "info";

              return (
                <TableRow key={i}>
                  <TableCell>
                    <strong>{statName}</strong>
                  </TableCell>
                  <TableCell align="center">
                    <Chip label={statA} color={colorA as any} />
                  </TableCell>
                  <TableCell align="center">
                    <Chip label={statB} color={colorB as any} />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Compare;
