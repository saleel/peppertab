// @ts-check

import React from 'react';
import PropTypes from 'prop-types';
import StoreContext from './store-context';
import TodoStore from '../../model/todo-store';
import NoteStore from '../../model/note-store';
import GeneralStore from '../../model/general-store';
// import { syncDb } from './utils';
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
    if (!isUserLoggedIn || isSyncing) {
      return;
    }

    if (!window.navigator.onLine) return;

    try {
      setIsSyncing(true);

      // Get backup from blockstacks
      const fileName = `${store.name}-db.json`;
      const dump = await userSession.getFile(fileName, { decrypt: true });

      // Restore dump
      store.restore(dump);

      // Dump the synced DB
      const dbDump = await store.dump();

      // Push db dump back to blockstacks
      await userSession.putFile(fileName, dbDump, { encrypt: true });

      setLastSyncTime(new Date());
      generalStore.setLastSyncTime(new Date());
      setIsSyncing(false);
    } catch (e) {
      console.error('Error occured in sync', e);
      setIsSyncing(false);
      setSyncError(e);
    }
  }


  todoStore.on('change', debounce(() => syncDb(todoStore), 3000));
  noteStore.on('change', debounce(() => syncDb(noteStore), 3000));


  // Sync once on page load
  React.useEffect(() => {
    syncDb(todoStore);
    syncDb(noteStore);
  }, [window.navigator.onLine]);


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
