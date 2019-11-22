import React from 'react';
import PropTypes from 'prop-types';
import { UserSession } from 'blockstack';
import AuthContext from './auth-context';
import { BlockstackAppConfig, LocalStorage } from '../../constants';


function AuthContextProvider({ children }) {
  const userSession = new UserSession({ appConfig: BlockstackAppConfig });

  function isLoggedIn() {
    return userSession.isUserSignedIn();
  }

  function login() {
    userSession.redirectToSignIn();
  }

  function logout() {
    userSession.signUserOut('/');
  }


  React.useEffect(() => {
    if (!userSession.isUserSignedIn() && userSession.isSignInPending()) {
      userSession.handlePendingSignIn()
        .then(() => {
          // Clear last sync time
          window.localStorage.removeItem(LocalStorage.lastSyncTime);

          window.location.replace('/');
        });
    }
  }, [userSession]);


  const actions = {
    isLoggedIn,
    login,
    logout,
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
