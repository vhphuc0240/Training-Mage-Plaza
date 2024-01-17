import React from 'react';
import PropTypes from 'prop-types';
import {Button, Page, TextStyle} from '@shopify/polaris';
import './PreviewMediaSetup.scss';
import moment from 'moment';
import {HideMinor, ViewMinor} from '@shopify/polaris-icons';

/**
 * @param settings
 * @param medias
 * @param isPreview
 * @param handleEditHidden
 * @returns {JSX.Element}
 * @constructor
 */
export default function PreviewMediaSetup({
  settings,
  medias,
  isPreview = true,
  handleEditHidden = () => {}
}) {
  return (
    <>
      {medias?.length > 0 && (
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
              {medias.map((media, index) => (
                <div
                  key={media?.id}
                  className="Container-Preview__ItemContainer"
                  style={{
                    display: settings.col * settings.row <= index ? 'none' : 'block'
                  }}
                >
                  <img
                    src={media?.media_type === 'VIDEO' ? media?.thumbnail_url : media?.media_url}
                    alt=""
                    className="Preview_ItemContainer--HoverTrigger"
                  />
                  <div className="Preview_ItemContainer--HoverText">
                    {moment(media.timestamp).format('LL')}
                    {isPreview && (
                      <Button
                        plain
                        icon={media?.hidden ? ViewMinor : HideMinor}
                        onClick={() => handleEditHidden(media?.docId, media?.id, !media?.hidden)}
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Page>
      )}
    </>
  );
}

PreviewMediaSetup.propTypes = {
  settings: PropTypes.shape({
    col: PropTypes.string,
    row: PropTypes.string,
    title: PropTypes.string,
    spacing: PropTypes.string
  }),
  medias: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      media_url: PropTypes.string,
      timestamp: PropTypes.string
    })
  ),
  isPreview: PropTypes.bool,
  handleEditHidden: PropTypes.func
};
