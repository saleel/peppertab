import React from 'react';
import { AuthContextProvider } from './contexts/auth-context';
import { StoreContextProvider } from './contexts/store-context';
import { ThemeContextProvider } from './contexts/theme-context';
import Home from './home';


function App() {
  return (
    <AuthContextProvider>
      <StoreContextProvider>
        <ThemeContextProvider>
          <Home />
        </ThemeContextProvider>
      </StoreContextProvider>
    </AuthContextProvider>
  );
}


export default App;
