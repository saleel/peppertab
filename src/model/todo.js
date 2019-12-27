// @ts-check

class Todo {
  /**
   * @param {{ _id?: string, title: string; isCompleted?: boolean; createdAt?: Date; updatedAt?: Date; }} props
   */
  constructor(props) {
    const {
      _id, title, isCompleted = false, createdAt = new Date(), updatedAt,
    } = props;

    if (_id !== undefined) {
      this.id = _id;
      this._id = _id;
    }

    this.title = title;
    this.isCompleted = isCompleted;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}

export default Todo;
