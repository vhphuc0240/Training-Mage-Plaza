import 'whatwg-fetch';
import App from './App';
import React from 'react';
import './styles/app.scss';
import * as ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import {auth} from './helpers';
import {StoreProvider} from '@assets/reducers/storeReducer';
import {AuthProvider} from '@assets/reducers/authReducer';
import {UserProvider} from '@assets/reducers/userReducer';

const isProduction = process.env.NODE_ENV === 'production';

window.isAuthenticated = false;

auth.onAuthStateChanged(async function(user) {
  ReactDOM.render(
    <AuthProvider>
      <UserProvider user={user}>
        <StoreProvider>
          <App />
        </StoreProvider>
      </UserProvider>
    </AuthProvider>,
    document.getElementById('app')
  );
});

if (isProduction) {
  serviceWorker.register();
}

if (module.hot) module.hot.accept();
