import React from 'react';
import DesktopPositionInput from '@assets/components/DesktopPositionInput/DesktopPositionInput';
import { Checkbox, Layout, Page} from '@shopify/polaris';
import InputWrapper from '@assets/pages/Settings/components/InputWrapper/InputWrapper';

const DisplayTab = ({settings, onChangeInput}) => {
  const TimeInputContents = [
    {
      label: 'Display duration',
      value: settings.displayDuration,
      type: 'displayDuration',
      unit: 'second',
      helpText: 'How long each pop will display on your page'
    },
    {
      label: 'Time before the first props',
      value: settings.firstDelay,
      type: 'firstDelay',
      unit: 'second',
      helpText: 'The delay time before the first notification'
    },
    {
      label: 'Gap time between two pops',
      value: settings.popsInterval,
      type: 'popsInterval',
      unit: 'second',
      helpText: 'The time interval between two popup notification'
    },
    {
      label: 'Maximum of popups',
      value: settings.maxPopsDisplay,
      type: 'maxPopsDisplay',
      unit: 'pop',
      helpText:
        'The maximum number of popups are allowed to show after page loading. Maximum number is 80.',
      max: 80,
      min: 10
    }
  ];
  return (
    <>
      <Page title="APPEARANCE">
        <DesktopPositionInput
          label="Desktop Position"
          value={settings.position}
          helpText="The display position of the pop on your website"
          onChange={value => onChangeInput('position', value)}
        />
        <Checkbox
          label="Hide time ago"
          value={settings.hideTimeAgo}
          onChange={newChecked => onChangeInput('hideTimeAgo', !settings.hideTimeAgo)}
          checked={settings.hideTimeAgo}
        />
        <br />
        <Checkbox
          label="Truncate content text"
          value={settings.truncateProductName}
          onChange={newChecked =>
            onChangeInput('truncateProductName', !settings.truncateProductName)
          }
          checked={settings.truncateProductName}
          helpText="If your product name is long, it will be truncate to 'Product n...'"
        />
      </Page>
      <Page title="TIMING">
        <Layout>
          {TimeInputContents.map((tic, index) => (
            <Layout.Section oneHalf key={index}>
              <InputWrapper
                label={tic.label}
                value={tic.value}
                helpText={tic.helpText}
                min={tic.min}
                max={tic.max}
                onChangeInput={onChangeInput}
                unit={tic.unit}
                type={tic.type}
              />
            </Layout.Section>
          ))}
        </Layout>
      </Page>
    </>
  );
};
export default DisplayTab;
