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


export async function loadScript(path) {
  await new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = path;
    script.async = true;
    script.onload = () => {
      resolve();
    };

    script.onerror = () => {
      reject(new Error('Unable to load memory stream'));
    };

    document.body.appendChild(script);
  });
}
