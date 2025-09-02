import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getPokemonByNameOrId, getPokemonNamesByType, getAllPokemonNames } from "../../services/pokemonService";
import { type Pokemon } from "../../types/Pokemon";
import { Typography } from "@mui/material";
import { usePokemonCompare } from "../../context/PokemonCompareContext";
import { typeColors } from "../../utils/typeColors";

// 🔹 nowe komponenty
import Filters from "./Filters";
import CompareBar from "./CompareBar";
import PokemonTable from "./PokemonTable";
import PaginationControls from "./PaginationControls";
import InfoDialog from "./InfoDialog";

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

  // 🔹 pobranie listy pokemonów z API
  const {
    data: pokemonsData,
    isLoading,
    isError,
  } = useQuery<{ count: number; results: Pokemon[] }, Error>({
    queryKey: ["pokemons", page, search, firstType, secondType],
    queryFn: async (): Promise<{ count: number; results: Pokemon[] }> => {
      let allNames = await getAllPokemonNames();

      // filtr nazwy
      if (search.trim()) {
        allNames = allNames.filter((name) =>
          name.toLowerCase().includes(search.toLowerCase())
        );
      }

      // filtr typów
      if (firstType || secondType) {
        const namesA = firstType ? await getPokemonNamesByType(firstType) : [];
        const namesB = secondType ? await getPokemonNamesByType(secondType) : [];

        let filteredNames: string[] = [];
        if (firstType && secondType) {
          const setB = new Set(namesB);
          filteredNames = namesA.filter((n) => setB.has(n));
        } else if (firstType) {
          filteredNames = namesA;
        } else {
          filteredNames = namesB;
        }

        const setFiltered = new Set(filteredNames);
        allNames = allNames.filter((name) => setFiltered.has(name));
      }

      // paginacja
      const count = allNames.length;
      const start = (page - 1) * limit;
      const slice = allNames.slice(start, start + limit);

      const detailed = await Promise.all(slice.map((name) => getPokemonByNameOrId(name)));

      return {
        count,
        results: detailed.filter(Boolean) as Pokemon[],
      };
    },
  });

  const toggleCompare = (pokemon: Pokemon) => {
    if (selected.some((p) => p.id === pokemon.id)) {
      removePokemon(pokemon.id);
    } else {
      addPokemon(pokemon);
    }
  };

  const handleFirstTypeChange = (value: string) => {
    setFirstType(value);
    setPage(1);
    setPageInput("1");
    if (!value) setSecondType("");
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

  const handleOpenDialog = (title: string, items: string[]) => {
    setDialogTitle(title);
    setDialogItems(items);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setDialogItems([]);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Pokémon Compare</h1>
      <h2>Lista Pokémonów</h2>

      {/* 🔍 Filtry i wyszukiwarka */}
      <Filters
        search={search}
        onSearchChange={(value) => {
          setPage(1);
          setSearch(value);
        }}
        firstType={firstType}
        secondType={secondType}
        allTypes={ALL_TYPES}
        onFirstTypeChange={handleFirstTypeChange}
        onSecondTypeChange={handleSecondTypeChange}
      />

      {/* 📌 Pasek porównywania */}
      <CompareBar selected={selected} onToggle={toggleCompare} />

      {/* 📋 Tabela */}
      {isError && (
        <Typography color="error">Nie udało się pobrać danych z API</Typography>
      )}
      <PokemonTable
        pokemons={pokemonsData?.results ?? []}
        selected={selected}
        onToggle={toggleCompare}
        onOpenDialog={handleOpenDialog}
        isLoading={isLoading}
      />

      {/* 📄 Paginacja */}
      {( !search || firstType || secondType ) && (
        <PaginationControls
          page={page}
          totalPages={totalPages}
          pageInput={pageInput}
          onPageChange={setPage}
          onPageInputChange={setPageInput}
          onGoToPage={() => goToPage(pageInput)}
        />
      )}

      {/* 📊 Dialog */}
      <InfoDialog
        open={openDialog}
        title={dialogTitle}
        items={dialogItems}
        onClose={handleCloseDialog}
      />
    </div>
  );
};

export default Home;
