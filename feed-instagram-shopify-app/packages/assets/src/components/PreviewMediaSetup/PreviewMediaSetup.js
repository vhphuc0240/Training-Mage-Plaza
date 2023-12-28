import React from 'react';
import PropTypes from 'prop-types';
import {Page, TextStyle} from '@shopify/polaris';
import './PreviewMediaSetup.scss';
import moment from 'moment';

/**
 * @param settings
 * @returns {JSX.Element}
 * @constructor
 */
function PreviewMediaSetup({settings}) {
  const medias = JSON.parse(localStorage.getItem('user'))?.user?.medias;
  return (
    <Page fullWidth>
      <div className="Container">
        <div className="Container-Title">
          <TextStyle variation="strong">{settings?.title}</TextStyle>
        </div>
        <div
          className="Container-Preview"
          style={{
            width: 'fit-content',
            display: 'grid',
            gridTemplateColumns: `repeat(${settings?.col}, 1fr)`,
            gridTemplateRows: `repeat(${settings?.row}, 1fr)`,
            gridGap: settings?.spacing
          }}
        >
          {medias.map(media => (
            <>
              <div className="Container-Preview__ItemContainer">
                <img
                  src={media?.media_url}
                  alt=""
                  className="Preview_ItemContainer--HoverTrigger"
                />
                <div className="Preview_ItemContainer--HoverText">
                  {moment(media.timestamp).format('LL')}
                </div>
              </div>
              <div className="Container-Preview__ItemContainer">
                <img
                  src={media?.media_url}
                  alt=""
                  className="Preview_ItemContainer--HoverTrigger"
                />
                <div className="Preview_ItemContainer--HoverText">
                  {moment(media.timestamp).format('LL')}
                </div>
              </div>
              <div className="Container-Preview__ItemContainer">
                <img
                  src={media?.media_url}
                  alt=""
                  className="Preview_ItemContainer--HoverTrigger"
                />
                <div className="Preview_ItemContainer--HoverText">
                  {moment(media.timestamp).format('LL')}
                </div>
              </div>
            </>
          ))}
        </div>
      </div>
    </Page>
  );
}

PreviewMediaSetup.PropTypes = {
  settings: PropTypes.shape({
    col: PropTypes.number,
    row: PropTypes.number,
    title: PropTypes.string,
    spacing: PropTypes.string
  })
};

export default PreviewMediaSetup;
