import { afterEach, describe, expect, it, vi } from 'vitest';
import { HttpError, searchCountries } from '../src/api';

describe('searchCountries', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns countries from a successful response', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify([{ name: 'Spain' }])));

    vi.stubGlobal('fetch', fetchMock);

    const controller = new AbortController();

    const result = await searchCountries('Spain', controller.signal);

    expect(result).toEqual([{ name: 'Spain' }]);
    expect(fetchMock).toHaveBeenCalledWith(
      'https://countries.dev/name/Spain',
      expect.objectContaining({
        signal: expect.any(AbortSignal),
      }),
    );
  });

  it('returns an empty array for HTTP 404', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(null, { status: 404 })));

    const result = await searchCountries('unknown', new AbortController().signal);

    expect(result).toEqual([]);
  });

  it('throws HttpError for HTTP 500', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(null, { status: 500 })));

    await expect(searchCountries('Spain', new AbortController().signal)).rejects.toBeInstanceOf(
      HttpError,
    );
  });

  it('propagates network errors', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Network error')));

    await expect(searchCountries('Spain', new AbortController().signal)).rejects.toThrow(
      'Network error',
    );
  });

  it('does not fetch for empty input', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    const result = await searchCountries(' ', new AbortController().signal);

    expect(result).toEqual([]);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
