import React from 'react';
import { formatDistance } from 'date-fns';
import SyncIcon from '@iconscout/react-unicons/icons/uil-sync';
import SyncSlashIcon from '@iconscout/react-unicons/icons/uil-sync-slash';
import MoonIcon from '@iconscout/react-unicons/icons/uil-moon';
import SunIcon from '@iconscout/react-unicons/icons/uil-sun';
import LoginModal from '../login-modal';
import useStore from '../../hooks/use-store';
import AuthContent from '../../contexts/auth-context';
import StoreContext from '../../contexts/store-context';
import { Themes } from '../../constants';
import './footer.scss';


function Footer() {
  const { isLoggedIn } = React.useContext(AuthContent);
  const {
    generalStore, lastSyncTime, syncError, isSyncing,
  } = React.useContext(StoreContext);


  const [lastSyncDistance, setLastSyncDistance] = React.useState();
  const [showLoginPrompt, setShowLoginPrompt] = React.useState(false);

  const [theme, { reFetch }] = useStore(() => generalStore.getTheme(), Themes.light);

  function onMoonClick() {
    generalStore.setTheme(Themes.dark);
    reFetch();
  }

  function onSunClick() {
    generalStore.setTheme(Themes.light);
    reFetch();
  }


  React.useEffect(() => {
    document.documentElement.className = theme;
  }, [theme]);


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


  const themeConfig = (theme === Themes.dark)
    ? (
      <button className="fade-in" type="button" onClick={onSunClick}>
        <SunIcon color="#f7f7f7" size="20" />
      </button>
    )
    : (
      <button className="fade-in" type="button" onClick={onMoonClick}>
        <MoonIcon color="#1E1E1E" size="20" />
      </button>
    );


  return (
    <div className="footer">
      <div className="footer__sync-info">
        {/* {logoutButton} */}
        {syncInfo}
        {loginButton}
      </div>

      <div className="footer__theme">
        {themeConfig}
      </div>
    </div>
  );
}


export default Footer;
