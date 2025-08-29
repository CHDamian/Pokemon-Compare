import { createContext, useContext, useState, type ReactNode } from "react";
import { type Pokemon } from "../types/Pokemon";

interface PokemonCompareContextType {
  selected: Pokemon[];
  addPokemon: (pokemon: Pokemon) => void;
  removePokemon: (id: number) => void;
  clearComparison: () => void;
}

const PokemonCompareContext = createContext<PokemonCompareContextType | undefined>(undefined);

export const PokemonCompareProvider = ({ children }: { children: ReactNode }) => {
  const [selected, setSelected] = useState<Pokemon[]>([]);

  const addPokemon = (pokemon: Pokemon) => {
    setSelected(prev => {
      if (prev.some(p => p.id === pokemon.id)) return prev; // unikamy duplikatów
      if (prev.length >= 2) return prev; // max 2
      return [...prev, pokemon];
    });
  };

  const removePokemon = (id: number) => {
    setSelected(prev => prev.filter(p => p.id !== id));
  };

  const clearComparison = () => {
    setSelected([]);
  };

  return (
    <PokemonCompareContext.Provider value={{ selected, addPokemon, removePokemon, clearComparison }}>
      {children}
    </PokemonCompareContext.Provider>
  );
};

export const usePokemonCompare = () => {
  const context = useContext(PokemonCompareContext);
  if (!context) throw new Error("usePokemonCompare must be used within PokemonCompareProvider");
  return context;
};
