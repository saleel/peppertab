// @ts-check
import PouchDB from 'pouchdb';
import Note from './note';


class NoteStore {
  constructor() {
    this.db = new PouchDB('notes');
  }

  /**
   * @param {Note} note
   * @returns {Promise<Note>} Note created
   */
  async createNote(note) {
    const response = await this.db.post({
      ...note,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return this.db.get(response.id);
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
   * @returns {Promise<Note>} Note created
   */
  async updateNote(id, note) {
    const { content } = note;

    const existingNote = await this.db.get(id);

    if (existingNote.content === content) {
      return existingNote; // Nothing to update
    }

    await this.db.put({
      ...existingNote,
      content,
      updatedAt: new Date(),
    });

    return this.db.get(id);
  }


  /**
   * @param {string} id
   */
  async deleteNote(id) {
    const existingNote = await this.db.get(id);
    await this.db.remove(existingNote);
  }
}


export default NoteStore;
