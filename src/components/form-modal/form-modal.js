// @ts-check

import React from 'react';
import PropTypes from 'prop-types';
import ReactModal from 'react-modal';
import './form-modal.scss';


ReactModal.setAppElement('#root');


/**
 * @param {{ title, isOpen: boolean, values: Object, properties: Object, onClose: Function, onSubmit: Function, onDelete: Function }} props
 */
function Prompt(props) {
  const {
    title, isOpen, onClose, onSubmit, onDelete, values: defaultValues, properties,
  } = props;


  const [modalOpen, setModalOpen] = React.useState(isOpen);
  const [value, setValue] = React.useState(defaultValues);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const overlayStyles = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  };


  React.useEffect(() => {
    setModalOpen(isOpen);
    setIsSubmitting(false);
  }, [isOpen]);


  async function handleSubmit(e) {
    e.preventDefault();

    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(value);
    } catch (error) {
      // eslint-disable-next-line no-alert
      window.alert(error.message);
    }
  }


  function onChange(key, v) {
    setIsSubmitting(false);
    setValue((existing) => ({ ...existing, [key]: v }));
  }


  return (
    <ReactModal
      isOpen={modalOpen}
      onRequestClose={() => onClose()}
      style={{ overlay: overlayStyles }}
      className="form-modal"
    >

      <div className="form-modal__title">
        {title}
      </div>

      <button
        type="button"
        className="form-modal__close"
        onClick={() => onClose()}
      >
        +
      </button>

      <form onSubmit={handleSubmit}>
        {Object.keys(properties).map((key) => (
          <div key={key}>
            <label className="form-modal__label" htmlFor={key}>
              {/* eslint-disable-next-line react/prop-types */}
              {properties[key].title}
            </label>
            <input
              id={key}
              required
              type="text"
              maxLength={properties[key].maxLength || 100}
              value={value[key] !== undefined ? value[key] : ''}
              onChange={(e) => {
                onChange(key, e.target.value);
              }}
              className="form-modal__input"
              autoComplete="off"
            />
          </div>
        ))}

        <button
          type="submit"
          className="form-modal__submit"
          disabled={isSubmitting}
        >
          Submit
        </button>
      </form>

      <button
        type="button"
        className="form-modal__delete"
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
  values: PropTypes.shape({}).isRequired,
  isOpen: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};


export default Prompt;
