// @ts-check

import React from 'react';
import PropTypes from 'prop-types';
import { differenceInMinutes } from 'date-fns';
import StoreContext from './store-context';
import TodoStore from '../../model/todo-store';
import NoteStore from '../../model/note-store';
import GeneralStore from '../../model/general-store';
import AuthContext from '../auth-context';
import LinkStore from '../../model/link-store';
import { debounce } from '../../utils';


function StoreContextProvider({ children }) {
  const todoStore = new TodoStore();
  const noteStore = new NoteStore();
  const generalStore = new GeneralStore();
  const linkStore = new LinkStore();

  const { userSession, isLoggedIn } = React.useContext(AuthContext);

  const isUserLoggedIn = isLoggedIn();

  const [isSyncing, setIsSyncing] = React.useState(false);
  const [lastSyncTime, setLastSyncTime] = React.useState(generalStore.getLastSyncTime());
  const [syncError, setSyncError] = React.useState();


  async function syncDb(store) {
    if (!window.navigator.onLine) return;

    try {
      // Get backup from blockstack
      const fileName = `${store.name}-db.json`;
      const dump = await userSession.getFile(fileName, { decrypt: true });

      // Restore dump
      await store.merge(dump);

      // Dump the synced DB
      const dbDump = await store.dump();

      // Push db dump back to blockstack
      await userSession.putFile(fileName, dbDump, { encrypt: true });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Sync error', error);
      throw error;
    }
  }

  const syncAll = debounce(async () => {
    try {
      if (isSyncing) return;

      if (!isUserLoggedIn) return;

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


  // @ts-ignore
  window.syncAll = syncAll;


  // Sync once on page load
  React.useEffect(() => {
    if (lastSyncTime && differenceInMinutes(new Date(), lastSyncTime) < 1) {
      return;
    }

    syncAll();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastSyncTime]);


  const value = {
    generalStore,
    todoStore,
    noteStore,
    linkStore,
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
