import React from 'react';
import {Route, Switch} from 'react-router-dom';
import Home from '@assets/loadables/Home';
import NotFound from '@assets/loadables/NotFound';
import Samples from '@assets/loadables/Samples/Samples';
import Settings from '@assets/loadables/Settings/Settings';
import {routePrefix} from '@assets/config/app';

// eslint-disable-next-line react/prop-types
const Routes = ({prefix = routePrefix}) => (
  <Switch>
    <Route exact path={prefix + '/'} component={Home} />
    <Route exact path={prefix + '/samples'} component={Samples} />
    <Route exact path={prefix + '/settings'} component={Settings} />
    <Route path="*" component={NotFound} />
  </Switch>
);

export default Routes;
