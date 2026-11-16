export function debounce<Args extends unknown[]>(fn: (...args: Args) => void, delay: number) {
  let timer: ReturnType<typeof setTimeout> | undefined;

  const cancel = () => {
    clearTimeout(timer);
    timer = undefined;
  };

  const debounced = (...args: Args) => {
    cancel();

    timer = setTimeout(() => {
      timer = undefined;
      fn(...args);
    }, delay);
  };

  return Object.assign(debounced, { cancel });
}
