import { describe, expect, it } from 'vitest';
import { classifyError } from '../src/errors';
import { HttpError } from '../src/api';

describe('classifyError', () => {
  it('ignores AbortError', () => {
    const error = new DOMException('Aborted', 'AbortError');

    expect(classifyError(error)).toEqual({
      kind: 'aborted',
    });
  });

  it('handles TimeoutError separately', () => {
    const error = new DOMException('Timeout', 'TimeoutError');

    expect(classifyError(error)).toEqual({
      kind: 'error',
      message: 'Request timed out. Please try again.',
    });
  });

  it('handles HTTP 404 as empty results', () => {
    expect(classifyError(new HttpError(404))).toEqual({
      kind: 'empty',
    });
  });

  it('handles other HTTP errors', () => {
    expect(classifyError(new HttpError(500))).toEqual({
      kind: 'error',
      message: 'Server error (500). Please try again.',
    });
  });

  it('handles network errors', () => {
    expect(classifyError(new TypeError('Failed to fetch'))).toEqual({
      kind: 'error',
      message: 'Network error. Please try again.',
    });
  });
});
