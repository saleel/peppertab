
/**
   * @param {Note} note
   */
function getNoteTitle(note) {
  const tmpNote = document.createElement('DIV');
  tmpNote.innerHTML = note.content;
  const text = tmpNote.textContent || tmpNote.innerText || 'New Note';
  return text.slice(0, 10);
}


export { getNoteTitle };
