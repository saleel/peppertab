import React from 'react';
import { formatDistance } from 'date-fns';
import SyncIcon from '@iconscout/react-unicons/icons/uil-sync';
import SyncSlashIcon from '@iconscout/react-unicons/icons/uil-sync-slash';
import AuthContent from '../../contexts/auth-context';
import StoreContext from '../../contexts/store-context';
import LoginModal from '../login-modal';
import Card from '../card';
import './sync-info.scss';


function Sync() {
  const { isLoggedIn } = React.useContext(AuthContent);
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


  const syncInfo = (
    <>
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
    </>
  );


  return (
    <>
      <Card>
        <div className="sync-info">

          {!isUserLoggedIn && (
            <>
              <span>Store your Notes and Todos securely and sync across browsers.</span>
              <button
                className="sync-info__btn-login"
                type="button"
                onClick={() => onButtonClick()}
              >
                Login
              </button>
              <span>to get started.</span>
            </>
          )}

          {isUserLoggedIn && syncInfo}

        </div>
      </Card>

      <LoginModal isOpen={showLoginPrompt} onRequestClose={() => setShowLoginPrompt(false)} />
    </>
  );
}


export default Sync;
