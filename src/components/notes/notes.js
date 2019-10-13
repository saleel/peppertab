// @ts-check

import React from 'react';
import CKEditor from '@ckeditor/ckeditor5-react';
import BalloonEditor from '@ckeditor/ckeditor5-build-balloon';
import StoreContext from '../../contexts/store-context';
import useStore from '../../hooks/use-store';
import './notes.scss';
import Note from '../../model/note';
import Card from '../card';


function Notes() {
  const { noteStore } = React.useContext(StoreContext);
  const [notes, { reFetch }] = useStore(() => noteStore.findNotes());

  const editorEl = React.useRef(null);
  const [activeNote, setActiveNote] = React.useState();


  function createDefaultNote() {
    return noteStore.createNote(new Note({ content: '<h1>New note</h1>' }));
  }

  function getTitle(note) {
    return note.content.replace(/<[^>]*>/g, '').split(' ')[0];
  }

  function onEditoreChange(_, editor) {
    const data = editor.getData();
    setActiveNote((an) => ({ ...an, content: data }));
  }

  function onListItemClick(note) {
    setActiveNote(note);
  }


  // Create a new note if there are no notes
  React.useEffect(() => {
    if (!notes) return;

    if (notes.length === 0) {
      createDefaultNote().then(() => reFetch());
    } else {
      setActiveNote(notes[0]);
    }
  }, [notes]);


  // Save the data to store when user stops typing for one second
  React.useEffect(() => {
    if (!activeNote) return;

    const timer = setTimeout(() => {
      noteStore.updateNote(activeNote.id, activeNote);
    }, 1000);

    return () => { clearTimeout(timer); }; // eslint-disable-line consistent-return
  }, [activeNote]);


  if (!notes || !activeNote) {
    return null;
  }

  return (
    <Card title="Notes" className="notes">

      <div className="flex h-full">

        <div className="notes__list">
          {notes.map((note) => {
            const isActiveNote = activeNote.id === note.id;
            const title = isActiveNote ? getTitle(activeNote) : getTitle(note);

            let className = 'notes__list-item';
            if (isActiveNote) {
              className += ' notes__list-item--active';
            }

            return (
              <button type="button" className={className} onClick={() => onListItemClick(note)}>
                <div className="notes__list-item-title">{title}</div>
                <div className="notes__list-item-date">{new Date(note.createdAt).toDateString()}</div>
              </button>
            );
          })}

          {/* <button type="button" onClick={() => createDefaultNote().then(() => reFetch().then(() => { console.log(editorEl.current.editor.editing.view.focus()); }))}>CREATE</button> */}
        </div>

        <div className="notes__editor">
          {activeNote && (
            <CKEditor
              ref={editorEl}
              className="notes__editor"
              editor={BalloonEditor}
              data={activeNote.content}
              onChange={onEditoreChange}
            />
          )}
        </div>

      </div>
    </Card>
  );
}


export default Notes;
