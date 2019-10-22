// @ts-check

import React from 'react';
import PropTypes from 'prop-types';
import ReactModal from 'react-modal';
import './prompt.scss';


ReactModal.setAppElement('#root');


/**
 * @param {{ question: string, isOpen: boolean, onSubmit:Function }} props
 */
function Prompt(props) {
  const { question, isOpen, onSubmit } = props;

  const [modalOpen, setModalOpen] = React.useState(isOpen);
  const [answer, setAnswer] = React.useState('');

  const overlayStyles = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };


  async function handleSubmit(e) {
    e.preventDefault();
    await onSubmit(answer);
    setModalOpen(false);
  }


  return (
    <ReactModal isOpen={modalOpen} style={{ overlay: overlayStyles }} className="prompt">

      <div className="prompt__question">
        {question}
      </div>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          onChange={(e) => setAnswer(e.target.value)}
          className="prompt__input"
        />
        <button
          type="submit"
          className="prompt__submit"
        >
          Submit
        </button>
      </form>

    </ReactModal>
  );
}


Prompt.propTypes = {
  question: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func.isRequired,
};


export default Prompt;
