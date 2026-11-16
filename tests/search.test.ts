import { afterEach, describe, expect, it, vi } from 'vitest';

import { createSearch, type SearchState } from '../src/search';

describe('search request race', () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it('aborts the previous request immediately and keeps the latest result', async () => {
    vi.useFakeTimers();

    const pending = new Map<string, () => void>();
    const signals = new Map<string, AbortSignal>();

    const fetchMock = vi.fn(
      (url: string, options: RequestInit) =>
        new Promise<Response>((resolve, reject) => {
          const query = decodeURIComponent(url.split('/').pop() ?? '');

          const signal = options.signal;

          if (!signal) {
            reject(new Error('Missing signal'));
            return;
          }

          signals.set(query, signal);

          const onAbort = () => {
            reject(new DOMException('Aborted', 'AbortError'));
          };

          if (signal.aborted) {
            onAbort();
            return;
          }

          signal.addEventListener('abort', onAbort, {
            once: true,
          });

          pending.set(query, () => {
            signal.removeEventListener('abort', onAbort);

            resolve(new Response(JSON.stringify([{ name: query }])));
          });
        }),
    );

    vi.stubGlobal('fetch', fetchMock);

    const render = vi.fn<(state: SearchState) => void>();
    const search = createSearch(render, 300);

    search.input('sp');

    await vi.advanceTimersByTimeAsync(300);

    expect(fetchMock).toHaveBeenCalledTimes(1);

    search.input('spain');

    expect(signals.get('sp')?.aborted).toBe(true);

    await vi.advanceTimersByTimeAsync(300);

    expect(fetchMock).toHaveBeenCalledTimes(2);

    pending.get('spain')?.();

    await vi.advanceTimersByTimeAsync(0);

    pending.get('sp')?.();

    await vi.advanceTimersByTimeAsync(0);

    expect(render).toHaveBeenLastCalledWith({
      kind: 'results',
      countries: [expect.objectContaining({ name: 'spain' })],
    });

    expect(render.mock.calls.some(([state]) => state.kind === 'error')).toBe(false);
  });
});
