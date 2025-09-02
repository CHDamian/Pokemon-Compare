import { TableRow, TableCell, Box, Chip } from "@mui/material";
import { type Pokemon } from "../../types/Pokemon";

interface CompareAbilitiesRowProps {
  selected: Pokemon[];
}

const CompareAbilitiesRow = ({ selected }: CompareAbilitiesRowProps) => {
  return (
    <TableRow>
      <TableCell>
        <strong>Umiejętności</strong>
      </TableCell>
      {selected.map((pokemon) => (
        <TableCell key={pokemon.id} align="center">
          <Box display="flex" gap={1} justifyContent="center" flexWrap="wrap">
            {pokemon.abilities.map((a, i) => (
              <Chip key={i} label={a.ability.name} />
            ))}
          </Box>
        </TableCell>
      ))}
    </TableRow>
  );
};

export default CompareAbilitiesRow;
