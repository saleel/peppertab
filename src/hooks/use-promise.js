// @ts-check

import React from 'react';
import { differenceInSeconds } from 'date-fns';


// const PouchDB = require('pouchdb').default;


// const defaultBackgroundCache = {
//   id: 'oMpAz-DN-9I',
//   imageUrl: '/assets/bg.jpg',
//   color: '#6D4A43',
//   height: 3168,
//   width: 4752,
//   user: 'Greg Rakozy',
//   userUrl: 'https://unsplash.com/@grakozy?utm_source=PepperTab&utm_medium=referral',
//   location: 'Spiral Jetty, United States',
//   link: 'https://unsplash.com/@grakozy?utm_source=PepperTab&utm_medium=referral',
//   source: 'Unsplash',
//   sourceUrl: 'https://unsplash.com/?utm_source=PepperTab&utm_medium=referral',
// };

// class Cache {
//   constructor() {
//     this.cacheDb = new PouchDB('cache');
//   }

//   async get(key) {
//     let cachedData;

//     try {
//       cachedData = await this.cacheDb.get(key);
//     } catch (error) {
//       if (error.status === 404 && key === 'BACKGROUND') {
//         cachedData = await this.cacheDb.post({
//           _id: key,
//           data: defaultBackgroundCache,
//           storedAt: new Date('2019-01-01'), // An old date
//         });

//         cachedData = await this.cacheDb.get(key);
//       }
//     }

//     return cachedData;
//   }

//   async set(key, data) {
//     const newDoc = {
//       _id: key,
//       data,
//       storedAt: new Date(),
//     };

//     try {
//       const originalDoc = await this.cacheDb.get(key);
//       // eslint-disable-next-line no-param-reassign
//       newDoc._rev = originalDoc._rev;
//       return this.cacheDb.put(newDoc);
//     } catch (err) {
//       if (err.status === 409) {
//         return this.updateItem(data);
//       } // new doc
//       return this.cacheDb.put(newDoc);
//     }
//   }

//   async delete(key) {
//     try {
//       const originalDoc = await this.cacheDb.get(key);
//       await this.cacheDb.remove(originalDoc);
//     } catch (error) {
//       // eslint-disable-next-line no-console
//       console.error(error);
//     }
//   }
// }

// const cache = new Cache();

const cache = {
  get(key) {
    if (!key) return undefined;

    let cachedData;

    try {
      cachedData = window.localStorage.getItem(`cache.${key}`);
      if (cachedData) {
        cachedData = JSON.parse(cachedData);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Cannot read cache', error);
    }

    return cachedData;
  },

  set(key, data) {
    const newDoc = {
      data,
      storedAt: new Date(),
    };

    try {
      window.localStorage.setItem(`cache.${key}`, JSON.stringify(newDoc));
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Cannot set cache', err);
    }
  },

  delete(key) {
    window.localStorage.removeItem(`cache.${key}`);
  },
};


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
 * @returns {[T, { isFetching: boolean, reFetch: Function, reload: Function, error: Error }]}
 */
function usePromise(promise, options = {}) {
  const {
    defaultValue, dependencies = [], cacheKey, updateWithRevalidated = true, cachePeriodInSecs = 10,
    conditions = [],
  } = options;

  let cachedData;
  if (cacheKey) {
    cachedData = cache.get(cacheKey);
  }

  const [result, setResult] = React.useState(cachedData ? cachedData.data : defaultValue);
  const [isFetching, setIsFetching] = React.useState(false);
  const [error, setError] = React.useState();

  let didCancel = false;


  async function fetch() {
    if (cachedData) {
      if (cachedData.storedAt
        && differenceInSeconds(new Date(), new Date(cachedData.storedAt)) < cachePeriodInSecs) {
        return;
      }
    }

    setIsFetching(true);

    try {
      const data = await promise();
      if (!didCancel) {
        // In some cases newly fetched data don't have to be updated (updateWithRevalidated = false)
        if (updateWithRevalidated || cachedData === undefined) {
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
        if (cacheKey) {
          cache.delete(cacheKey);
        }
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


  function reFetch() {
    if (cacheKey) {
      cache.delete(cacheKey);
      cachedData = undefined;
    }
    return fetch();
  }


  function reload() {
    if (cachedData) {
      setResult(cachedData.data);
    }
    return reFetch();
  }


  return [result, {
    isFetching, reFetch, error, reload,
  }];
}


export default usePromise;
