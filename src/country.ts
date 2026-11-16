export interface RawCountry {
  name: string;
  flags?: {
    svg?: string;
    png?: string;
  };
  flag?: string;
  capital?: string;
  region?: string;
  subregion?: string;
  nativeName?: string;
  population?: number;
  area?: number;
  borders?: string[];
  languages?: { name: string }[];
  currencies?: {
    name: string;
    code: string;
    symbol?: string;
  }[];
  description?: string;
}

export interface Country {
  name: string;
  flag: string;
  emoji: string;
  capital: string;
  region: string;
  population: number;
  area: number | null;
  borders: string[];
  languages: string[];
  currencies: string[];
  description: string;
}

export function mapCountryResponse(raw: RawCountry): Country {
  return {
    name: raw.name,
    flag: raw.flags?.svg ?? raw.flags?.png ?? '',
    emoji: raw.flag ?? '',
    capital: raw.capital || 'Unknown',
    region: raw.region || 'Unknown',
    population: raw.population ?? 0,
    area: raw.area ?? null,
    borders: [...(raw.borders ?? [])],
    languages: (raw.languages ?? []).map((language) => language.name),
    currencies: (raw.currencies ?? []).map((currency) => `${currency.name} (${currency.code})`),
    description:
      raw.description ||
      `${raw.name} — ${raw.subregion || raw.region || 'Country'}. Native name: ${raw.nativeName || raw.name}.`,
  };
}
