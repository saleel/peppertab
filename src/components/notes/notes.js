// @ts-check

import React from 'react';
import CKEditor from '@ckeditor/ckeditor5-react';
import BalloonEditor from '@ckeditor/ckeditor5-build-balloon';
import TrashIcon from '@iconscout/react-unicons/icons/uil-trash';
import PlusIcon from '@iconscout/react-unicons/icons/uil-plus';
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
  const [isEditing, setIsEditing] = React.useState(false);


  function createDefaultNote() {
    return noteStore.createNote(new Note({ content: '<h1>New note</h1>' }));
  }


  /**
   * @param {Note} note
   */
  function getTitle(note) {
    const tmpNote = document.createElement('DIV');
    tmpNote.innerHTML = note.content;
    const text = tmpNote.textContent || tmpNote.innerText || 'Untitled';
    return text.slice(0, 10);
  }


  /**
   * @param {Note} note
   */
  function onListItemClick(note) {
    setActiveNote(note);
  }


  function onEditoreChange(_, editor) {
    const data = editor.getData();
    setActiveNote((an) => ({ ...an, content: data }));
  }


  async function onCreateClick() {
    await createDefaultNote();
    reFetch();

    if (editorEl.current.editor) {
      editorEl.current.editor.editing.view.focus();
    }
  }


  async function onDeleteClick() {
    // eslint-disable-next-line no-alert
    if (window.confirm('Are you sure you want to delete the selected note?')) {
      await noteStore.deleteNote(activeNote.id);
      reFetch();
    }
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
    if (!activeNote || !isEditing) return;

    const timer = setTimeout(() => {
      noteStore.updateNote(activeNote.id, activeNote).then(() => reFetch());
    }, 500);

    return () => { clearTimeout(timer); }; // eslint-disable-line consistent-return
  }, [activeNote]);


  if (!notes || !activeNote) {
    return null;
  }


  const actions = [
    (
      <button key="create" type="button" className="notes__create" onClick={onCreateClick}>
        <PlusIcon size="22" color="#383530" />
      </button>
    ),
  ];

  function renderNoteListItem(note) {
    const isActiveNote = activeNote.id === note.id;
    const title = isActiveNote ? getTitle(activeNote) : getTitle(note);

    let className = 'notes__list-item';
    if (isActiveNote) {
      className += ' notes__list-item--active';
    }

    return (
      <button key={note.id} type="button" className={className} onClick={() => onListItemClick(note)}>
        <div className="notes__list-item-title">{title}</div>
        <div className="notes__list-item-date">{new Date(note.createdAt).toDateString()}</div>
      </button>
    );
  }


  return (
    <Card title="Notes" className="notes" contentClassName="flex flex-row" actions={actions}>

      <div className="notes__list">
        {notes.map(renderNoteListItem)}
      </div>

      <div className="notes__editor">
        <>
          <CKEditor
            ref={editorEl}
            className="notes__editor"
            editor={BalloonEditor}
            data={activeNote.content}
            onChange={onEditoreChange}
            onFocus={() => { setIsEditing(true); }}
            onBlur={() => { setIsEditing(false); }}
          />
          <button type="button" className="notes__btn-delete" onClick={onDeleteClick}>
            <TrashIcon size="16" color="#383530" />
          </button>
        </>
      </div>

    </Card>
  );
}


export default Notes;
