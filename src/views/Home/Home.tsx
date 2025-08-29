import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getPokemonList, getPokemonByNameOrId } from "../../services/pokemonService";
import { type Pokemon } from "../../types/Pokemon";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Button, Pagination, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Typography, Box, Skeleton 
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { usePokemonCompare } from "../../context/PokemonCompareContext";

const Home = () => {

  const [page, setPage] = useState<number>(1);
  const limit = 10;

  const [search, setSearch] = useState<string>("");

  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [dialogTitle, setDialogTitle] = useState<string>("");
  const [dialogItems, setDialogItems] = useState<string[]>([]);

  const { selected, addPokemon, removePokemon } = usePokemonCompare();
  const navigate = useNavigate();

  const {
    data: pokemonsData,
    isLoading,
    isError,
  } = useQuery<{ count: number; results: Pokemon[] }, Error>({
    queryKey: ["pokemons", page, search],
    queryFn: async (): Promise<{ count: number; results: Pokemon[] }> => {
      if (search.trim()) {
        const pokemon = await getPokemonByNameOrId(search.toLowerCase());
        return pokemon
          ? { count: 1, results: [pokemon] }
          : { count: 0, results: [] };
      } else {
        const list = await getPokemonList((page - 1) * limit, limit);
        const detailed = await Promise.all(
          list.results.map(p => getPokemonByNameOrId(p.name))
        );
        return {
          count: list.count,
          results: detailed.filter(Boolean) as Pokemon[],
        };
      }
    },
  });


  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };


  const handleOpenDialog = (title: string, items: string[]) => {
    setDialogTitle(title);
    setDialogItems(items);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setDialogItems([]);
  };

  const toggleCompare = (pokemon: Pokemon) => {
    if (selected.some(p => p.id === pokemon.id)) {
      removePokemon(pokemon.id);
    } else {
      addPokemon(pokemon);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Pokémon Compare</h1>
      <h2>Lista Pokémonów</h2>

      {/* 🔍 wyszukiwarka */}
      <Box mb={2}>
        <TextField
          label="Szukaj po nazwie"
          variant="outlined"
          value={search}
          onChange={e => {
            setPage(1);
            setSearch(e.target.value);
          }}
          fullWidth
        />
      </Box>

      {/* 📌 sekcja z informacją o wybranych pokemonach */}
      <Box mb={2}>
        <Typography>
          Wybrano do porównania: {selected.length} / 2
        </Typography>
        {selected.length > 0 && (
          <Box mt={1}>
            {selected.map(p => (
              <Button
                key={p.id}
                variant="outlined"
                size="small"
                onClick={() => toggleCompare(p)}
                style={{ marginRight: "8px" }}
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

      {/* 📋 tabela z pokemonami */}
      {isLoading && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nazwa</TableCell>
                <TableCell>Obrazek</TableCell>
                <TableCell>Typ</TableCell>
                <TableCell>Umiejętności</TableCell>
                <TableCell>Akcje</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.from(new Array(10)).map((_, index) => (
                <TableRow key={index}>
                  <TableCell><Skeleton variant="text" width={120} /></TableCell>
                  <TableCell><Skeleton variant="text" width={80} /></TableCell>
                  <TableCell><Skeleton variant="text" width={80} /></TableCell>
                  <TableCell><Skeleton variant="text" width={160} /></TableCell>
                  <TableCell><Skeleton variant="rectangular" width={100} height={30} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      {isError && <p style={{ color: "red" }}>Nie udało się pobrać danych z API</p>}


      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nazwa</TableCell>
              <TableCell>Obrazek</TableCell>
              <TableCell>Typ</TableCell>
              <TableCell>Umiejętności</TableCell>
              <TableCell>Akcje</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(pokemonsData?.results ?? []).map((p: Pokemon) => (
              <TableRow key={p.id}>
                <TableCell>{p.name}</TableCell>
                <TableCell>
                  <img src={p.sprites.front_default} alt={p.name} width={50} height={50} />
                </TableCell>
                <TableCell
                  style={{ cursor: "pointer", color: "blue" }}
                  onClick={() =>
                    handleOpenDialog("Typy pokemona", p.types.map(t => t.type.name))
                  }
                >
                  {p.types[0].type.name}
                  {p.types.length > 1 && ` +${p.types.length - 1}`}
                </TableCell>
                <TableCell
                  style={{ cursor: "pointer", color: "blue" }}
                  onClick={() =>
                    handleOpenDialog("Umiejętności pokemona", p.abilities.map(a => a.ability.name))
                  }
                >
                  {p.abilities[0].ability.name}
                  {p.abilities.length > 1 && ` +${p.abilities.length - 1}`}
                </TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    size="small"
                    style={{ marginRight: "8px" }}
                    onClick={() => navigate(`/details/${p.id}`)}
                  >
                    Szczegóły
                  </Button>
                  <Button
                    variant="contained"
                    size="small"
                    color={
                      selected.some(sel => sel.id === p.id) ? "secondary" : "primary"
                    }
                    onClick={() => toggleCompare(p)}
                  >
                    {selected.some(sel => sel.id === p.id) ? "Usuń" : "Porównaj"}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>


      {!search && (
        <div style={{ marginTop: "20px", display: "flex", justifyContent: "center" }}>
          <Pagination
            count={Math.ceil((pokemonsData?.count ?? 0) / limit)}
            page={page}
            onChange={handlePageChange}
            color="primary"
          />
        </div>
      )}

      {/* 📊 dialog z listą typów/umiejętności */}
      <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth>
        <DialogTitle>{dialogTitle}</DialogTitle>
        <DialogContent>
          <ul>
            {dialogItems.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Zamknij</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Home;
