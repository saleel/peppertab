// @ts-check

class Link {
  /**
   * @param {{ _id?: string, siteName: string; hostname: string, url: string; logoBase64: String, createdAt?: Date; }} props
   */
  constructor(props) {
    const {
      _id, siteName, url, hostname, logoBase64, createdAt = new Date(),
    } = props;

    if (_id !== undefined) {
      this.id = _id;
      this._id = _id;
    }


    this.siteName = siteName;
    this.url = url;
    this.hostname = hostname;
    this.logoBase64 = logoBase64;
    this.createdAt = createdAt;
  }
}

export default Link;
