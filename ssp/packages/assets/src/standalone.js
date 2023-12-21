import App from './App';
import React from 'react';
import './styles/app.scss';
import * as ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import {api, auth} from './helpers';
import {isEmpty} from '@avada/utils';
import {StoreProvider} from '@assets/reducers/storeReducer';
import {collectActiveShopData} from '@assets/services/shopService';

window.isAuthenticated = false;

auth.onAuthStateChanged(async user => {
  if (user === null && !window.isAuthenticated) {
    window.location.href = 'auth/login';
    ReactDOM.render(<div />, document.getElementById('app'));
  } else {
    window.isAuthenticated = true;

    const [{shop, shopInfo}, firebaseUser] = await Promise.all([
      api('/shops'),
      auth.currentUser.getIdTokenResult()
    ]);
    const activeShop = isEmpty(shop)
      ? null
      : {
          ...firebaseUser.claims,
          vendor: firebaseUser.claims.type || 'others',
          ...collectActiveShopData({shop, shopInfo})
        };
    // if (activeShop) {
    //   TagManager.initialize({gtmId: 'GTM_ID'});
    //   if (!activeShop.isCrmLogin) {
    //     loadCrisp('WEBSITE_ID', shop.crispSessionToken);
    //     pushDataToCrisp({shopData: activeShop, user});
    //   }
    // }

    const loading = document.getElementById('PreLoading');
    if (loading !== null) {
      loading.style.display = 'none';
    }
    ReactDOM.render(
      <StoreProvider {...{user, activeShop}}>
        <App />
      </StoreProvider>,
      document.getElementById('app')
    );
  }
});

// Register a service worker for PWA application
serviceWorker.register();

if (module.hot) module.hot.accept();
