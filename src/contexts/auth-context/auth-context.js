import React from 'react';

/**
 * @type {{ userSession: import('blockstack').UserSession }}
 */
const defaultValues = { userSession: null };

const AuthContext = React.createContext(defaultValues);


export default AuthContext;
