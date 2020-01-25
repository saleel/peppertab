import React from 'react';
import formatDistance from 'date-fns/formatDistance';
import differenceInMinutes from 'date-fns/differenceInMinutes';
import SyncIcon from '@iconscout/react-unicons/icons/uil-sync';
import SyncSlashIcon from '@iconscout/react-unicons/icons/uil-sync-slash';
import AuthContent from '../../contexts/auth-context';
import StoreContext from '../../contexts/store-context';
import LoginModal from '../login-modal';
import useSettings from '../../hooks/use-settings';
import { SettingKeys } from '../../constants';
import './sync-info.scss';


function SyncInfo() {
  const { userSession, isLoggedIn, logout } = React.useContext(AuthContent);
  const { todoStore, noteStore, linkStore } = React.useContext(StoreContext);

  const [lastSyncDistance, setLastSyncDistance] = React.useState();
  const [showLoginPrompt, setShowLoginPrompt] = React.useState(false);
  const [isSyncing, setIsSyncing] = React.useState(false);
  const [syncError, setSyncError] = React.useState();

  const [lastSyncTime, setLastSyncTime] = useSettings(SettingKeys.lastSyncTime);


  async function syncDb(store) {
    if (!window.navigator.onLine) return;

    try {
      // Get backup from blockstack
      const fileName = `${store.name}-db.json`;
      const dump = await userSession.getFile(fileName, { decrypt: true });

      // Restore dump
      await store.merge(dump);

      // Dump the synced DB
      const dbDump = await store.dump();

      // Push db dump back to blockstack
      await userSession.putFile(fileName, dbDump, { encrypt: true });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Sync error', error);
      throw error;
    }
  }

  async function syncAll() {
    try {
      if (isSyncing) return;

      if (!isLoggedIn()) return;

      setIsSyncing(true);

      await Promise.all([
        syncDb(todoStore),
        syncDb(noteStore),
        syncDb(linkStore),
      ]);

      setLastSyncTime(new Date());
      setIsSyncing(false);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Error ocurred in sync', e);
      setIsSyncing(false);
      setSyncError(e);
    }
  }


  // Sync once on page load
  React.useEffect(() => {
    if (!isLoggedIn()) return;

    if (!lastSyncTime || differenceInMinutes(new Date(), new Date(lastSyncTime)) > 1) {
      const timeout = setTimeout(() => {
        syncAll();
      }, 3000);

      // eslint-disable-next-line consistent-return
      return () => { timeout(); };
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  React.useEffect(() => {
    if (!lastSyncTime) return;

    setLastSyncDistance(formatDistance(new Date(lastSyncTime), new Date()));

    const interval = setInterval(() => {
      setLastSyncDistance(formatDistance(new Date(lastSyncTime), new Date()));
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

      {!isSyncing && lastSyncDistance && (
        <button
          type="button"
          className="sync-info__btn-login"
          onClick={() => { syncAll(); }}
        >
          Sync now
        </button>
      )}
    </div>
  );


  return (
    <>
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


export default SyncInfo;
