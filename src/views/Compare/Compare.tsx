import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePokemonCompare } from "../../context/PokemonCompareContext";
import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  Grid,
  Snackbar,
  Alert,
} from "@mui/material";

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

  return (
    <div style={{ padding: "20px" }}>
      <Typography variant="h4" gutterBottom align="center">
        Porównanie Pokémonów
      </Typography>

      <Grid container spacing={3}>
        {selected.map((pokemon) => (
          <Grid item xs={12} md={6} key={pokemon.id}>
            <Card sx={{ height: "100%" }}>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  {pokemon.name}
                </Typography>

                <Typography variant="subtitle1" gutterBottom>
                  Typy:
                </Typography>
                <List dense>
                  {pokemon.types.map((t, i) => (
                    <ListItem key={i}>
                      <ListItemText primary={t.type.name} />
                    </ListItem>
                  ))}
                </List>

                <Typography variant="subtitle1" gutterBottom>
                  Umiejętności:
                </Typography>
                <List dense>
                  {pokemon.abilities.map((a, i) => (
                    <ListItem key={i}>
                      <ListItemText primary={a.ability.name} />
                    </ListItem>
                  ))}
                </List>

                <Typography variant="subtitle1" gutterBottom>
                  Statystyki:
                </Typography>
                <List dense>
                  {pokemon.stats.map((s, i) => (
                    <ListItem key={i}>
                      <ListItemText
                        primary={`${s.stat.name}: ${s.base_stat}`}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default Compare;
