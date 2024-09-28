import React from 'react';
import './App.css';
import { AppRoutes } from './routes';
import { BrowserRouter } from 'react-router-dom';
import MenuLateral from './shared/components/menu-lateral/MenuLateral';


import { AppThemeProvider, DrawerProvider } from './shared/contexts';
import { AuthProvider } from './shared/contexts/AuthContext';
import { Login } from './shared/components';


export const App = () => {
  return (
    <AuthProvider>
      <Login>
        <AppThemeProvider>
          <DrawerProvider>
            <BrowserRouter>
              <MenuLateral>
              </MenuLateral>
              <AppRoutes />
            </BrowserRouter>
          </DrawerProvider>
        </AppThemeProvider>
      </Login>
    </AuthProvider>

  );
}


