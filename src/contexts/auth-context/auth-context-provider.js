import React from 'react';
import PropTypes from 'proptypes';
import { UserSession } from 'blockstack';
import AuthContext from './auth-context';
import { appConfig } from '../../constants';


function AuthContextProvider({ children }) {
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
