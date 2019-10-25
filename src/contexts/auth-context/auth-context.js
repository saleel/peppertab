import React from 'react';

/**
 * @type {{
 * userSession: import('blockstack').UserSession
 * login: Function
 * logout: Function
 * isLoggedIn: () => boolean
 * }}
 */
const defaultValues = { userSession: null };

const AuthContext = React.createContext(defaultValues);


export default AuthContext;
