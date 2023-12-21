import App from './App';
import React from 'react';
import './styles/app.scss';
import * as ReactDOM from 'react-dom';
import {api} from './helpers';
import {isEmpty} from '@avada/utils';
import {StoreProvider} from '@assets/reducers/storeReducer';
import {collectActiveShopData} from '@assets/services/shopService';

(async () => {
  const {shop, shopInfo} = await api('/shops');
  const [activeShop, user] = isEmpty(shop)
    ? []
    : [
        collectActiveShopData({shop, shopInfo}),
        {email: shop.email, displayName: shopInfo.shopOwner}
      ];
  // if (activeShop) {
  //   loadCrisp('WEBSITE_ID', shop.crispSessionToken);
  //   pushDataToCrisp({shopData: activeShop, user});
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
})();

if (module.hot) module.hot.accept();
