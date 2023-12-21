import {Button, IndexTable, Stack, useIndexResourceState} from '@shopify/polaris';
import React, {useRef} from 'react';
import useDeleteApi from '@assets/hooks/api/useDeleteApi';
import useEditApi from '@assets/hooks/api/useEditApi';
import useConfirmModal from '@assets/hooks/popup/useConfirmModal';
import WebhookModalContent from '@assets/pages/Settings/components/WebhookTab/WebhookModalContent';

export default function ListWebhook({data, setData, loading}) {
  const initialInput = {
    address: '',
    format: 'json',
    topic: 'orders/create'
  };
  const inputRef = useRef(initialInput);
  const handleUpdateWebhook = async () => {
    const {id, ...rest} = inputRef.current;
    const resp = await handleEdit({id, updateFields: rest});
    if (resp.success) {
      setData(prev =>
        prev.map(webhook => {
          if (webhook.id === resp.data.id) {
            return resp.data;
          }
          return webhook;
        })
      );
      inputRef.current = initialInput;
      closeModal();
    }
  };
  const modalContent = () => <WebhookModalContent inputRef={inputRef} isEditing />;
  const {editing, handleEdit} = useEditApi({
    fullResp: true,
    url: '/webhook'
  });
  const {openModal, closeModal, modal} = useConfirmModal({
    title: 'Update Webhook',
    buttonTitle: 'Update',
    defaultCurrentInput: inputRef.current,
    confirmAction: handleUpdateWebhook,
    HtmlContent: modalContent,
    loading: editing
  });
  const {deleting, handleDelete} = useDeleteApi({url: '/webhook'});

  const {selectedResources, allResourcesSelected, handleSelectionChange} = useIndexResourceState(
    data
  );

  const handleOpenModalUpdateWebhook = webhook => {
    inputRef.current = webhook;
    openModal();
  };
  const handleDeleteWebhook = async id => {
    const resp = await handleDelete({ids: [id]});
    if (resp) {
      setData(prev => prev.filter(webhook => webhook.id !== id));
    }
  };

  const handleDeleteBulkWebhooks = async () => {
    const resp = await handleDelete({ids: selectedResources});
    if (resp) {
      setData(prev => prev.filter(webhook => !selectedResources.includes(webhook.id)));
    }
  };
  const promotedBulkActions = [
    {
      content: 'Delete webhooks',
      onAction: handleDeleteBulkWebhooks
    }
  ];

  const rowMarkup = data.map((webhook, index) => (
    <IndexTable.Row
      id={webhook.id}
      key={webhook.id}
      selected={selectedResources.includes(webhook.id)}
      position={index}
    >
      <IndexTable.Cell>{index + 1}</IndexTable.Cell>
      <IndexTable.Cell>{webhook.address}</IndexTable.Cell>
      <IndexTable.Cell>{webhook.format}</IndexTable.Cell>
      <IndexTable.Cell>{webhook.topic}</IndexTable.Cell>
      <IndexTable.Cell>{new Date(webhook.created_at).getTime()}</IndexTable.Cell>
      <IndexTable.Cell>
        <Stack alignment="center" distribution="equalSpacing">
          <Button onClick={() => handleOpenModalUpdateWebhook(webhook)}>Update</Button>
          <Button
            onClick={() => handleDeleteWebhook(webhook.id)}
            destructive
            loading={selectedResources.includes(webhook.id) && deleting}
          >
            Delete
          </Button>
        </Stack>
      </IndexTable.Cell>
    </IndexTable.Row>
  ));

  return (
    <>
      <IndexTable
        selectedItemsCount={allResourcesSelected ? 'All' : selectedResources.length}
        headings={[
          {title: 'ID'},
          {title: 'Address'},
          {title: 'Format'},
          {title: 'Topic'},
          {title: 'Created At'},
          {title: 'Action'}
        ]}
        onSelectionChange={handleSelectionChange}
        itemCount={data.length}
        loading={loading}
        resourceName={{
          singular: 'webhook',
          plural: 'webhooks'
        }}
        promotedBulkActions={promotedBulkActions}
        lastColumnSticky
      >
        {rowMarkup}
      </IndexTable>
      {modal}
    </>
  );
}
