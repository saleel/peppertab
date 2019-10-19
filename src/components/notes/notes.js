// @ts-check

import React from 'react';
import TrashIcon from '@iconscout/react-unicons/icons/uil-trash';
import PlusIcon from '@iconscout/react-unicons/icons/uil-plus';
import StoreContext from '../../contexts/store-context';
import useStore from '../../hooks/use-store';
import Note from '../../model/note';
import Card from '../card';
import { getNoteTitle } from './notes.utils';
import './notes.scss';
import HtmlEditor from '../html-editor/html-editor';


function Notes() {
  const { noteStore } = React.useContext(StoreContext);
  const [notes, { reFetch }] = useStore(() => noteStore.findNotes());

  const editorEl = React.useRef(null);
  const [activeNote, setActiveNote] = React.useState();
  const [isEditing, setIsEditing] = React.useState(false);


  async function createNoteAndSetActive() {
    const createdNote = await noteStore.createNote(new Note({ content: '' }));
    setActiveNote(createdNote);
    return reFetch();
  }

  async function updateActiveNoteContent() {
    await noteStore.updateNote(activeNote.id, activeNote);
  }


  /**
   * @param {Note} note
   */
  async function onListItemClick(note) {
    await updateActiveNoteContent();
    reFetch();
    setActiveNote(note);
  }


  function onEditoreChange(_, editor) {
    const data = editor.getData();
    setActiveNote((an) => ({ ...an, content: data }));
  }


  async function onCreateClick() {
    await createNoteAndSetActive();

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
      createNoteAndSetActive();
    }

    // Set first note as active if none present
    if (!activeNote || !notes.find((n) => n.id === activeNote.id)) {
      setActiveNote(notes[0]);
    }
  }, [notes]);


  // Save the data to store when user stops typing for half second
  React.useEffect(() => {
    if (!activeNote || !isEditing) return;

    const timer = setTimeout(() => {
      updateActiveNoteContent();
    }, 500);

    return () => { clearTimeout(timer); }; // eslint-disable-line consistent-return
  }, [activeNote]);


  const actions = [
    (
      <button key="create" type="button" className="notes__create" onClick={onCreateClick}>
        <PlusIcon size="22" color="#383530" />
      </button>
    ),
  ];

  function renderNoteListItem(note) {
    const isActiveNote = activeNote.id === note.id;
    const title = isActiveNote ? getNoteTitle(activeNote) : getNoteTitle(note);

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


  if (!notes || !activeNote) {
    return null;
  }


  return (
    <Card title="Notes" className="notes" contentClassName="flex flex-row" actions={actions}>

      <div className="notes__list">
        {notes.map(renderNoteListItem)}
      </div>

      <div className="notes__editor">
        <>
          <HtmlEditor
            ref={editorEl}
            className="notes__editor"
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
