import React from 'react';
import EnterIcon from '@iconscout/react-unicons/icons/uil-enter';
import StoreContext from '../../contexts/store-context';
import { getMessagePrefix } from './welcome.utils';
import usePromise from '../../hooks/use-promise';
import './welcome.scss';


function Welcome() {
  const { generalStore } = React.useContext(StoreContext);
  const message = getMessagePrefix();

  const inputRef = React.useRef();
  const [name, setName] = React.useState('');

  const [profile, { isFetching, reFetch }] = usePromise(
    () => generalStore.getProfile(),
    {
      cacheKey: 'profile',
      cachePeriodInSecs: 24 * 60 * 60,
    },
  );


  React.useEffect(() => {
    const interval = setInterval(() => {
      if (!profile && inputRef.current) {
        inputRef.current.focus();
      }
    }, 1000);

    return () => { clearInterval(interval); };
  }, [profile]);


  async function submitProfile() {
    await generalStore.setProfile({ name });
    reFetch();
  }


  /**
   * @param {React.KeyboardEvent<HTMLInputElement>} e
   */
  function onKeyDown(e) {
    if (e.keyCode === 13) {
      submitProfile();
    }
  }


  if (isFetching) {
    return (
      <div className="welcome welcome__no-profile" />
    );
  }


  if (!profile) {
    return (
      <div className="welcome welcome__no-profile">
        <span className="welcome__message">Hello there, what is your name?</span>
        <div>
          <input
            ref={inputRef}
            onChange={(e) => setName(e.target.value)}
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
          <span className="welcome__name">{profile.name}</span>
        </div>
      </div>
    </div>
  );
}


export default Welcome;
