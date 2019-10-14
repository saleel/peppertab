// @ts-check
import PouchDB from 'pouchdb';
import Todo from './todo';


class TodoStore {
  constructor() {
    this.db = new PouchDB('todos');
  }

  /**
   * @param {Todo} todo
   * @returns {Promise<Todo>} todo
   */
  async createTodo(todo) {
    const response = await this.db.post(todo);
    return this.db.get(response.id);
  }

  /**
   * @returns {Promise<Array<Todo>>} All todos
   */
  async findTodos() {
    const { rows } = await this.db.allDocs({ include_docs: true });
    return rows
      .map((row) => new Todo({ ...row.doc, id: row.id }))
      .sort((a, b) => {
        // Sort completed items to end
        const completedDiff = Number(a.isCompleted) - Number(b.isCompleted);
        if (completedDiff !== 0) {
          return completedDiff;
        }

        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      });
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
