import React, {useCallback, useState} from 'react';
import {Page, Select, TextField} from '@shopify/polaris';

const TriggerTab = ({settings, onChangeInput}) => {
  const [selectedShows, setSelectedShows] = useState(settings.allowShow);

  const handleShowSelectChange = useCallback(value => setSelectedShows(value), []);
  const ShowOptions = [
    {
      label: 'All pages',
      value: 'all'
    },
    {
      label: 'Specific pages',
      value: 'specific'
    }
  ];
  const InputContents = {
    all: [
      {
        label: 'Excluded pages',
        helpText: 'Page URLs NOT to show the pop-up (separated by new lines)',
        type: 'excludedUrls'
      }
    ],
    specific: [
      {
        label: 'Included pages',
        helpText: 'Page URLs to show the pop-up (separated by new lines)',
        type: 'includedUrls'
      },
      {
        label: 'Excluded pages',
        helpText: 'Page URLs NOT to show the pop-up (separated by new lines)',
        type: 'excludedUrls'
      }
    ]
  };
  return (
    <Page title="PAGES RESTRICTION">
      <Select
        label=""
        options={ShowOptions}
        onChange={handleShowSelectChange}
        value={selectedShows}
      />
      {InputContents[selectedShows].map((content, index) => (
        <TextField
          key={index}
          label={content.label}
          autoComplete="off"
          helpText={content.helpText}
          multiline={4}
          value={settings[content.type]}
          onChange={value => onChangeInput(content.type, value)}
        />
      ))}
    </Page>
  );
};

export default TriggerTab;
