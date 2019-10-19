// @ts-check

class Note {
  /**
   * @param {{ id?: string, content: string; createdAt?: Date; updatedAt?: Date; }} props
   */
  constructor(props) {
    const {
      id, content, createdAt, updatedAt,
    } = props;

    if (id !== undefined) {
      this.id = id;
    }

    this.content = content;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}

export default Note;
