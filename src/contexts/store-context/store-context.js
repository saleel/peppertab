import React from 'react';


/**
 * @type {{
 *  generalStore: import('../../model/general-store').default,
 *  todoStore: import('../../model/todo-store').default,
 *  noteStore: import('../../model/note-store').default
 *  linkStore: import('../../model/link-store').default
 * }}
 */
const defaultValues = {
  generalStore: null,
  todoStore: null,
  notesStore: null,
  linkStore: null,
};

const StoreContext = React.createContext(defaultValues);


export default StoreContext;
