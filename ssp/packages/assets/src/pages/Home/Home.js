import React, {useState} from 'react';
import {Frame, Layout, SettingToggle, TextStyle} from '@shopify/polaris';

/**
 * Render a home page for overview
 *
 * @return {React.ReactElement}
 * @constructor
 */
export default function Home() {
  const [enabled, setEnabled] = useState(false);

  return (
    <Frame title="Home">
      <Layout>
        <Layout.Section>
          <SettingToggle
            action={{
              content: enabled ? 'Disable' : 'Enable',
              onAction() {
                setEnabled(prev => !prev);
              }
            }}
            enabled={enabled}
          >
            <TextStyle>Our app is {enabled ? 'enabled' : 'disabled'} on your store</TextStyle>
          </SettingToggle>
        </Layout.Section>
      </Layout>
    </Frame>
  );
}
