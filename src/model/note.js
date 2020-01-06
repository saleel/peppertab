// @ts-check

class Note {
  /**
   * @param {{ _id?: string, title:string, content: string; createdAt?: Date; updatedAt?: Date; }} props
   */
  constructor(props) {
    const {
      _id, title, content, createdAt, updatedAt,
    } = props;

    if (_id !== undefined) {
      this.id = _id;
      this._id = _id;
    }

    this.title = title;
    this.content = content;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}

export default Note;
