import React from 'react';

/**
 * @type {{
 * theme: String
 * changeTheme: Function
 * }}
 */
const defaultValues = { };

const ThemeContext = React.createContext(defaultValues);


export default ThemeContext;
