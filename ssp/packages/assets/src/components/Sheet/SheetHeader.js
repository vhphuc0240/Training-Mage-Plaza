import React from 'react';
import {Button, DisplayText} from '@shopify/polaris';
import * as PropTypes from 'prop-types';
import {MobileCancelMajor} from '@shopify/polaris-icons';

/**
 * @param handleClose
 * @param title
 * @param loading
 * @param children
 * @returns {JSX.Element}
 * @constructor
 */
export default function SheetHeader({handleClose, title = '', loading = false, children}) {
  return (
    <div className="Avada-Sheet__Header">
      {title && <DisplayText size="small">{title}</DisplayText>}
      {children}
      <Button icon={MobileCancelMajor} disabled={loading} onClick={() => handleClose()} plain />
    </div>
  );
}

SheetHeader.propTypes = {
  handleClose: PropTypes.func,
  title: PropTypes.string,
  loading: PropTypes.bool,
  children: PropTypes.node
};
