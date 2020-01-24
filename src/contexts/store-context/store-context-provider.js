// @ts-check

import React from 'react';
import PropTypes from 'prop-types';
import StoreContext from './store-context';
import TodoStore from '../../model/todo-store';
import NoteStore from '../../model/note-store';
import GeneralStore from '../../model/general-store';
import LinkStore from '../../model/link-store';


function StoreContextProvider({ children }) {
  const todoStore = new TodoStore();
  const noteStore = new NoteStore();
  const generalStore = new GeneralStore();
  const linkStore = new LinkStore();


  const value = {
    generalStore,
    todoStore,
    noteStore,
    linkStore,
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
