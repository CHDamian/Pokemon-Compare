import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getPokemonList, getPokemonByNameOrId, getPokemonNamesByType, getAllPokemonNames } from "../../services/pokemonService";
import { type Pokemon } from "../../types/Pokemon";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Button, Pagination, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Typography, Box, Skeleton, FormControl, InputLabel, Select, MenuItem
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { usePokemonCompare } from "../../context/PokemonCompareContext";
import { getTypeBackground, typeColors } from "../../utils/typeColors";


const Home = () => {

  const [page, setPage] = useState<number>(1);
  const limit = 10;

  const [search, setSearch] = useState<string>("");

  const [firstType, setFirstType] = useState<string>("");
  const [secondType, setSecondType] = useState<string>("");

  const ALL_TYPES = Object.keys(typeColors);

  const [pageInput, setPageInput] = useState<string>("1");


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
    queryKey: ["pokemons", page, search, firstType, secondType],
    queryFn: async (): Promise<{ count: number; results: Pokemon[] }> => {
      // 1. pobieramy wszystkie nazwy
      let allNames = await getAllPokemonNames();

      // 2. filtr po nazwie (jeśli coś wpisano)
      if (search.trim()) {
        allNames = allNames.filter(name =>
          name.toLowerCase().includes(search.toLowerCase())
        );
      }

      // 3. filtr po typach
      if (firstType || secondType) {
        const namesA = firstType ? await getPokemonNamesByType(firstType) : [];
        const namesB = secondType ? await getPokemonNamesByType(secondType) : [];

        let filteredNames: string[] = [];

        if (firstType && secondType) {
          const setB = new Set(namesB);
          filteredNames = namesA.filter(n => setB.has(n));
        } else if (firstType) {
          filteredNames = namesA;
        } else {
          filteredNames = namesB;
        }

        // zawężamy do wspólnej części
        const setFiltered = new Set(filteredNames);
        allNames = allNames.filter(name => setFiltered.has(name));
      }

      // 4. paginacja
      const count = allNames.length;
      const start = (page - 1) * limit;
      const slice = allNames.slice(start, start + limit);

      // 5. pobranie szczegółów
      const detailed = await Promise.all(
        slice.map(name => getPokemonByNameOrId(name))
      );

      return {
        count,
        results: detailed.filter(Boolean) as Pokemon[],
      };
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

  const handleFirstTypeChange = (value: string) => {
    setFirstType(value);
    setPage(1);
    setPageInput("1");
    if (!value) {
      // jeśli wyczyszczono pierwszy typ – zresetuj drugi
      setSecondType("");
    }
  };

  const handleSecondTypeChange = (value: string) => {
    setSecondType(value);
    setPage(1);
    setPageInput("1");
  };

const totalPages = Math.max(1, Math.ceil((pokemonsData?.count ?? 0) / limit));

const goToPage = (raw: string) => {
  const n = parseInt(raw, 10);
  if (isNaN(n) || n < 1) {
    setPage(1);
    setPageInput("1");
    return;
  }
  const clamped = Math.min(Math.max(n, 1), totalPages);
  setPage(clamped);
  setPageInput(String(clamped));
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

      {/* 🔽 filtry typów */}
      <Box mb={2} display="flex" gap={2} flexWrap="wrap">
        <FormControl sx={{ minWidth: 180 }}>
          <InputLabel id="first-type-label">Typ 1</InputLabel>
          <Select
            labelId="first-type-label"
            label="Typ 1"
            value={firstType}
            onChange={(e) => handleFirstTypeChange(e.target.value)}
          >
            <MenuItem value=""><em>Brak</em></MenuItem>
            {ALL_TYPES.map((t) => (
              <MenuItem key={t} value={t}>{t}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 180 }} disabled={!firstType}>
          <InputLabel id="second-type-label">Typ 2</InputLabel>
          <Select
            labelId="second-type-label"
            label="Typ 2"
            value={secondType}
            onChange={(e) => handleSecondTypeChange(e.target.value)}
          >
            <MenuItem value=""><em>Brak</em></MenuItem>
            {ALL_TYPES
              .filter(t => t !== firstType) // nie pozwól wybrać 2x tego samego
              .map((t) => (
                <MenuItem key={t} value={t}>{t}</MenuItem>
              ))}
          </Select>
        </FormControl>
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
              <TableRow
                key={p.id}
                style={{ background: getTypeBackground(p.types.map(t => t.type.name)) }}
              >
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


      {( !search || firstType || secondType ) && (
        <Box
          mt={2}
          display="flex"
          justifyContent="center"
          alignItems="center"
          gap={2}
          flexWrap="wrap"
        >
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
          />

          {/* pole do wpisania numeru strony */}
          <Box display="flex" alignItems="center" gap={1}>
            <TextField
              label="Strona"
              type="number"
              size="small"
              value={pageInput}
              onChange={(e) => setPageInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  goToPage(pageInput);
                }
              }}
              inputProps={{ min: 1 }}
              sx={{ width: 100 }}
            />
            <Button
              variant="outlined"
              onClick={() => goToPage(pageInput)}
            >
              Idź
            </Button>
            <Typography variant="body2">/ {totalPages}</Typography>
          </Box>
        </Box>
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
