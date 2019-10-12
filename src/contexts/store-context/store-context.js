import React from 'react';
import TodoStore from '../../model/todo-store';


/**
 * @type {{ todoStore: TodoStore }}
 */
const defaultValues = { todoStore: null };

const StoreContext = React.createContext(defaultValues);


export default StoreContext;
