
/**
   * @param {import("../../model/note").default} note
   */
function getNoteTitle(note) {
  const html = (note.content || '')
    .replace('</p>', '</p>\n')
    .replace('</h2>', '</h2>\n')
    .replace('</h3>', '</h3>\n')
    .replace('</h4>', '</h4>\n');

  const tmpNote = document.createElement('DIV');
  tmpNote.innerHTML = html;
  const text = tmpNote.textContent || tmpNote.innerText;

  const words = text.split('\n')
    .map((t) => t.trim())
    .filter((t) => t.length > 0);

  const result = words[0] || 'New Note';
  return result;
}


export { getNoteTitle };
