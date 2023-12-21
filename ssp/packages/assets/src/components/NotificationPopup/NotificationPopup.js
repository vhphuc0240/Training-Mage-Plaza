import React from 'react';
import './NoticationPopup.scss';
import moment from 'moment';
import {truncateString} from '@assets/helpers/utils/trucateString';
import PropTypes from 'prop-types';

const NotificationPopup = ({
  firstName = 'John Doe',
  city = 'New York',
  country = 'United States',
  productName = 'Puffer Jacket With Hidden Hood',
  timestamp = Date.now(),
  productImage = 'http://paris.mageplaza.com/images/shop/single/big-1.jpg',
  settings = {truncateProductName: true, hideTimeAgo: false}
}) => {
  const {hideTimeAgo, truncateProductName} = settings;
  return (
    <div className="Avava-SP__Wrapper fadeInUp animated">
      <div className="Avava-SP__Inner">
        <div className="Avava-SP__Container">
          <a href="#" className={'Avava-SP__LinkWrapper'}>
            <div
              className="Avava-SP__Image"
              style={{
                backgroundImage: `url(${productImage})`
              }}
            ></div>
            <div className="Avada-SP__Content">
              <div className={'Avada-SP__Title'}>
                {firstName} in {city}, {country}
              </div>
              <div className={'Avada-SP__Subtitle'}>
                purchased {truncateProductName ? truncateString(productName, 16) : productName}
              </div>
              <div className={'Avada-SP__Footer'}>
                {hideTimeAgo ? '' : `${moment(timestamp).fromNow()}`}{' '}
                <span className="uni-blue">
                  <i className="fa fa-check" aria-hidden="true" /> by Avada
                </span>
              </div>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
};

NotificationPopup.propTypes = {
  firstName: PropTypes.string,
  city: PropTypes.string,
  country: PropTypes.string,
  productName: PropTypes.string,
  timestamp: PropTypes.number,
  productImage: PropTypes.string,
  settings: PropTypes.shape({
    truncateProductName: PropTypes.bool,
    hideTimeAgo: PropTypes.bool
  })
};

export default NotificationPopup;
