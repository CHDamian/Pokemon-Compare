import { TableRow, TableCell, Button } from "@mui/material";
import { type Pokemon } from "../../types/Pokemon";
import { useNavigate } from "react-router-dom";
import { getTypeBackground } from "../../utils/typeColors";

interface PokemonRowProps {
  pokemon: Pokemon;
  selected: Pokemon[];
  onToggle: (p: Pokemon) => void;
  onOpenDialog: (title: string, items: string[]) => void;
}

const PokemonRow = ({ pokemon, selected, onToggle, onOpenDialog }: PokemonRowProps) => {
  const navigate = useNavigate();
  const isSelected = selected.some((sel) => sel.id === pokemon.id);

  return (
    <TableRow style={{ background: getTypeBackground(pokemon.types.map((t) => t.type.name)) }}>
      <TableCell>{pokemon.name}</TableCell>
      <TableCell>
        <img src={pokemon.sprites.front_default} alt={pokemon.name} width={50} height={50} />
      </TableCell>
      <TableCell
        style={{ cursor: "pointer", color: "blue" }}
        onClick={() => onOpenDialog("Typy pokemona", pokemon.types.map((t) => t.type.name))}
      >
        {pokemon.types[0].type.name}
        {pokemon.types.length > 1 && ` +${pokemon.types.length - 1}`}
      </TableCell>
      <TableCell
        style={{ cursor: "pointer", color: "blue" }}
        onClick={() => onOpenDialog("Umiejętności pokemona", pokemon.abilities.map((a) => a.ability.name))}
      >
        {pokemon.abilities[0].ability.name}
        {pokemon.abilities.length > 1 && ` +${pokemon.abilities.length - 1}`}
      </TableCell>
      <TableCell>
        <Button variant="outlined" size="small" sx={{ mr: 1 }} onClick={() => navigate(`/details/${pokemon.id}`)}>
          Szczegóły
        </Button>
        <Button
          variant="contained"
          size="small"
          color={isSelected ? "secondary" : "primary"}
          onClick={() => onToggle(pokemon)}
        >
          {isSelected ? "Usuń" : "Porównaj"}
        </Button>
      </TableCell>
    </TableRow>
  );
};

export default PokemonRow;
