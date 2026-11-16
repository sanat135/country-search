export type ErrorResult =
  { kind: 'aborted' } | { kind: 'empty' } | { kind: 'error'; message: string };

export function classifyError(error: unknown): ErrorResult {
  void error;
  throw new Error('Not implemented');
}
