// @ts-check
// import Link from './link';
import Store from './store';


/**
 * @typedef Link
 * @property id {string}
 * @property siteName {string}
 * @property hostName {string}
 * @property url {string}
 * @property createdAt {string}
*/

class LinkStore {
  /**
   * @param {Link} link
   * @returns {Link} link
   */
  createLink(link) {
    const existing = this.findLinks();
    const newLink = { id: link.url, ...link };
    window.localStorage.setItem('links', JSON.stringify([...existing, newLink]));
    return link;
  }


  /**
   * @returns {Array<Link>} All links
   */
  findLinks() {
    const l = window.localStorage.getItem('links');
    if (!l) return [];
    return JSON.parse(l);
  }


  /**
   * @param {String} id
   */
  async deleteLink(id) {
    const existing = this.findLinks();
    window.localStorage.setItem('links', JSON.stringify(existing.filter((l) => l.id === id)));
  }
}


export default LinkStore;
