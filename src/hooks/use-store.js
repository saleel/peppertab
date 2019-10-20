import React from 'react';

/**
 * @template T
 * @param {() => Promise<T>} promise
 * @param {T} [defaultValue]
 * @param {[*]} [dependenies=[]]
 * @returns {[T, { isFetching: boolean, reFetch: Function, error: Error }]}
 */
function useStore(promise, defaultValue, dependenies = []) {
  const [result, setResult] = React.useState(defaultValue);
  const [isFetching, setIsFetching] = React.useState(false);
  const [error, setError] = React.useState();

  const didCancel = React.useRef();

  async function fetch() {
    setIsFetching(true);

    try {
      const data = await promise();
      if (!didCancel.current) {
        setResult(data);
      }
    } catch (e) {
      if (!didCancel.current) {
        console.error('Error on fetching data', e);
        setError(e);
      }
    }
    if (!didCancel.current) {
      setIsFetching(false);
    }
  }

  React.useEffect(() => {
    fetch();
    return () => {
      didCancel.current = true;
    };
  }, dependenies);

  return [result, { isFetching, reFetch: fetch, error }];
}


export default useStore;
