import { debounce } from './debounce.js';
import { searchCountries } from './api.js';
import { mapCountryResponse, type Country } from './country.js';
import { classifyError } from './errors.js';

export type SearchState =
  | { kind: 'idle' }
  | { kind: 'loading' }
  | { kind: 'empty' }
  | { kind: 'error'; message: string }
  | { kind: 'results'; countries: Country[] };

export function createSearch(render: (state: SearchState) => void, delay = 300) {
  let activeController: AbortController | null = null;
  let latestQuery = '';

  async function run(query: string, signal: AbortSignal) {
    if (signal.aborted) {
      return;
    }

    render({ kind: 'loading' });

    try {
      const raw = await searchCountries(query, signal);

      if (signal.aborted) {
        return;
      }

      if (raw.length === 0) {
        render({ kind: 'empty' });
        return;
      }

      render({
        kind: 'results',
        countries: raw.map(mapCountryResponse),
      });
    } catch (error) {
      if (signal.aborted) {
        return;
      }

      const result = classifyError(error);

      if (result.kind !== 'aborted') {
        render(result);
      }
    }
  }

  const scheduledSearch = debounce((query: string, signal: AbortSignal) => {
    void run(query, signal);
  }, delay);

  function cancelCurrent() {
    scheduledSearch.cancel();
    activeController?.abort();
    activeController = null;
  }

  function input(value: string) {
    cancelCurrent();

    latestQuery = value.trim();

    if (!latestQuery) {
      render({ kind: 'idle' });
      return;
    }

    activeController = new AbortController();

    render({ kind: 'loading' });

    scheduledSearch(latestQuery, activeController.signal);
  }

  function retry() {
    cancelCurrent();

    if (!latestQuery) {
      render({ kind: 'idle' });
      return;
    }

    activeController = new AbortController();

    void run(latestQuery, activeController.signal);
  }

  return { input, retry };
}
