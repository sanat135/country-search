import type { RawCountry } from './country.js';

export class HttpError extends Error {
  constructor(public readonly status: number) {
    super(`HTTP error: ${status}`);
    this.name = 'HttpError';
  }
}

export async function searchCountries(query: string, signal: AbortSignal): Promise<RawCountry[]> {
  void query;
  void signal;
  throw new Error('Not implemented');
}
