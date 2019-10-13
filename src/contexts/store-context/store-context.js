import React from 'react';


/**
 * @type {{
 *  todoStore: import('../../model/todo-store').default,
 *  noteStore: import('../../model/note-store').default
 * }}
 */
const defaultValues = { todoStore: null, notesStore: null };

const StoreContext = React.createContext(defaultValues);


export default StoreContext;
