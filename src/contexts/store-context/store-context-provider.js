/* eslint-disable react/no-this-in-sfc */
// @ts-check

import React from 'react';
import PropTypes from 'proptypes';
// import PouchDB from 'pouchdb';
// import replicationStream from 'pouchdb-replication-stream';
// import load from 'pouchdb-load';
import StoreContext from './store-context';
// import AuthContext from '../auth-context';
import TodoStore from '../../model/todo-store';


// PouchDB.plugin({
//   loadIt: load.load,
// });
// PouchDB.plugin(replicationStream.plugin);

// PouchDB.adapter('writableStream', replicationStream.adapters.writableStream);
// const MemoryStream = window.memorystream;


function StoreContextProvider({ children }) {
  // const { userSession } = React.useContext(AuthContext);
  // userSession.loadUserData();
  // const db = new PouchDB('local');
  const todoStore = new TodoStore();

  // async function syncDb() {
  //   // Create remote DB
  //   const remoteDb = new PouchDB('remote');
  //   const response = await userSession.getFile('db.json', {
  //     decrypt: true,
  //   });
  //   remoteDb.loadIt(response || '{}');
  //   console.log('loaded remote');

  //   // Sync remote db with local db
  //   await db.sync(remoteDb);
  //   console.log('sync remote');

  //   // Dump remotedb and then push upload to gaia
  //   const stream = new MemoryStream();
  //   let dbDump = '';
  //   stream.on('data', (chunk) => {
  //     dbDump += chunk.toString();
  //   });
  //   await remoteDb.dump(stream);
  //   console.log('dump remote');

  //   await userSession.putFile('db.json', dbDump, { encrypt: true });
  //   console.log('upload remote');
  // }

  // setInterval(async () => {
  //   try {
  //     await syncDb();
  //   } catch (e) {
  //     console.warn(e);
  //   }
  // }, 30000);

  return (
    <StoreContext.Provider value={{ todoStore }}>
      {children}
    </StoreContext.Provider>
  );
}

StoreContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default StoreContextProvider;
