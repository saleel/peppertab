import React from 'react';
import { differenceInSeconds } from 'date-fns';


const PouchDB = require('pouchdb').default;


const defaultBackgroundCache = {
  id: 'oMpAz-DN-9I',
  imageUrl: '/assets/bg.jpg',
  color: '#6D4A43',
  height: 3168,
  width: 4752,
  user: 'Greg Rakozy',
  userUrl: 'https://unsplash.com/@grakozy?utm_source=PepperTab&utm_medium=referral',
  location: 'Spiral Jetty, United States',
  link: 'https://unsplash.com/@grakozy?utm_source=PepperTab&utm_medium=referral',
  source: 'Unsplash',
  sourceUrl: 'https://unsplash.com/?utm_source=PepperTab&utm_medium=referral',
};

class Cache {
  constructor() {
    this.cacheDb = new PouchDB('cache');
  }

  async get(key) {
    let cachedData;

    try {
      cachedData = await this.cacheDb.get(key);
    } catch (error) {
      if (error.status === 404 && key === 'BACKGROUND') {
        cachedData = await this.cacheDb.post({
          _id: key,
          data: defaultBackgroundCache,
          storedAt: new Date('2019-01-01'), // An old date
        });

        cachedData = await this.cacheDb.get(key);
      }
    }

    return cachedData;
  }

  async set(key, data) {
    const newDoc = {
      _id: key,
      data,
      storedAt: new Date(),
    };

    try {
      const originalDoc = await this.cacheDb.get(key);
      // eslint-disable-next-line no-param-reassign
      newDoc._rev = originalDoc._rev;
      return this.cacheDb.put(newDoc);
    } catch (err) {
      if (err.status === 409) {
        return this.updateItem(data);
      } // new doc
      return this.cacheDb.put(newDoc);
    }
  }

  async delete(key) {
    try {
      const originalDoc = await this.cacheDb.get(key);
      await this.cacheDb.remove(originalDoc);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  }
}

const cache = new Cache();


/**
 * @typedef UsePromiseOptions
 * @property [defaultValue] {any}
 * @property [dependencies = []] {Array}
 * @property [conditions = []] {Array}
 * @property [cacheKey] {string}
 * @property [updateWithRevalidated = false] {boolean}
 * @property [cachePeriodInSecs = 10] {number}
 */


/**
 * @template T
 * @param {(() => Promise<T>)} promise
 * @param {UsePromiseOptions} [options]
 * @returns {[T, { isFetching: boolean, isRefetching: boolean, reFetch: Function, error: Error }]}
 */
function usePromise(promise, options = {}) {
  const {
    defaultValue, dependencies = [], cacheKey, updateWithRevalidated = true, cachePeriodInSecs = 10,
    conditions = [],
  } = options;

  const [result, setResult] = React.useState(defaultValue);
  const [isFetching, setIsFetching] = React.useState(false);
  const [error, setError] = React.useState();

  let didCancel = false;


  async function fetch() {
    let hasCacheData = false;

    if (cacheKey) {
      try {
        const cachedData = await cache.get(cacheKey);

        if (cachedData) {
          hasCacheData = true;
          setResult(cachedData.data);

          if (cachedData.storedAt
            && differenceInSeconds(new Date(), new Date(cachedData.storedAt)) < cachePeriodInSecs) {
            return;
          }
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
      }
    }

    setIsFetching(true);

    try {
      const data = await promise();
      if (!didCancel) {
        // In some cases newly fetched data don't have to be updated (updateWithRevalidated = false)
        if (updateWithRevalidated || !hasCacheData) {
          setResult(data);
        }

        if (cacheKey && (data !== null || data !== undefined)) {
          cache.set(cacheKey, data);
        }
      }
    } catch (e) {
      if (!didCancel) {
        // eslint-disable-next-line no-console
        console.error('Error on fetching data', e);
        setError(e);
      }
    }

    setIsFetching(false);
  }


  React.useEffect(() => {
    const allConditionsValid = conditions.every((condition) => {
      if (typeof condition === 'function') return !!condition();
      return !!condition;
    });

    if (!allConditionsValid) return;

    fetch();

    // eslint-disable-next-line consistent-return
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      didCancel = true;
    };
  }, [...dependencies, ...conditions]);


  async function reFetch() {
    if (cacheKey) {
      await cache.delete(cacheKey);
    }
    return fetch();
  }


  return [result, {
    isFetching, reFetch, error,
  }];
}


export default usePromise;
