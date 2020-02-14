import PouchDB from 'pouchdb/lib/index.es';
import load from 'pouchdb-load';
import EventEmitter from 'nanoevents';
import replicationStream from 'pouchdb-replication-stream/dist/pouchdb.replication-stream.min';
import { loadScript } from '../utils';


PouchDB.plugin({
  loadIt: load.load,
});
PouchDB.plugin(replicationStream.plugin);

PouchDB.adapter('writableStream', replicationStream.adapters.writableStream);


class Store {
  constructor(name) {
    this.name = name;
    this.db = new PouchDB(name);

    this.emitter = new EventEmitter({});
    this.on = this.emitter.on.bind(this.emitter);
  }

  async merge(dump) {
    // Create temporary DB
    const tempDb = new PouchDB(`temp-${this.name}`);

    // Load backup
    tempDb.loadIt(dump);

    // Sync temp db with current db
    await tempDb.sync(this.db);

    // DEstroy temp db
    await tempDb.destroy();

    this.emitter.emit('sync', new Date());
  }


  async dump() {
    let MemoryStream = window.memorystream;
    if (!MemoryStream) {
      await loadScript('memorystream.js');
      MemoryStream = window.memorystream;
    }

    const stream = new MemoryStream();
    let dbDump = '';
    stream.on('data', (chunk) => {
      dbDump += chunk.toString();
    });
    await this.db.dump(stream);

    return dbDump;
  }

  async updateItem(doc) {
    try {
      const originalDoc = await this.db.get(doc._id);
      // eslint-disable-next-line no-param-reassign
      doc._rev = originalDoc._rev;
      return this.db.put(doc);
    } catch (err) {
      if (err.status === 409) {
        return this.updateItem(doc);
      } // new doc
      return this.db.put(doc);
    }
  }
}


export default Store;
