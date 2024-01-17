import {Card} from '@shopify/polaris';
import PreviewMediaSetup from '@assets/components/PreviewMediaSetup/PreviewMediaSetup';
import React from 'react';
import PropTypes from 'prop-types';

/**
 * @param settings
 * @param medias
 * @param handleEditHidden
 * @param isPreview
 * @returns {JSX.Element}
 * @constructor
 */
export default function Preview({settings, medias, handleEditHidden = () => {}, isPreview = true}) {
  return (
    <Card sectioned title="Preview">
      <Card.Section>
        <PreviewMediaSetup
          settings={settings}
          medias={medias}
          handleEditHidden={handleEditHidden}
        />
      </Card.Section>
    </Card>
  );
}

Preview.propTypes = {
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
