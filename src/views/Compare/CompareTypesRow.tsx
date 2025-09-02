import { TableRow, TableCell, Box, Chip } from "@mui/material";
import { type Pokemon } from "../../types/Pokemon";
import { typeColors } from "../../utils/typeColors";

interface CompareTypesRowProps {
  selected: Pokemon[];
}

const CompareTypesRow = ({ selected }: CompareTypesRowProps) => {
  return (
    <TableRow>
      <TableCell>
        <strong>Typy</strong>
      </TableCell>
      {selected.map((pokemon) => (
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
  );
};

export default CompareTypesRow;
