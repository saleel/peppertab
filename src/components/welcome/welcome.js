import React from 'react';
import PropTypes from 'prop-types';
import StoreContext from '../../contexts/store-context';
import { getMessagePrefix } from './welcome.utils';
import './welcome.scss';


function Welcome(props) {
  const { profile, onChange } = props;
  const { generalStore } = React.useContext(StoreContext);
  const message = getMessagePrefix();

  const inputRef = React.useRef();


  React.useEffect(() => {
    if (!profile && inputRef.current) {
      inputRef.current.focus();
    }
  }, [profile]);


  /**
   * @param {React.KeyboardEvent<HTMLInputElement>} e
   */
  async function onKeyDown(e) {
    if (e.keyCode === 13) {
      await generalStore.setProfile({ name: e.target.value });
      onChange();
    }
  }


  if (!profile) {
    return (
      <div className="welcome fade-in">
        <span className="welcome__message">Hello there, what is your name?</span>
        <input ref={inputRef} onKeyDown={onKeyDown} type="text" className="welcome__inp-name" />
      </div>
    );
  }


  return (
    <div className="welcome fade-in">
      <span className="welcome__message">{message}</span>
      <span className="welcome__name">{profile.name}</span>
    </div>
  );
}


Welcome.propTypes = {
  profile: PropTypes.shape({
    name: PropTypes.string,
  }),
  onChange: PropTypes.func.isRequired,
};

Welcome.defaultProps = {
  profile: null,
};


export default Welcome;
