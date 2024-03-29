// @ts-check
import Note from './note';
import Store from './store';


class NoteStore extends Store {
  constructor() {
    super('notes');
  }

  /**
   * @param {Note} note
   * @returns {Promise<Note>} Note created
   */
  async createNote(note) {
    const created = await this.db.post({
      ...note,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    this.emitter.emit('change', new Date());

    return this.getNote(created.id);
  }

  /**
   * @returns {Promise<Array<Note>>} All notes
   */
  async findNotes() {
    const { rows } = await this.db.allDocs({ include_docs: true });

    return rows
      .map((row) => new Note(row.doc))
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }

  /**
   * @returns {Promise<Note>} Get note by id
   */
  async getNote(id) {
    const dbNote = await this.db.get(id);
    return new Note(dbNote);
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

    await this.updateItem({
      ...existingNote,
      content,
      updatedAt: new Date(),
    });

    this.emitter.emit('change', new Date());

    return this.getNote(id);
  }


  /**
   * @param {string} id
   */
  async deleteNote(id) {
    const existingNote = await this.db.get(id);
    await this.db.remove(existingNote);
    this.emitter.emit('change', new Date());
  }
}


export default NoteStore;
