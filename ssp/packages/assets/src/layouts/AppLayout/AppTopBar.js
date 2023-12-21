import React from 'react';
import { TopBar} from '@shopify/polaris';
import PropTypes from 'prop-types';

import '@assets/styles/layout/topbar.scss';
import {useStore} from '@assets/reducers/storeReducer';

/**
 * @param {boolean} isNavOpen
 * @param {function} toggleOpenNav
 * @return {JSX.Element}
 * @constructor
 */
export default function AppTopBar({isNavOpen, toggleOpenNav}) {
  const {state} = useStore();


  return <TopBar userMenu={<TopBar.UserMenu name="Avada" initials="A" />} />;
}

AppTopBar.propTypes = {
  isNavOpen: PropTypes.bool,
  toggleOpenNav: PropTypes.func
};
