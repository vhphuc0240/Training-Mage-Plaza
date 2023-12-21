import React, {useRef} from 'react';
import {Page} from '@shopify/polaris';
import useFetchApi from '@assets/hooks/api/useFetchApi';
import ListWebhook from '@assets/pages/Settings/components/WebhookTab/ListWebhook';
import useCreateApi from '@assets/hooks/api/useCreateApi';
import useConfirmModal from '@assets/hooks/popup/useConfirmModal';
import WebhookModalContent from '@assets/pages/Settings/components/WebhookTab/WebhookModalContent';

const WebhookTab = () => {
  const initialInput = {
    address: '',
    format: 'json',
    topic: 'orders/create'
  };
  const inputRef = useRef(initialInput);

  const {data, setData, loading} = useFetchApi({url: '/webhooks'});
  const {handleCreate: handleCreateWebhook, creating: creatingWebhook} = useCreateApi({
    url: '/webhook',
    fullResp: true
  });
  const modalContent = () => <WebhookModalContent inputRef={inputRef} />;
  const {modal, openModal, closeModal} = useConfirmModal({
    confirmAction: async () => {
      const resp = await handleCreateWebhook(inputRef.current);
      setData(prev => [...prev, resp.data]);
      inputRef.current = initialInput;
      closeModal();
    },
    title: 'Create Webhook',
    buttonTitle: 'Create',
    HtmlContent: modalContent,
    defaultCurrentInput: inputRef.current,
    loading: creatingWebhook
  });
  return (
    <>
      <Page title="Webhook" primaryAction={{content: 'Create', onClick: openModal}}>
        <ListWebhook data={data} setData={setData} loading={loading} />
      </Page>
      {modal}
    </>
  );
};
export default WebhookTab;
