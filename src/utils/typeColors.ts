export const typeColors: Record<string, string> = {
  normal: "#A8A77A",
  fire: "#EE8130",
  water: "#6390F0",
  electric: "#F7D02C",
  grass: "#7AC74C",
  ice: "#96D9D6",
  fighting: "#C22E28",
  poison: "#A33EA1",
  ground: "#E2BF65",
  flying: "#A98FF3",
  psychic: "#F95587",
  bug: "#A6B91A",
  rock: "#B6A136",
  ghost: "#735797",
  dragon: "#6F35FC",
  dark: "#705746",
  steel: "#B7B7CE",
  fairy: "#D685AD",
};

// 🔹 pobieranie koloru dla jednego typu
export function getTypeColor(type: string): string {
  return typeColors[type.toLowerCase()] || "#A8A77A"; // fallback: normal
}

// 🔹 generowanie tła (dla jednego lub dwóch typów)
export function getTypeBackground(types: string[]): string {
  if (types.length === 1) {
    const color = getTypeColor(types[0]);
    return `${color}33`; // np. #EE813033 (hex z przezroczystością ~20%)
  }

  if (types.length >= 2) {
    const color1 = getTypeColor(types[0]);
    const color2 = getTypeColor(types[1]);
    return `linear-gradient(
      135deg, 
      ${color1}55 0%, 
      ${color1}55 40%, 
      ${color2}55 60%, 
      ${color2}55 100%
    )`;
    // płynne przejście 40–60%
  }

  return "#A8A77A33"; // default z lekką przezroczystością
}
