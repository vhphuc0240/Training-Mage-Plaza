import React from 'react';
import {Page} from '@shopify/polaris';
import useFetchApi from '@assets/hooks/api/useFetchApi';
import ListWebhook from '@assets/pages/Settings/components/WebhookTab/ListWebhook';

const WebhookTab = () => {
  const {data, setData, loading} = useFetchApi({url: '/webhooks'});
  return (
    <>
      <Page title="Webhook">
        <ListWebhook data={data} setData={setData} loading={loading} />
      </Page>
    </>
  );
};
export default WebhookTab;
