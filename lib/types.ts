export interface Country {
  name: {
    common: string;
    official: string;
  };
  flags: {
    png: string;
    svg: string;
    alt?: string;
  };
  capital: string[];
  region: string;
  population: number;
  borders?: string[];
  currencies: {
    [key: string]: {
      name: string;
      symbol: string;
    };
  };
  languages: {
    [key: string]: string;
  };
  timezones: string[];
  cca3: string;
}

export type SortOption = 'name-asc' | 'name-desc' | 'population-asc' | 'population-desc';