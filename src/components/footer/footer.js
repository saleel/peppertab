import React from 'react';
import AuthContent from '../../contexts/auth-context';
import StoreContext from '../../contexts/store-context';
import './footer.scss';


function Footer() {
  const { isLoggedIn, login, logout } = React.useContext(AuthContent);
  const { lastSyncTime, isSyncing } = React.useContext(StoreContext);

  const loginButton = !isLoggedIn() && (
    <button type="button" className="footer__btn" onClick={login}>Login</button>
  );

  const logoutButton = isLoggedIn() && (
    <button type="button" className="footer__btn" onClick={logout}>Logout</button>
  );

  const syncInfo = (
    <>
      {isSyncing && (<span>Syncing</span>)}
      {!isSyncing && lastSyncTime && (<span>{lastSyncTime.toISOString()}</span>)}
    </>
  );


  return (
    <div className="footer">
      {syncInfo}
      {loginButton}
      {logoutButton}
    </div>
  );
}


export default Footer;
