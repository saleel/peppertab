import PouchDB from 'pouchdb';
import replicationStream from 'pouchdb-replication-stream';
import load from 'pouchdb-load';
import EventEmitter from 'nanoevents';


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

  async restore(dump) {
    // Create temporary DB
    const tempDb = new PouchDB(`${this.name}-temp-${new Date().getTime()}`);

    // Load backup
    tempDb.loadIt(dump);

    // Sync temp db with current db
    await this.db.sync(tempDb);

    // DEstroy temp db
    await tempDb.destroy();
  }


  async dump() {
    const MemoryStream = window.memorystream;
    if (!MemoryStream) {
      throw new Error('MemoryStream not loaded');
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
