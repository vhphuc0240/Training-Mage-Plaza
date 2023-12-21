import React, {useEffect} from 'react';

import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NotificationPopup from '@assets/components/NotificationPopup/NotificationPopup';
import PropTypes from 'prop-types';

const NotificationContainer = ({notifications, settings}) => {
  const {
    truncateProductName,
    hideTimeAgo,
    displayDuration,
    maxPopsDisplay,
    position,
    popsInterval,
    firstDelay
  } = settings;
  useEffect(() => {
    notifications.map((notification, index) => {
      const {id, firstName, productName, city, productImage, country, timestamp} = notification;
      toast(
        <NotificationPopup
          settings={{
            truncateProductName: truncateProductName,
            hideTimeAgo: hideTimeAgo
          }}
          firstName={firstName}
          productName={productName}
          city={city}
          productImage={productImage}
          country={country}
          timestamp={timestamp}
        />,
        {
          containerId: 'Test-Notifications',
          toastId: id,
          delay: firstDelay * 1000 + popsInterval * 1000 * index
        }
      );
    });
  }, []);
  return (
    <div>
      <ToastContainer
        limit={maxPopsDisplay}
        newestOnTop
        position={position}
        autoClose={+Number(displayDuration) * 1000}
      />
    </div>
  );
};

NotificationContainer.propTypes = {
  notifications: PropTypes.arrayOf(
    PropTypes.shape({
      firstName: PropTypes.string,
      city: PropTypes.string,
      country: PropTypes.string,
      productName: PropTypes.string,
      timestamp: PropTypes.number,
      productImage: PropTypes.string
    })
  ),
  settings: PropTypes.shape({
    truncateProductName: PropTypes.bool,
    hideTimeAgo: PropTypes.bool,
    displayDuration: PropTypes.number,
    maxPopsDisplay: PropTypes.number,
    position: PropTypes.string,
    popsInterval: PropTypes.number,
    firstDelay: PropTypes.number
  })
};
export default NotificationContainer;
