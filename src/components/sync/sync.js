import React from 'react';
import { formatDistance } from 'date-fns';
import { Tooltip } from 'react-tippy';
import SyncIcon from '@iconscout/react-unicons/icons/uil-sync';
import SyncSlashIcon from '@iconscout/react-unicons/icons/uil-sync-slash';
import AuthContent from '../../contexts/auth-context';
import StoreContext from '../../contexts/store-context';
import LoginModal from '../login-modal';
import './sync.scss';


function Sync() {
  const { isLoggedIn } = React.useContext(AuthContent);
  const { lastSyncTime, syncError, isSyncing } = React.useContext(StoreContext);


  const [lastSyncDistance, setLastSyncDistance] = React.useState();
  const [showLoginPrompt, setShowLoginPrompt] = React.useState(false);


  const notLoggedIn = !isLoggedIn();


  React.useEffect(() => {
    if (!lastSyncTime) return;

    setLastSyncDistance(formatDistance(lastSyncTime, new Date()));

    const interval = setInterval(() => {
      setLastSyncDistance(formatDistance(lastSyncTime, new Date()));
    }, 60 * 1000);

    return () => { clearInterval(interval); }; // eslint-disable-line consistent-return
  }, [lastSyncTime]);


  function onButtonClick() {
    if (notLoggedIn) {
      setShowLoginPrompt(true);
    }
  }


  const tooltip = notLoggedIn
    ? (<span>Login to store and sync your data securely</span>)
    : (
      <>
        {isSyncing && (
          <span>Syncing</span>
        )}

        {!isSyncing && !syncError && lastSyncDistance && (
          <span>{`Last synced ${lastSyncDistance} ago`}</span>
        )}

        {!isSyncing && syncError && (
          <span>Error occurred in sync</span>
        )}
      </>
    );


  let icon = (<SyncIcon size="18" />);
  if (isSyncing) {
    icon = (<SyncIcon className="sync__syncing" size="18" />);
  }
  if (syncError) {
    icon = (<SyncSlashIcon className="sync__sync-error" size="18" />);
  }


  return (
    <>
      <Tooltip
        html={tooltip}
        position="bottom"
        trigger="mouseenter"
        arrow
        style={{ display: 'flex' }}
        className="sync"
      >
        <button
          className={`sync__btn-icon ${notLoggedIn ? 'sync__not-logged-in' : ''}`}
          type="button"
          onClick={() => onButtonClick()}
        >
          {icon}
        </button>
      </Tooltip>

      <LoginModal isOpen={showLoginPrompt} onRequestClose={() => setShowLoginPrompt(false)} />
    </>
  );
}


export default Sync;
