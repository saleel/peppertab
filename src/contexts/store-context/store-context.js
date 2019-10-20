import React from 'react';


/**
 * @type {{
 *  generalStore: import('../../model/general-store').default,
 *  todoStore: import('../../model/todo-store').default,
 *  noteStore: import('../../model/note-store').default
 *  isSyncing: boolean,
 *  lastSyncTime: Date,
 *  syncError: Error
 * }}
 */
const defaultValues = {
  generalStore: null,
  todoStore: null,
  notesStore: null,
  isSyncing: false,
  lastSyncTime: null,
  syncError: null,
};

const StoreContext = React.createContext(defaultValues);


export default StoreContext;
