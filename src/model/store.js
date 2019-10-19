import PouchDB from 'pouchdb';
import replicationStream from 'pouchdb-replication-stream';
import load from 'pouchdb-load';
import EventEmitter from 'nanoevents';


PouchDB.plugin({
  loadIt: load.load,
});
PouchDB.plugin(replicationStream.plugin);

PouchDB.adapter('writableStream', replicationStream.adapters.writableStream);
const MemoryStream = window.memorystream;


class Store {
  constructor(name) {
    this.name = name;
    this.db = new PouchDB(name);

    this.emitter = new EventEmitter({});
    this.on = this.emitter.on.bind(this.emitter);
  }

  async restore(dump) {
    // Create temporary DB
    const tempDb = new PouchDB(`${this.name.name}-temp-${new Date().getTime()}`);

    // Load backup
    tempDb.loadIt(dump);

    // Sync temp db with current db
    await this.db.sync(tempDb);

    // DEstroy temp db
    await tempDb.destroy();
  }


  async dump() {
    const stream = new MemoryStream();
    let dbDump = '';
    stream.on('data', (chunk) => {
      dbDump += chunk.toString();
    });
    await this.db.dump(stream);

    return dbDump;
  }
}


export default Store;
