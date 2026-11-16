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
  void raw;
  throw new Error('Not implemented');
}
