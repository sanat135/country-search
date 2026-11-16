import { HttpError } from './api.js';

export type ErrorResult =
  { kind: 'aborted' } | { kind: 'empty' } | { kind: 'error'; message: string };

export function classifyError(error: unknown): ErrorResult {
  if (error instanceof Error && error.name === 'AbortError') {
    return { kind: 'aborted' };
  }

  if (error instanceof Error && error.name === 'TimeoutError') {
    return {
      kind: 'error',
      message: 'Request timed out. Please try again.',
    };
  }

  if (error instanceof HttpError) {
    if (error.status === 404) {
      return { kind: 'empty' };
    }

    return {
      kind: 'error',
      message: `Server error (${error.status}). Please try again.`,
    };
  }

  return {
    kind: 'error',
    message: 'Network error. Please try again.',
  };
}
