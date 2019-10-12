import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { AuthContextProvider } from './contexts/auth-context';
import { StoreContextProvider } from './contexts/store-context';


function App() {
  const routes = [
    {
      path: '/',
      component: React.lazy(() => import('./home')),
    },
  ];

  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <AuthContextProvider>
        <StoreContextProvider>
          <Router>
            {routes.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                exact
                component={route.component}
              />
            ))}
          </Router>
        </StoreContextProvider>
      </AuthContextProvider>
    </React.Suspense>
  );
}


export default App;
