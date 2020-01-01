import React from 'react';
import EnterIcon from '@iconscout/react-unicons/icons/uil-enter';
import { getMessagePrefix } from './welcome.utils';
import useLocalStorage from '../../hooks/use-local-storage';
import { SettingKeys } from '../../constants';
import './welcome.scss';


function Welcome() {
  const message = getMessagePrefix();

  const inputRef = React.useRef();
  const [name, setName] = useLocalStorage(SettingKeys.name, '');


  const setInputFocus = React.useCallback(
    () => {
      if (name) return;

      if (inputRef.current) {
        inputRef.current.focus();
      } else {
        setTimeout(() => {
          setInputFocus();
        }, 500);
      }
    },
    [name],
  );

  React.useEffect(() => {
    setInputFocus();
  }, [setInputFocus, name]);


  function submitProfile() {
    if (inputRef.current) {
      setName(inputRef.current.value);
    }
  }


  /**
   * @param {React.KeyboardEvent<HTMLInputElement>} e
   */
  function onKeyDown(e) {
    if (e.keyCode === 13) {
      submitProfile();
    }
  }


  if (!name) {
    return (
      <div className="welcome welcome__no-profile">
        <span className="welcome__message">Hello there, what is your name?</span>
        <div>
          <input
            ref={inputRef}
            onKeyDown={onKeyDown}
            type="text"
            className="welcome__inp-name"
          />

          <div className="welcome__enter-icon">
            {name.length > 0 && (
              <button type="button" onClick={submitProfile} className="fade-in">
                <EnterIcon />
              </button>
            )}
          </div>

        </div>

      </div>
    );
  }


  return (
    <div className="welcome">
      <div className="welcome__has-profile">
        <div className="welcome__message">
          {message}
          {' '}
          <span className="welcome__name">{name}</span>
        </div>
      </div>
    </div>
  );
}


export default Welcome;
