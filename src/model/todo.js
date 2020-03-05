// @ts-check

class Todo {
  /**
   * @param {{ _id?: string, title: string; isCompleted?: boolean; order: Number?, createdAt?: Date; updatedAt?: Date; }} props
   */
  constructor(props) {
    const {
      _id, title, isCompleted = false, order, createdAt = new Date(), updatedAt,
    } = props;

    if (_id !== undefined) {
      this.id = _id;
      this._id = _id;
    }

    this.title = title;
    this.isCompleted = isCompleted;
    this.order = order;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}

export default Todo;
