import React from 'react';
import {Route, Switch} from 'react-router-dom';
import Home from '@assets/loadables/Home';
import NotFound from '@assets/loadables/NotFound';
import Settings from '@assets/loadables/Settings/Settings';
import {routePrefix} from '@assets/config/app';
import Notifications from '@assets/loadables/Notifications/Notifications';

// eslint-disable-next-line react/prop-types
const Routes = ({prefix = routePrefix}) => (
  <Switch>
    <Route exact path={prefix + '/'} component={Home} />
    <Route exact path={prefix + '/settings'} component={Settings} />
    <Route exact path={prefix + '/notifications'} component={Notifications} />
    <Route path="*" component={NotFound} />
  </Switch>
);

export default Routes;
