import React from 'react';
import {Route, Switch} from 'react-router-dom';
import Home from '@assets/loadables/Home';
import Settings from '@assets/loadables/Settings/Settings';
import {routePrefix} from '@assets/config/app';
import NotFound from '@assets/loadables/NotFound';
import User from '@assets/loadables/User';
import {getStorageData} from '@assets/helpers/storage';
import Profile from '@assets/loadables/Profile';
import {ROLE} from '@assets/helpers/utils/validUrl';
// eslint-disable-next-line react/prop-types
const user = getStorageData('user');
const routes = [
  {
    path: '/',
    component: Home,
    role: [ROLE.ADMIN, ROLE.USER]
  },
  {
    path: '/settings',
    component: Settings,
    role: [ROLE.ADMIN]
  },
  {
    path: '/user',
    component: User,
    role: [ROLE.ADMIN]
  },
  {
    path: '/me',
    component: Profile,
    role: [ROLE.ADMIN, ROLE.USER]
  }
];

const Routes = ({prefix = routePrefix}) => (
  <Switch>
    {routes
      .filter(({role}) => role.some(r => user?.user?.role.includes(r)))
      .map(({path, component}) => (
        <Route key={path} exact path={`${prefix}${path}`} component={component} />
      ))}
    <Route path="*" component={NotFound} />
  </Switch>
);

export default Routes;
