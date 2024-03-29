// @ts-check

import React from 'react';
import TrashIcon from '@iconscout/react-unicons/icons/uil-trash';
import PlusIcon from '@iconscout/react-unicons/icons/uil-plus';
import formatDistance from 'date-fns/formatDistance';
import StoreContext from '../../contexts/store-context';
import Note from '../../model/note';
import Card from '../card';
import usePromise from '../../hooks/use-promise';
import NoteTitle from './note-title';
import useInterval from '../../hooks/use-interval';
import './notes.scss';

const HtmlEditor = React.lazy(() => import('../html-editor/html-editor'));


function Notes() {
  const { noteStore } = React.useContext(StoreContext);

  const editorEl = React.useRef(null);
  const [activeNote, setActiveNote] = React.useState();
  const [isEditing, setIsEditing] = React.useState(false);
  const [currentTime, setCurrentTime] = React.useState(new Date());


  useInterval(() => {
    setCurrentTime(new Date());
  }, 60 * 1000);

  const [notes, { reFetch, isFetching }] = usePromise(
    () => noteStore.findNotes(), { defaultValue: [] },
  );


  const defaultNote = new Note({ content: '', createdAt: new Date(), updatedAt: new Date() });
  let notesToRender = notes;
  if (!isFetching && !(notes && notes.length)) {
    notesToRender = [defaultNote]; // Render a dummy new note
  }


  async function createNoteAndSetActive() {
    const createdNote = await noteStore.createNote(defaultNote);
    setActiveNote(createdNote);
    return reFetch();
  }

  async function updateActiveNoteContent() {
    // Create one if its a default note
    if (!activeNote.id && activeNote.content) {
      await noteStore.createNote(activeNote);
      await reFetch();
    } else {
      await noteStore.updateNote(activeNote.id, activeNote);
      await reFetch();
    }
  }

  React.useEffect(() => {
    const unbind = noteStore.on('sync', () => { reFetch(); });

    return () => { unbind(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  // Create a new note if there are no notes
  React.useEffect(() => {
    if (!notes) return;

    if (notes.length === 0) {
      setActiveNote(defaultNote);
      return;
    }

    // Set first note as active if none present
    if (!activeNote || !notes.find((n) => n.id === activeNote.id)) {
      setActiveNote(notes[0]);
    } else if (activeNote) {
      notes.find((n) => n.id === activeNote.id);
      if (!isEditing) {
        // If the active note was updated while sync
        setActiveNote(notes.find((n) => n.id === activeNote.id));
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notes]);


  // Save the data to store when user stops typing for half second
  React.useEffect(() => {
    if (!activeNote || !isEditing) return;

    const timer = setTimeout(() => {
      updateActiveNoteContent();
    }, 500);

    return () => { clearTimeout(timer); }; // eslint-disable-line consistent-return

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeNote && activeNote.content]);


  /**
   * @param {Note} note
   */
  async function onListItemClick(note) {
    await updateActiveNoteContent();
    // reFetch();
    setActiveNote(note);
  }


  function onEditorChange(_, editor) {
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


  const actions = [
    (
      <button key="create" type="button" className="notes__create" onClick={() => onCreateClick()}>
        <PlusIcon size="22" />
      </button>
    ),
  ];


  function renderNoteListItem(note) {
    const isActiveNote = activeNote && (activeNote.id === note.id);
    const noteToRender = isActiveNote ? activeNote : note;

    return (
      <NoteTitle
        key={noteToRender.id || 'new'}
        note={noteToRender}
        onClick={() => onListItemClick(note)}
        isActive={isActiveNote}
      />
    );
  }


  return (
    <Card title="Notes" className="notes fade-in" contentClassName="flex flex-row" actions={actions}>

      <div className="notes__list">
        {notesToRender.map(renderNoteListItem)}
      </div>

      <div className="notes__editor-container">
        {activeNote && (
          <React.Suspense fallback={null}>
            <HtmlEditor
              ref={editorEl}
              className="notes__editor"
              data={activeNote.content}
              onChange={onEditorChange}
              onFocus={() => { setIsEditing(true); }}
              onBlur={() => { setIsEditing(false); }}
            />

              {activeNote.id && (
              <div className="notes__editor-footer">
                <>
                  <div className="notes__save-info">
                    {'Saved '}
                    {formatDistance(new Date(activeNote.updatedAt), currentTime)}
                    {' ago'}
                  </div>

                  <button type="button" className="notes__btn-delete" onClick={onDeleteClick}>
                    <TrashIcon size="15" />
                  </button>
                </>
              </div>
              )}
          </React.Suspense>
        )}
      </div>

    </Card>
  );
}


export default React.memo(Notes);
