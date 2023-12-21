import React, {useCallback, useState} from 'react';
import {Button, DisplayText, Icon, Link, Stack, Thumbnail, TopBar} from '@shopify/polaris';
import PropTypes from 'prop-types';
import {
  BugMajor,
  CustomersMajor,
  LogOutMinor,
  MobileCancelMajor,
  MobileHamburgerMajor
} from '@shopify/polaris-icons';
import isLocal from '@assets/helpers/isLocal';
import {docLink} from '@assets/config/menuLink';
import InfoIcon from '@assets/resources/icons/info.svg';
import NotificationIcon from '@assets/resources/icons/notification.svg';
import {LOGO_URL, LOGO_WIDTH} from '@assets/config/theme';
import '@assets/styles/layout/topbar.scss';
import useConfirmSheet from '@assets/hooks/popup/useConfirmSheet';
import AppNewsSheet from '@assets/components/AppNews/AppNewsSheet';
import {useUser} from '@assets/reducers/userReducer';
import {logout} from '@assets/actions/authAction';
import {useHistory} from 'react-router-dom';

/**
 * @param {boolean} isNavOpen
 * @param {function} toggleOpenNav
 * @return {JSX.Element}
 * @constructor
 */
export default function AppTopBar({isNavOpen, toggleOpenNav}) {
  const {state: user} = useUser();
  const history = useHistory();
  const {sheet: newsSheet, openSheet: openNewsSheet} = useConfirmSheet({Content: AppNewsSheet});
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const toggleIsUserMenuOpen = useCallback(
    () => setIsUserMenuOpen(isUserMenuOpen => !isUserMenuOpen),
    []
  );
  const handleLogout = async () => {
    await logout();
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };
  const handleLinkToProfile = () => {
    history.push('/me');
  };
  return (
    <TopBar
      secondaryMenu={
        <div className="Avada-TopBar__Wrapper">
          <div className="Avada-TopBar__Title">
            <Button plain onClick={toggleOpenNav}>
              <Icon source={isNavOpen ? MobileCancelMajor : MobileHamburgerMajor} />
            </Button>
            <img alt="Avada App Name" src={LOGO_URL} width={LOGO_WIDTH} />
            <DisplayText size="small">
              <Link url="/" removeUnderline>
                ERP
              </Link>
            </DisplayText>
            {isLocal && (
              <Stack alignment="center">
                <Button plain url="/dev_zone" icon={BugMajor} />
              </Stack>
            )}
          </div>
          <div className="Avada-TopBar__Icons">
            <Stack alignment="center" spacing="extraTight">
              <Button plain url={docLink} external>
                <Thumbnail source={InfoIcon} size="small" alt="" />
              </Button>
              <Button plain onClick={() => openNewsSheet()}>
                <Thumbnail source={NotificationIcon} size="small" alt="" />
              </Button>
            </Stack>
          </div>
          {newsSheet}
        </div>
      }
      userMenu={
        <TopBar.UserMenu
          name={user?.user?.fullName}
          avatar={user?.user?.avatar}
          initials={user?.user?.fullName[0]}
          open={isUserMenuOpen}
          onToggle={toggleIsUserMenuOpen}
          actions={[
            {
              items: [{content: 'My account', icon: CustomersMajor, onAction: handleLinkToProfile}]
            },
            {
              items: [{content: 'Log out', icon: LogOutMinor, onAction: handleLogout}]
            }
          ]}
        />
      }
    />
  );
}

AppTopBar.propTypes = {
  isNavOpen: PropTypes.bool,
  toggleOpenNav: PropTypes.func
};
