import React from 'react';
import {Navigation} from '@shopify/polaris';
import {useHistory, useLocation} from 'react-router-dom';
import {CustomersMajor, HomeMajor, SettingsMajor} from '@shopify/polaris-icons';
import '@assets/styles/layout/navigation.scss';
import {prependRoute} from '@assets/config/app';
import {getUrl} from '@assets/helpers/getUrl';
import {getStorageData} from '@assets/helpers/storage';
import {isValidUrlWithRole} from '@assets/helpers/utils/validUrl';

/**
 * @return {JSX.Element}
 * @constructor
 */
export default function AppNavigation() {
  const history = useHistory();
  const {pathname} = useLocation();
  const user = getStorageData('user');
  const isSelected = (route, isExact = true) => {
    if (typeof route === 'undefined') return false;
    const url = prependRoute(route);
    return isExact ? pathname === url : pathname.startsWith(url);
  };

  const prepareMenu = (menu, item) => {
    if (!item) return menu;
    if (!isValidUrlWithRole(item.url, user?.user?.role)) return menu;

    const {subNavigationItems: subMenus, url, path, includeUrl} = item;

    if (!subMenus?.length) {
      menu.push({
        ...item,
        url: url || path,
        selected: isSelected(url) || isSelected(includeUrl) || isSelected(path, false)
      });
      return menu;
    }

    menu.push({
      url: subMenus[0].url,
      ...item,
      selected: isSelected(path || url, !path),
      subNavigationItems: subMenus.map(x => ({
        ...x,
        selected: isSelected(x.url, false) || isSelected(x.includeUrl, false)
      }))
    });
    return menu;
  };

  return (
    <Navigation location="">
      <Navigation.Section
        fill
        separator
        items={[
          {
            url: '/',
            icon: HomeMajor,
            label: 'Dashboard',
            selected: location.pathname === getUrl('/'),
            onClick: () => {
              history.push('/');
            }
          },
          {
            url: '/user',
            icon: CustomersMajor,
            label: 'User',
            selected: location.pathname === getUrl('/user'),
            onClick: () => {
              history.push('/user');
            }
          }
        ].reduce(prepareMenu, [])}
      />
      <Navigation.Section
        separator
        items={[
          {
            label: 'Settings',
            url: '/settings',
            icon: SettingsMajor
          }
        ].reduce(prepareMenu, [])}
      />
    </Navigation>
  );
}
