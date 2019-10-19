import React from 'react';
import AuthContent from '../../contexts/auth-context';
import './footer.scss';


function Footer() {
  const { isLoggedIn, login, logout } = React.useContext(AuthContent);

  const loginButton = !isLoggedIn() && (
    <button type="button" className="footer__btn" onClick={login}>Login</button>
  );

  const logoutButton = isLoggedIn() && (
    <button type="button" className="footer__btn" onClick={logout}>Logout</button>
  );


  return (
    <div className="footer">
      {loginButton}
      {logoutButton}
    </div>
  );
}


export default Footer;
