import React from 'react';
import PropTypes from 'prop-types';
import ThemeContext from './theme-context';
import StoreContext from '../store-context';


function ThemeContextProvider({ children }) {
  const { generalStore } = React.useContext(StoreContext);

  const setUpdatedTime = React.useState()[1];

  const theme = generalStore.getTheme();
  document.documentElement.className = theme;


  const value = {
    theme,
    changeTheme: async (newTheme) => {
      await generalStore.setTheme(newTheme);
      setUpdatedTime(new Date());
    },
  };


  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}


ThemeContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};


export default ThemeContextProvider;
