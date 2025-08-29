import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getPokemonByNameOrId } from "../../services/pokemonService";
import { type Pokemon } from "../../types/Pokemon";
import {
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Box,
  Chip,
  Skeleton
} from "@mui/material";

const Details = () => {
  const { id } = useParams<{ id: string }>();

  // 🔹 Pobieranie danych przez React Query
  const {
    data: pokemon,
    isLoading,
    isError,
  } = useQuery<Pokemon, Error>({
    queryKey: ["pokemon", id],
    queryFn: () => getPokemonByNameOrId(id!),
    enabled: !!id, 
  });

  // 🔹 obsługa stanów
  if (isLoading) {
    return (
      <Box>
        <Skeleton variant="rectangular" width={200} height={200} /> {/* obrazek */}
        <Skeleton variant="text" width="60%" height={40} />          {/* nazwa */}
        <Skeleton variant="text" width="40%" height={30} />          {/* typ */}
        <Skeleton variant="text" width="80%" height={30} />          {/* umiejętności */}
      </Box>
    );
  }

  if (isError || !pokemon) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <Typography color="error">Nie udało się pobrać danych Pokémona</Typography>
      </Box>
    );
  }

  // 🔹 główny widok
  return (
    <Box display="flex" justifyContent="center" mt={4}>
      <Card sx={{ maxWidth: 400, padding: 2 }}>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            {pokemon.name}
          </Typography>

          <img
            src={pokemon.sprites.front_default}
            alt={pokemon.name}
            style={{ width: "150px", height: "150px" }}
          />

          <Typography variant="h6" mt={2}>
            Typy:
          </Typography>
          <Box display="flex" gap={1} flexWrap="wrap" mb={2}>
            {pokemon.types.map((t, index) => (
              <Chip key={index} label={t.type.name} color="primary" />
            ))}
          </Box>

          <Typography variant="h6">Umiejętności:</Typography>
          <Box display="flex" gap={1} flexWrap="wrap" mb={2}>
            {pokemon.abilities.map((a, index) => (
              <Chip key={index} label={a.ability.name} />
            ))}
          </Box>

          <Typography variant="h6">Statystyki:</Typography>
          {pokemon.stats.map((s, index) => (
            <Typography key={index}>
              {s.stat.name}: {s.base_stat}
            </Typography>
          ))}
        </CardContent>
      </Card>
    </Box>
  );
};

export default Details;
