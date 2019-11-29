// @ts-check

import React from 'react';
import PropTypes from 'prop-types';
import ReactModal from 'react-modal';
import './login-modal.scss';
import AuthContext from '../../contexts/auth-context';
import Card from '../card';


ReactModal.setAppElement('#root');


/**
 * @param {{ isOpen: boolean, onRequestClose: Function }} props
 */
function LoginModal(props) {
  const { isOpen, onRequestClose } = props;
  const { login } = React.useContext(AuthContext);


  function onLoginClick() {
    login();
    // window.location.pathname = '/login';
  }


  const overlayStyles = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    zIndex: 100,
  };


  return (
    <ReactModal
      isOpen={isOpen}
      style={{ overlay: overlayStyles }}
      className="login-modal fade-in"
      onRequestClose={() => onRequestClose()}
    >
      <Card className="login-modal__content">

        < >
          <div className="login-modal__title">
            Login with Blockstack
          </div>

          <p className="login-modal__description">
            PepperTab is designed using
            <strong> Blockstack </strong>
            infrastructure. You will be redirected to Blockstack to login securely.
           Blockstack is a decentralized computing ecosystem powered by Blockchain.
            <br />
            <br />
            All your data (like Todos, Notes) will be encrypted and stored in Blockstack storage engine.
            No one apart from you (even us) will be able to access your data.
            <br />
            <br />
            You can use the same Blockstack ID to login on other browsers to have your
            data synced.
            <br />
            <br />
          </p>

          <button type="button" className="login-modal__btn-proceed" onClick={() => onLoginClick()}>
            Proceed
          </button>
        </>

      </Card>


    </ReactModal>
  );
}


LoginModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onRequestClose: PropTypes.func.isRequired,
};


export default LoginModal;
