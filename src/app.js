import React from 'react';
import { AuthContextProvider } from './contexts/auth-context';
import { StoreContextProvider } from './contexts/store-context';
import Home from './home';


function App() {
  return (
    <AuthContextProvider>
      <StoreContextProvider>
        <Home />
      </StoreContextProvider>
    </AuthContextProvider>
  );
}


export default App;
