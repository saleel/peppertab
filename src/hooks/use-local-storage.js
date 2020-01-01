import createPersistedState from 'use-persisted-state';


/**
 *
 * @param {String} key
 * @param {any} [initialValue]
 */
function useLocalStorage(key, initialValue = '') {
  const usePersistedLocalStorage = createPersistedState(key);

  return usePersistedLocalStorage(initialValue);
}


export default useLocalStorage;
