// @ts-check

import React from 'react';
import PropTypes from 'prop-types';
import { differenceInMinutes } from 'date-fns';
import StoreContext from './store-context';
import TodoStore from '../../model/todo-store';
import NoteStore from '../../model/note-store';
import GeneralStore from '../../model/general-store';
import AuthContext from '../auth-context';
import { debounce } from '../../utils';


function StoreContextProvider({ children }) {
  const todoStore = new TodoStore();
  const noteStore = new NoteStore();
  const generalStore = new GeneralStore();

  const { userSession } = React.useContext(AuthContext);

  const isUserLoggedIn = userSession.isUserSignedIn();

  const [isSyncing, setIsSyncing] = React.useState(false);
  const [lastSyncTime, setLastSyncTime] = React.useState(generalStore.getLastSyncTime());
  const [syncError, setSyncError] = React.useState();


  async function syncDb(store) {
    if (!isUserLoggedIn || isSyncing) return;

    if (!window.navigator.onLine) return;

    // Get backup from blockstack
    const fileName = `${store.name}-db.json`;
    const dump = await userSession.getFile(fileName, { decrypt: true });

    // Restore dump
    await store.merge(dump);

    // Dump the synced DB
    const dbDump = await store.dump();

    // Push db dump back to blockstack
    await userSession.putFile(fileName, dbDump, { encrypt: true });
  }

  const syncAll = debounce(async () => {
    try {
      setIsSyncing(true);

      await Promise.all([
        syncDb(todoStore),
        syncDb(noteStore),
      ]);

      setLastSyncTime(new Date());
      generalStore.setLastSyncTime(new Date());
      setIsSyncing(false);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Error ocurred in sync', e);
      setIsSyncing(false);
      setSyncError(e);
    }
  }, 3000);


  todoStore.on('change', () => syncAll());
  noteStore.on('change', () => syncAll());


  // Sync once on page load
  React.useEffect(() => {
    if (lastSyncTime && differenceInMinutes(new Date(), lastSyncTime) < 1) {
      return;
    }

    syncAll();
  }, []);


  const value = {
    generalStore,
    todoStore,
    noteStore,
    isSyncing,
    lastSyncTime,
    syncError,
  };


  return (
    <StoreContext.Provider value={value}>
      {children}
    </StoreContext.Provider>
  );
}

StoreContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default StoreContextProvider;
