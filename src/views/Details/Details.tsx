import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getPokemonByNameOrId, getAbilityDetails } from "../../services/pokemonService";
import { type Pokemon, type AbilityDetails } from "../../types/Pokemon";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Skeleton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  LinearProgress,
} from "@mui/material";
import { useState } from "react";
import { getTypeColor } from "../../utils/typeColors";


function getStatColor(value: number): string {
  const ratio = value / 255; // 0..1
  if (ratio < 0.33) return "#e53935"; // czerwony
  if (ratio < 0.66) return "#fbc02d"; // żółty
  return "#43a047"; // zielony
}

const Details = () => {
  const { id } = useParams<{ id: string }>();

  const {
    data: pokemon,
    isLoading,
    isError,
  } = useQuery<Pokemon, Error>({
    queryKey: ["pokemon", id],
    queryFn: () => getPokemonByNameOrId(id!),
    enabled: !!id,
  });

  const [abilityDialog, setAbilityDialog] = useState<AbilityDetails | null>(
    null
  );

  // 🔹 obsługa stanów
  if (isLoading) {
    return (
      <Box p={3}>
        <Skeleton variant="rectangular" width={250} height={250} /> {/* obrazek */}
        <Skeleton variant="text" width="60%" height={40} />
        <Skeleton variant="text" width="40%" height={30} />
        <Skeleton variant="text" width="80%" height={30} />
      </Box>
    );
  }

  if (isError || !pokemon) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <Typography color="error">
          Nie udało się pobrać danych Pokémona
        </Typography>
      </Box>
    );
  }

  return (
    <Box display="flex" justifyContent="center" mt={4} px={2}>
      <Card
        sx={{
          maxWidth: 600,
          width: "100%",
          borderRadius: 4,
          boxShadow: 4,
          p: 3,
        }}
      >
        <CardContent>
          <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
            <img
              src={pokemon.sprites.front_default}
              alt={pokemon.name}
              style={{ width: "200px", height: "200px" }}
            />
            <Typography variant="h4" gutterBottom>
              {pokemon.name}
            </Typography>
          </Box>

          {/* Typy */}
          <Typography variant="h6">Typy:</Typography>
          <Box display="flex" gap={1} flexWrap="wrap" mb={2}>
            {pokemon.types.map((t, index) => (
              <Chip
                key={index}
                label={t.type.name}
                sx={{
                  backgroundColor: getTypeColor(t.type.name),
                  color: "white",
                  fontWeight: "bold",
                  textTransform: "capitalize",
                }}
              />
            ))}
          </Box>

          {/* Umiejętności */}
          <Typography variant="h6">Umiejętności:</Typography>
          <Box display="flex" gap={1} flexWrap="wrap" mb={3}>
            {pokemon.abilities.map((a, index) => (
              <Chip
                key={index}
                label={a.ability.name}
                clickable
                onClick={async () => {
                  const details = await getAbilityDetails(a.ability.url);
                  setAbilityDialog(details);
                }}
                sx={{
                  backgroundColor: "#eceff1",
                  fontWeight: "bold",
                  textTransform: "capitalize",
                }}
              />
            ))}
          </Box>

          {/* Statystyki */}
          <Typography variant="h6" gutterBottom>
            Statystyki:
          </Typography>
          <Box>
            {pokemon.stats.map((s, index) => {
              const value = s.base_stat;
              const color = getStatColor(value);

              return (
                <Box key={index} mb={2}>
                  <Box display="flex" justifyContent="space-between">
                    <Typography>{s.stat.name}</Typography>
                    <Typography>{value}</Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={(value / 255) * 100}
                    sx={{
                      height: 10,
                      borderRadius: 5,
                      [`& .MuiLinearProgress-bar`]: {
                        backgroundColor: color,
                      },
                    }}
                  />
                </Box>
              );
            })}
          </Box>
        </CardContent>
      </Card>

      {/* Dialog szczegółów umiejętności */}
      <Dialog
        open={!!abilityDialog}
        onClose={() => setAbilityDialog(null)}
        fullWidth
      >
        <DialogTitle sx={{ textTransform: "capitalize" }}>
          {abilityDialog?.name}
        </DialogTitle>
        <DialogContent dividers>
          <Typography>{abilityDialog?.effect}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAbilityDialog(null)}>Zamknij</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Details;
