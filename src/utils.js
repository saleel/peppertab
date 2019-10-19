/**
 * @param {Function} fn
 * @param {number} time
 */
export function debounce(fn, time) {
  let timeout;

  return (...args) => {
    const context = this;

    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
      timeout = null;
      fn.apply(context, args);
    }, time);
  };
}
