import {
  Table, TableHead, TableRow, TableCell, TableBody, TableContainer, Paper, Skeleton,
} from "@mui/material";
import { type Pokemon } from "../../types/Pokemon";
import PokemonRow from "./PokemonRow";

interface PokemonTableProps {
  pokemons: Pokemon[];
  selected: Pokemon[];
  onToggle: (p: Pokemon) => void;
  onOpenDialog: (title: string, items: string[]) => void;
  isLoading: boolean;
}

const PokemonTable = ({ pokemons, selected, onToggle, onOpenDialog, isLoading }: PokemonTableProps) => (
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
        {isLoading
          ? Array.from({ length: 10 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell><Skeleton width={120} /></TableCell>
                <TableCell><Skeleton width={80} /></TableCell>
                <TableCell><Skeleton width={80} /></TableCell>
                <TableCell><Skeleton width={160} /></TableCell>
                <TableCell><Skeleton variant="rectangular" width={100} height={30} /></TableCell>
              </TableRow>
            ))
          : pokemons.map((p) => (
              <PokemonRow
                key={p.id}
                pokemon={p}
                selected={selected}
                onToggle={onToggle}
                onOpenDialog={onOpenDialog}
              />
            ))}
      </TableBody>
    </Table>
  </TableContainer>
);

export default PokemonTable;
