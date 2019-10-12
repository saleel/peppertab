// @ts-check

class Todo {
  /**
   * @param {{ id?: string, title: string; isCompleted?: boolean; createdAt?: Date; }} props
   */
  constructor(props) {
    const {
      id, title, isCompleted = false, createdAt = new Date(),
    } = props;

    if (id !== undefined) {
      this.id = id;
    }

    this.title = title;
    this.isCompleted = isCompleted;
    this.createdAt = createdAt;
  }
}

export default Todo;
