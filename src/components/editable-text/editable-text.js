// @ts-check

import React from 'react';
import PropTypes from 'prop-types';
import EnterIcon from '@iconscout/react-unicons/icons/uil-enter';
import EditIcon from '@iconscout/react-unicons/icons/uil-pen';
import './editable-text.scss';


function EditableText(props) {
  const { value: defaultValue = '', onSubmit, ...restProps } = props;

  const inputRef = React.useRef(null);
  const [value, setValue] = React.useState(defaultValue);
  const [isEditMode, setIsEditMode] = React.useState(false);


  function handleSubmit() {
    if (!value) {
      return;
    }

    onSubmit(value);
    setIsEditMode(false);
  }


  function onKeyDown(e) {
    if (e.keyCode === 13) {
      handleSubmit();
    }
  }


  return (
    <div className="editable-text">
      <input
        ref={inputRef}
        className="editable-text__input"
        onChange={(e) => setValue(e.target.value)}
        type="text"
        value={value}
        onKeyDown={onKeyDown}
        onFocus={(e) => e.target.select()}
        readOnly={!isEditMode}
        {...restProps} // eslint-disable-line react/jsx-props-no-spreading
      />

      {!isEditMode && (
        <button
          type="button"
          onClick={() => {
            setIsEditMode(true);
            if (inputRef.current) {
              inputRef.current.focus();
            }
          }}
        >
          <EditIcon size="15" />
        </button>
      )}

      {isEditMode && (
        <button
          disabled={!value || value.length === 0}
          type="button"
          onClick={handleSubmit}
        >
          <EnterIcon size="15" />
        </button>
      )}
    </div>
  );
}


EditableText.propTypes = {
  value: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
};


export default EditableText;
