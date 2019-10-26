import React from 'react';
import { formatDistance } from 'date-fns';
import SyncIcon from '@iconscout/react-unicons/icons/uil-sync';
import SyncSlashIcon from '@iconscout/react-unicons/icons/uil-sync-slash';
import LoginModal from '../login-modal';
import AuthContent from '../../contexts/auth-context';
import StoreContext from '../../contexts/store-context';
import './footer.scss';


function Footer() {
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


  const loginButton = !isLoggedIn() && (
    <>
      <button
        type="button"
        className="footer__btn"
        onClick={() => setShowLoginPrompt(true)}
      >
        Login
      </button>
      <span> to store &amp; sync your data securely</span>
      <LoginModal isOpen={showLoginPrompt} onRequestClose={() => setShowLoginPrompt(false)} />
    </>
  );

  // const logoutButton = isLoggedIn() && (
  //   <button type="button" className="footer__btn" onClick={logout}>Logout</button>
  // );

  const syncInfo = isLoggedIn() && (
    <>
      {isSyncing && (
        <span className="footer__syncing">
          <SyncIcon size="17" />
          <span>Syncing</span>
        </span>
      )}

      {!isSyncing && !syncError && lastSyncDistance && (
        <span className="fade-in">
          <span>Last synced </span>
          <span>{lastSyncDistance}</span>
          <span> ago</span>
        </span>
      )}

      {!isSyncing && syncError && (
        <span className="footer__sync-error">
          <SyncSlashIcon color="orange" size="17" />
          <span>Error occurred in sync</span>
        </span>
      )}
    </>
  );


  return (
    <div className="footer">
      <div className="footer__sync-info">
        {/* {logoutButton} */}
        {syncInfo}
        {loginButton}
      </div>
    </div>
  );
}


export default Footer;
