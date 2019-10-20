import React from 'react';
import { formatDistance } from 'date-fns';
import SyncIcon from '@iconscout/react-unicons/icons/uil-sync';
import SyncSlashIcon from '@iconscout/react-unicons/icons/uil-sync-slash';
import AuthContent from '../../contexts/auth-context';
import StoreContext from '../../contexts/store-context';
import './footer.scss';


function Footer() {
  const { isLoggedIn, login, logout } = React.useContext(AuthContent);
  const { lastSyncTime, syncError, isSyncing } = React.useContext(StoreContext);

  const [lastSyncDistance, setLastSyncDistance] = React.useState();


  React.useEffect(() => {
    if (!lastSyncTime) return;

    setLastSyncDistance(formatDistance(lastSyncTime, new Date()));

    const interval = setInterval(() => {
      setLastSyncDistance(formatDistance(lastSyncTime, new Date()));
    }, 60 * 1000);

    return () => { clearInterval(interval); }; // eslint-disable-line consistent-return
  }, [lastSyncTime]);


  // const loginButton = !isLoggedIn() && (
  //   <button type="button" className="footer__btn" onClick={login}>Login</button>
  // );

  const logoutButton = isLoggedIn() && (
    <button type="button" className="footer__btn" onClick={logout}>Logout</button>
  );

  const syncInfo = (
    <>
      {isSyncing && (
        <span className="footer__syncing">
          <SyncIcon size="17" />
          <span>Syncing</span>
        </span>
      )}

      {!isSyncing && !syncError && lastSyncDistance && (
        <>
          <span>Last synced </span>
          <span>{lastSyncDistance}</span>
          <span> ago</span>
        </>
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
        {syncInfo}
      </div>

      <div>
        {/* {loginButton} */}
        {logoutButton}
      </div>
    </div>
  );
}


export default Footer;
