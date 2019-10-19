
/**
   * @param {Note} note
   */
function getNoteTitle(note) {
  const tmpNote = document.createElement('DIV');
  tmpNote.innerHTML = note.content;
  const text = tmpNote.textContent || tmpNote.innerText || 'Untitled';
  return text.slice(0, 10);
}


export { getNoteTitle };
