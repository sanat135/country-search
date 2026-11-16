import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { debounce } from '../src/debounce';

describe('debounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('waits before calling the function', () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 300);

    debounced('Spain');

    vi.advanceTimersByTime(299);
    expect(fn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1);
    expect(fn).toHaveBeenCalledWith('Spain');
  });

  it('resets the timer after repeated calls', () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 300);

    debounced('sp');
    vi.advanceTimersByTime(200);

    debounced('spain');
    vi.advanceTimersByTime(300);

    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith('spain');
  });

  it('can cancel a pending call', () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 300);

    debounced('Japan');
    debounced.cancel();

    vi.advanceTimersByTime(300);

    expect(fn).not.toHaveBeenCalled();
  });
});
