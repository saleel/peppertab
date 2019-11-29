// @ts-check

class Link {
  /**
   * @param {{ _id?: string, siteName: string; hostname: string, url: string; createdAt?: Date; }} props
   */
  constructor(props) {
    const {
      _id, siteName, url, hostname, createdAt = new Date(),
    } = props;

    if (_id !== undefined) {
      this.id = _id;
      this._id = _id;
    }

    this.siteName = siteName;
    this.url = url;
    this.hostname = hostname;
    this.createdAt = createdAt;
  }
}

export default Link;
