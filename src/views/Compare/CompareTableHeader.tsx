import { TableHead, TableRow, TableCell, Typography } from "@mui/material";
import { type Pokemon } from "../../types/Pokemon";

interface CompareTableHeaderProps {
  selected: Pokemon[];
}

const CompareTableHeader = ({ selected }: CompareTableHeaderProps) => {
  return (
    <TableHead>
      <TableRow>
        <TableCell>Pokémon</TableCell>
        {selected.map((pokemon) => (
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
  );
};

export default CompareTableHeader;
