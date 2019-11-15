import React from 'react';
import PropTypes from 'prop-types';
import ThemeContext from './theme-context';
import StoreContext from '../store-context';
import useStore from '../../hooks/use-store';


function ThemeContextProvider({ children }) {
  const { generalStore } = React.useContext(StoreContext);

  const [theme, { reFetch }] = useStore(() => generalStore.getTheme());


  React.useEffect(() => {
    document.documentElement.className = theme;
  }, [theme]);


  const value = {
    theme,
    changeTheme: async (newTheme) => {
      await generalStore.setTheme(newTheme);
      await reFetch();
    },
  };

  if (!theme) {
    return null;
  }

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
