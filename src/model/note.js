// @ts-check

class Note {
  /**
   * @param {{ id?: string, content: string; createdAt?: Date; }} props
   */
  constructor(props) {
    const {
      id, content, createdAt = new Date(),
    } = props;

    if (id !== undefined) {
      this.id = id;
    }

    this.content = content;
    this.createdAt = createdAt;
  }
}

export default Note;
