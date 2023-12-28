import React from 'react';
import {Button, DisplayText, Icon, Link, Stack, Thumbnail, TopBar} from '@shopify/polaris';
import PropTypes from 'prop-types';
import {
  BugMajor,
  MobileCancelMajor,
  MobileHamburgerMajor,
  PaymentsMajor
} from '@shopify/polaris-icons';
import isLocal from '@assets/helpers/isLocal';
import {docLink} from '@assets/config/menuLink';
import InfoIcon from '@assets/resources/icons/info.svg';
import NotificationIcon from '@assets/resources/icons/notification.svg';
import {LOGO_URL, LOGO_WIDTH} from '@assets/config/theme';
import '@assets/styles/layout/topbar.scss';
import {isShopUpgradable} from '@assets/services/shopService';
import {useStore} from '@assets/reducers/storeReducer';
import useConfirmSheet from '@assets/hooks/popup/useConfirmSheet';
import AppNewsSheet from '@assets/components/AppNews/AppNewsSheet';

/**
 * @param {boolean} isNavOpen
 * @param {function} toggleOpenNav
 * @return {JSX.Element}
 * @constructor
 */
export default function AppTopBar({isNavOpen, toggleOpenNav}) {
  const {state} = useStore();
  const {shop} = state;

  const {sheet: newsSheet, openSheet: openNewsSheet} = useConfirmSheet({Content: AppNewsSheet});

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
                App Name
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
          {isShopUpgradable(shop) && (
            <Button url="/subscription">
              <Stack alignment="center">
                <Icon source={PaymentsMajor} />
                <Stack.Item>Subscription</Stack.Item>
              </Stack>
            </Button>
          )}
          {newsSheet}
        </div>
      }
    />
  );
}

AppTopBar.propTypes = {
  isNavOpen: PropTypes.bool,
  toggleOpenNav: PropTypes.func
};
