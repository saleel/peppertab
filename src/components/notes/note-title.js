import React from 'react';
import PropTypes from 'prop-types';
import { getNoteTitle } from './notes.utils';


function NoteTitle(props) {
  const { note, isActive, onClick } = props;

  const title = React.useMemo(() => getNoteTitle(note), [note]);

  let className = 'notes__list-item';
  if (isActive) {
    className += ' notes__list-item--active';
  }


  return (
    <button type="button" className={className} onClick={() => onClick(note)}>
      <div className="notes__list-item-title">{title}</div>
      <div className="notes__list-item-date">{new Date(note.createdAt).toDateString()}</div>
    </button>
  );
}


NoteTitle.propTypes = {
  note: PropTypes.shape({
    id: PropTypes.string,
    createdAt: PropTypes.oneOfType([
      PropTypes.instanceOf(Date),
      PropTypes.string,
    ]).isRequired,
  }).isRequired,
  isActive: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
};


NoteTitle.defaultProps = {
  isActive: false,
};


export default NoteTitle;
