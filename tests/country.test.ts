import { describe, expect, it } from 'vitest';
import { mapCountryResponse } from '../src/country';

describe('mapCountryResponse', () => {
  it('maps API fields into country data', () => {
    const country = mapCountryResponse({
      name: 'Kazakhstan',
      capital: 'Astana',
      region: 'Asia',
      population: 20000000,
      flags: { svg: 'flag.svg' },
      area: 2724900,
      borders: ['CHN', 'RUS'],
      languages: [{ name: 'Kazakh' }, { name: 'Russian' }],
      currencies: [{ name: 'Tenge', code: 'KZT' }],
    });

    expect(country).toMatchObject({
      name: 'Kazakhstan',
      capital: 'Astana',
      region: 'Asia',
      flag: 'flag.svg',
      population: 20000000,
      area: 2724900,
      borders: ['CHN', 'RUS'],
      languages: ['Kazakh', 'Russian'],
      currencies: ['Tenge (KZT)'],
    });
  });

  it('handles missing optional fields', () => {
    const country = mapCountryResponse({
      name: 'Example',
    });

    expect(country.capital).toBe('Unknown');
    expect(country.languages).toEqual([]);
    expect(country.currencies).toEqual([]);
    expect(country.borders).toEqual([]);
  });
});
