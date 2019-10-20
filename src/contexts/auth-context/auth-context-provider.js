import React from 'react';
import PropTypes from 'prop-types';
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

  function logout() {
    userSession.signUserOut('/');
  }


  React.useEffect(() => {
    if (!userSession.isUserSignedIn() && userSession.isSignInPending()) {
      userSession.handlePendingSignIn()
        .then((userData) => {
          if (!userData.username) {
            throw new Error('This app requires a username.');
          }
          window.location.reload();
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
