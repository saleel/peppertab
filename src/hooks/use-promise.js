import React from 'react';
import PouchDB from 'pouchdb';
import { differenceInSeconds } from 'date-fns';


const cacheDb = new PouchDB('cache');


/**
 * @typedef UsePromiseOptions
 * @property [defaultValue] {any}
 * @property [dependencies = []] {[*]}
 * @property [cacheKey] {string}
 * @property [updateWithRevalidated = false] {boolean}
 * @property [cachePeriodInSecs = 10] {number}
 */


/**
 * @template T
 * @param {() => Promise<T>} promise
 * @param {UsePromiseOptions} [options]
 * @returns {[T, { isFetching: boolean, reFetch: Function, error: Error }]}
 */
function usePromise(promise, options) {
  const {
    defaultValue, dependencies = [], cacheKey, updateWithRevalidated = true, cachePeriodInSecs = 10,
  } = options;

  const [result, setResult] = React.useState(defaultValue);
  const [isFetching, setIsFetching] = React.useState(true);
  const [error, setError] = React.useState();


  let didCancel = false;

  async function updateCache(newResult) {
    const newDoc = {
      _id: cacheKey,
      result: newResult,
      fetchedAt: new Date(),
    };

    try {
      const originalDoc = await cacheDb.get(cacheKey);
      // eslint-disable-next-line no-param-reassign
      newDoc._rev = originalDoc._rev;
      return cacheDb.put(newDoc);
    } catch (err) {
      if (err.status === 409) {
        return this.updateItem(newResult);
      } // new doc
      return cacheDb.put(newDoc);
    }
  }

  async function fetch() {
    if (cacheKey) {
      try {
        const cachedData = await cacheDb.get(cacheKey);

        if (cachedData) {
          setResult(cachedData.result);

          if (cachedData.fetchedAt
          && differenceInSeconds(new Date(), new Date(cachedData.fetchedAt)) < cachePeriodInSecs) {
            return;
          }
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        // console.error(e);
        // DO NOTHING
      }
    }

    setIsFetching(true);

    try {
      const data = await promise();
      if (!didCancel) {
        if (updateWithRevalidated || !result) { // If result is already set and not needed to update wutg fresh data
          setResult(data);
        }

        if (cacheKey) {
          updateCache(data);
        }
      }
    } catch (e) {
      if (!didCancel) {
        // eslint-disable-next-line no-console
        console.error('Error on fetching data', e);
        setError(e);
      }
    }
    if (!didCancel) {
      setIsFetching(false);
    }
  }

  React.useEffect(() => {
    fetch();
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      didCancel = true;
    };
  }, dependencies);

  return [result, { isFetching, reFetch: fetch, error }];
}


export default usePromise;
