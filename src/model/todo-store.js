// @ts-check
import Todo from './todo';
import Store from './store';


class TodoStore extends Store {
  constructor() {
    super('todos');
  }


  /**
   * @returns {Promise<Todo>} Get todo by id
   */
  async getTodo(id) {
    const dbTodo = await this.db.get(id);
    return new Todo(dbTodo);
  }


  /**
   * @param {Todo} todo
   * @returns {Promise<Todo>} todo
   */
  async createTodo(todo) {
    const response = await this.db.post({
      ...todo,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    this.emitter.emit('change', new Date());
    return this.getTodo(response.id);
  }


  /**
   * @returns {Promise<Array<Todo>>} All todos
   */
  async findTodos() {
    const { rows } = await this.db.allDocs({ include_docs: true });
    return rows
      .map((row) => new Todo(row.doc))
      .sort((a, b) => {
        // If both are complete
        if (a.isCompleted && b.isCompleted) {
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        }

        // If neither is complete
        if (!a.isCompleted && !b.isCompleted) {
          if (Number.isInteger(a.order) && Number.isInteger(b.order)) {
            return Number(a.order) - Number(b.order);
          }

          return new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
        }

        // Sort completed items to end
        return Number(a.isCompleted) - Number(b.isCompleted);
      });
  }


  /**
   * @param {string} id
   * @param {Object} todo
   */
  async updateTodo(id, todo) {
    const { title, isCompleted, order } = todo;

    const existingTodo = await this.db.get(id);

    await this.updateItem({
      ...existingTodo,
      ...(title !== undefined) && { title },
      ...(isCompleted !== undefined) && { isCompleted },
      ...(order !== undefined) && { order },
      updatedAt: new Date(),
    });

    this.emitter.emit('change', new Date());

    return this.getTodo(id);
  }


  /**
   * @param {string} id
   */
  async deleteTodo(id) {
    const existingTodo = await this.db.get(id);
    await this.db.remove(existingTodo);
  }
}


export default TodoStore;
