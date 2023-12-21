import React from 'react';
import {Router, withRouter} from 'react-router-dom';
import ReactRouterLink from '@assets/components/ReactRouterLink';
import {AppProvider} from '@shopify/polaris';
import translations from '@shopify/polaris/locales/en.json';
import {history} from '@assets/history';
import ErrorBoundary from '@assets/components/ErrorBoundary';
import Routes from './routes/routes';
import theme from '@assets/config/theme';
import PropTypes from 'prop-types';
import AppBridgeProvider from '@assets/components/AppBridgeProvider';
import AppLayout from '@assets/layouts/AppLayout';
import {isEmbeddedApp} from '@assets/config/app';

/**
 * The main endpoint of application contains all routes, settings for redux and Polaris
 *
 * @return {React.ReactElement}
 * @constructor
 */
export default function App() {
  return (
    <AppProvider
      theme={theme}
      i18n={translations}
      linkComponent={ReactRouterLink}
      features={{newDesignLanguage: isEmbeddedApp}}
    >
      <Router history={history}>
        <MainLayout>
          <ErrorBoundary>
            <Routes />
          </ErrorBoundary>
        </MainLayout>
      </Router>
    </AppProvider>
  );
}

const AppFullLayout = withRouter(({children}) => <AppLayout>{children}</AppLayout>);

const MainLayout = ({children}) => {
  return isEmbeddedApp ? (
    <AppBridgeProvider>
      <AppLayout>{children}</AppLayout>
    </AppBridgeProvider>
  ) : (
    <AppFullLayout>{children}</AppFullLayout>
  );
};

MainLayout.propTypes = {
  children: PropTypes.node
};
