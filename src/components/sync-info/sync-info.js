import React from 'react';
import { formatDistance } from 'date-fns';
import SyncIcon from '@iconscout/react-unicons/icons/uil-sync';
import SyncSlashIcon from '@iconscout/react-unicons/icons/uil-sync-slash';
import AuthContent from '../../contexts/auth-context';
import StoreContext from '../../contexts/store-context';
import LoginModal from '../login-modal';
import './sync-info.scss';


function Sync() {
  const { userSession, isLoggedIn, logout } = React.useContext(AuthContent);
  const { lastSyncTime, syncError, isSyncing } = React.useContext(StoreContext);


  const [lastSyncDistance, setLastSyncDistance] = React.useState();
  const [showLoginPrompt, setShowLoginPrompt] = React.useState(false);


  React.useEffect(() => {
    if (!lastSyncTime) return;

    setLastSyncDistance(formatDistance(lastSyncTime, new Date()));

    const interval = setInterval(() => {
      setLastSyncDistance(formatDistance(lastSyncTime, new Date()));
    }, 60 * 1000);

    return () => { clearInterval(interval); }; // eslint-disable-line consistent-return
  }, [lastSyncTime]);


  function onButtonClick() {
    setShowLoginPrompt(true);
  }


  const isUserLoggedIn = isLoggedIn();

  const userName = userSession.isUserSignedIn() && userSession.loadUserData().username;

  const syncInfo = (
    <div className="sync-info__time">
      {isSyncing && (
        <>
          <SyncIcon className="sync-info__syncing" size="18" />
          <div className="sync-info__message">Syncing</div>
        </>
      )}

      {!isSyncing && !syncError && lastSyncDistance && (
        <>
          <SyncIcon size="18" />
          <div className="sync-info__message">{`Last synced ${lastSyncDistance} ago`}</div>
        </>
      )}

      {!isSyncing && syncError && (
        <>
          <SyncSlashIcon className="sync-info__sync-error" size="18" />
          <div className="sync-info__message">Error occurred in sync</div>
        </>
      )}
    </div>
  );


  return (
    <>
      {/* <Card> */}
      <div className="sync-info">

        {!isUserLoggedIn && (
          <>
            <div>Store your Notes and Todos securely and sync across browsers. Login to get started → </div>

            <button
              className="sync-info__btn-login"
              type="button"
              onClick={() => onButtonClick()}
            >
                Login with Blockstack
            </button>
          </>
        )}

        {isUserLoggedIn && (
          <>
            {syncInfo}

            <div className="sync-info__user-info">
              <span>Syncing to </span>
              <span className="mr-2">{userName}</span>
              <button
                className="sync-info__btn-login"
                type="button"
                onClick={() => logout()}
              >
                Logout
              </button>
            </div>
          </>
        )}

      </div>

      <LoginModal isOpen={showLoginPrompt} onRequestClose={() => setShowLoginPrompt(false)} />
    </>
  );
}


export default Sync;
