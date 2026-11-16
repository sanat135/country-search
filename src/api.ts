import type { RawCountry } from './country.js';

export class HttpError extends Error {
  constructor(public readonly status: number) {
    super(`HTTP error: ${status}`);
    this.name = 'HttpError';
  }
}

export async function searchCountries(query: string, signal: AbortSignal): Promise<RawCountry[]> {
  const normalized = query.trim();

  if (!normalized) {
    return [];
  }

  const combinedSignal = AbortSignal.any([signal, AbortSignal.timeout(10000)]);

  const response = await fetch(`https://countries.dev/name/${encodeURIComponent(normalized)}`, {
    signal: combinedSignal,
  });

  if (response.status === 404) {
    return [];
  }

  if (!response.ok) {
    throw new HttpError(response.status);
  }

  return (await response.json()) as RawCountry[];
}
