import React from 'react';
import PropTypes from 'proptypes';
import { AppConfig, UserSession } from 'blockstack';
import AuthContext from './auth-context';


function AuthContextProvider({ children }) {
  const appConfig = new AppConfig(['store_write', 'publish_data']);
  const userSession = new UserSession({ appConfig });

  function isLoggedIn() {
    return userSession.isUserSignedIn();
  }

  function login() {
    userSession.redirectToSignIn();
  }

  const actions = {
    isLoggedIn,
    login,
    userSession,
  };

  return (
    <AuthContext.Provider value={actions}>
      {children}
    </AuthContext.Provider>
  );
}


AuthContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};


export default AuthContextProvider;
