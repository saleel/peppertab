// @ts-check
import Link from './link';
import Store from './store';


class LinkStore extends Store {
  constructor() {
    super('links');
  }


  /**
   * @returns {Promise<Link>} Get link by id
   */
  async getLink(id) {
    const dbLink = await this.db.get(id);
    return new Link(dbLink);
  }


  /**
   * @param {Link} link
   * @returns {Promise<Link>} link
   */
  async createLink(link) {
    const response = await this.db.post({
      ...link,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    this.emitter.emit('change', new Date());
    return this.getLink(response.id);
  }


  /**
   * @returns {Promise<Array<Link>>} All links
   */
  async findLinks({ limit }) {
    const { rows } = await this.db.allDocs({ include_docs: true });
    return rows
      .map((row) => new Link(row.doc))
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
      .slice(0, limit);
  }


  /**
   * @param {String} id
   */
  async deleteLink(id) {
    const link = await this.db.get(id);
    await this.db.remove(link);
  }
}


export default LinkStore;
