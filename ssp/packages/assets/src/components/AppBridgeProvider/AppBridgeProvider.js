import React, {useMemo} from 'react';
import PropTypes from 'prop-types';
import {NavigationMenu, Provider} from '@shopify/app-bridge-react';
import {useHistory, useLocation} from 'react-router-dom';
import {getUrl} from '@assets/helpers/getUrl';

export default function AppBridgeProvider({children}) {
  const {push} = useHistory();
  const location = useLocation();
  const history = useMemo(() => ({replace: path => push(path, {replace: true})}), [push]);
  const router = useMemo(() => ({location, history}), [location, history]);
  const host = new URL(window.location).searchParams.get('host');

  return (
    <Provider
      router={router}
      config={{
        host,
        apiKey: process.env.SHOPIFY_API_KEY,
        forceRedirect: true
      }}
    >
      <NavigationMenu
        matcher={(link, location) => {
          return getUrl(link.destination) === location.pathname;
        }}
        navigationLinks={[
          {
            label: 'Samples',
            destination: '/samples'
          },
          {
            label: 'Settings',
            destination: '/settings'
          }
        ]}
      />
      {children}
    </Provider>
  );
}

AppBridgeProvider.propTypes = {
  children: PropTypes.any
};
