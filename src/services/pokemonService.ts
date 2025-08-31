import { type Pokemon} from "../types/Pokemon";
import { type PokemonListResponse } from "../types/PokemonListResponse";

const API_URL = "https://pokeapi.co/api/v2";

export async function getPokemonList(offset = 0, limit = 20): Promise<PokemonListResponse> {
  const res = await fetch(`${API_URL}/pokemon?offset=${offset}&limit=${limit}`);
  if (!res.ok) throw new Error("Failed to fetch pokemon list");
  return res.json();
}

export async function getAllPokemonNames(): Promise<string[]> {
  const response = await fetch(`${API_URL}/pokemon?limit=100000&offset=0`);
  if (!response.ok) {
    throw new Error("Błąd pobierania listy nazw pokemonów");
  }
  const data = await response.json();
  return data.results.map((p: { name: string }) => p.name);
}


export async function getPokemonByNameOrId(nameOrId: string | number): Promise<Pokemon> {
  const res = await fetch(`${API_URL}/pokemon/${nameOrId}`);
  if (!res.ok) throw new Error(`Pokemon ${nameOrId} not found`);
  return res.json();
}


export async function getPokemonNamesByType(type: string): Promise<string[]> {
  const res = await fetch(`${API_URL}/type/${type}`);
  if (!res.ok) throw new Error("Failed to fetch pokemon by type");
  const data = await res.json();
  // data.pokemon jest tablicą obiektów: { pokemon: { name, url }, slot }
  return data.pokemon.map((p: { pokemon: { name: string } }) => p.pokemon.name);
}

