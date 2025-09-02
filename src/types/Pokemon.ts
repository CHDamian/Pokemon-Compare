export interface NamedAPIResource {
  name: string;
  url: string;
}

export interface Ability {
  ability: NamedAPIResource;
  is_hidden: boolean;
  slot: number;
}

export interface AbilityDetails {
  name: string;
  effect: string;
}

export interface Type {
  slot: number;
  type: NamedAPIResource;
}

export interface Stat {
  base_stat: number;
  effort: number;
  stat: NamedAPIResource;
}

export interface Sprites {
  front_default: string;
}

export interface Pokemon {
  id: number;
  name: string;
  abilities: Ability[];
  types: Type[];
  stats: Stat[];
  sprites: Sprites;
}
