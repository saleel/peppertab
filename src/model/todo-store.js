// @ts-check
import PouchDB from 'pouchdb';
import Todo from './todo';


class TodoStore {
  constructor() {
    this.db = new PouchDB('todos');
  }

  /**
   * @param {Todo} todo
   */
  async createTodo(todo) {
    await this.db.post(todo);
  }

  /**
   * @returns {Promise<Array<Todo>>} All todos
   */
  async findTodos() {
    const { rows } = await this.db.allDocs({ include_docs: true });
    return rows
      .map((row) => new Todo({ ...row.doc, id: row.id }))
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }

  /**
   * @param {string} id
   * @param {Todo} todo
   */
  async updateTodo(id, todo) {
    const { isCompleted } = todo;

    const existingTodo = await this.db.get(id);

    await this.db.put({
      ...existingTodo,
      isCompleted,
    });
  }
}


export default TodoStore;
