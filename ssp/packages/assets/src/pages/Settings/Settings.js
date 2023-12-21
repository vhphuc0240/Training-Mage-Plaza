import React, {useCallback, useState} from 'react';
import {Card, Layout, Page, Tabs} from '@shopify/polaris';
import DisplayTab from '@assets/pages/Settings/components/DisplayTab/DisplayTab';
import TriggerTab from '@assets/pages/Settings/components/TriggerTab/TriggerTab';
import NotificationPopup from '@assets/components/NotificationPopup/NotificationPopup';
import useFetchApi from '@assets/hooks/api/useFetchApi';
import useEditApi from '@assets/hooks/api/useEditApi';
import WebhookTab from '@assets/pages/Settings/components/WebhookTab';
import MeataFieldTab from '@assets/pages/Settings/components/MeataFieldTab';

/**
 * @return {JSX.Element}
 */
export default function Settings() {
  const {data: settings, setData: setSettings} = useFetchApi({url: '/settings'});
  const {editing, handleEdit} = useEditApi({
    url: '/settings',
    data: settings
  });
  const handleSaveSettings = async () => {
    await handleEdit(settings);
  };
  const [selectedTab, setSelectedTab] = useState(0);

  const handleTabChange = useCallback(selectedTabIndex => setSelectedTab(selectedTabIndex), []);
  const onChangeInput = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const tabs = [
    {
      id: 'display',
      content: 'Display',
      accessibilityLabel: 'Display',
      panelID: 'display',
      child: <DisplayTab settings={settings} onChangeInput={onChangeInput} />
    },
    {
      id: 'triggers',
      content: 'Triggers',
      accessibilityLabel: 'Triggers',
      panelID: 'triggers',
      child: <TriggerTab settings={settings} onChangeInput={onChangeInput} />
    },
    {
      id: 'webhook',
      content: 'Webhook',
      accessibilityLabel: 'Webhook',
      panelID: 'webhook',
      child: <WebhookTab />
    },
    {
      id: 'metafield',
      content: 'Meta Field',
      accessibilityLabel: 'Meta Field',
      panelID: 'metafield',
      child: <MeataFieldTab />
    }
  ];
  return (
    <Page
      fullWidth
      title="Settings"
      subtitle="Decide how your notifications will display"
      primaryAction={{content: 'Save', onClick: handleSaveSettings, loading: editing}}
    >
      <Layout>
        <Layout.Section oneThird>
          <Card sectioned>
            <NotificationPopup
              fistName={'John'}
              city={'New York'}
              productName={'Product 1'}
              country={'USA'}
              productId={'123456'}
              timestamp={Date.now()}
              productImage={'https://picsum.photos/70'}
              settings={{
                truncateProductName: settings.truncateProductName,
                hideTimeAgo: settings.hideTimeAgo
              }}
            />
          </Card>
        </Layout.Section>
        <Layout.Section>
          <Card sectioned>
            <Tabs tabs={tabs} selected={selectedTab} onSelect={handleTabChange}>
              {tabs[selectedTab]?.child}
            </Tabs>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}

Settings.propTypes = {};
