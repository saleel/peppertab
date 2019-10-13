// @ts-check
import PouchDB from 'pouchdb';
import Note from './note';


class NoteStore {
  constructor() {
    this.db = new PouchDB('notes');
  }

  /**
   * @param {Note} note
   */
  async createNote(note) {
    await this.db.post(note);
  }

  /**
   * @returns {Promise<Array<Note>>} All notes
   */
  async findNotes() {
    const { rows } = await this.db.allDocs({ include_docs: true });
    return rows
      .map((row) => new Note({ ...row.doc, id: row.id }))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  /**
   * @param {string} id
   * @param {Note} note
   */
  async updateNote(id, note) {
    const { content } = note;

    const existingNote = await this.db.get(id);

    await this.db.put({
      ...existingNote,
      content,
    });
  }
}


export default NoteStore;
