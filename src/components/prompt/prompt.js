// @ts-check

import React from 'react';
import PropTypes from 'prop-types';
import ReactModal from 'react-modal';
import './prompt.scss';


ReactModal.setAppElement('#root');


/**
 * @param {{ title, isOpen: boolean, value: Object, properties: Object, onClose: Function, onSubmit: Function, onDelete: Function }} props
 */
function Prompt(props) {
  const {
    title, isOpen, onClose, onSubmit, onDelete, value: defaultValue, properties,
  } = props;

  const [modalOpen, setModalOpen] = React.useState(isOpen);
  const [value, setValue] = React.useState(defaultValue);

  const overlayStyles = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  };


  React.useEffect(() => {
    setModalOpen(isOpen);
  }, [isOpen]);


  async function handleSubmit(e) {
    e.preventDefault();
    await onSubmit(value);
    setModalOpen(false);
  }


  function onChange(key, v) {
    setValue((existing) => ({ ...existing, [key]: v }));
  }


  return (
    <ReactModal
      isOpen={modalOpen}
      onRequestClose={() => onClose(false)}
      style={{ overlay: overlayStyles }}
      className="prompt"
    >

      <div className="prompt__title">
        {title}
      </div>

      <form onSubmit={handleSubmit}>
        {Object.keys(properties).map((key) => (
          <div key={key}>
            <label className="prompt__label" htmlFor={key}>
              {/* eslint-disable-next-line react/prop-types */}
              {properties[key].title}
            </label>
            <input
              id={key}
              type="text"
              value={value[key]}
              onChange={(e) => {
                onChange(key, e.target.value);
              }}
              className="prompt__input"
              autoComplete="off"
            />
          </div>
        ))}

        <button
          type="submit"
          className="prompt__submit"
        >
          Submit
        </button>
      </form>

      <button
        type="button"
        className="prompt__delete"
        onClick={() => onDelete()}
      >
        Delete
      </button>

    </ReactModal>
  );
}


Prompt.propTypes = {
  title: PropTypes.string.isRequired,
  properties: PropTypes.shape({}).isRequired,
  value: PropTypes.shape({}).isRequired,
  isOpen: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};


export default Prompt;
