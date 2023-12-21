import {Button, IndexTable, Stack, useIndexResourceState} from '@shopify/polaris';
import React, {useRef} from 'react';
import useDeleteApi from '@assets/hooks/api/useDeleteApi';
import useEditApi from '@assets/hooks/api/useEditApi';
import useConfirmModal from '@assets/hooks/popup/useConfirmModal';
import MetaFieldModalContent from '@assets/pages/Settings/components/MeataFieldTab/MetaFieldModalContent';
import moment from 'moment/moment';

export default function ListMetaField({data, setData, loading}) {
  const initialInput = {
    address: '',
    format: 'json',
    topic: 'orders/create'
  };
  const inputRef = useRef(initialInput);
  const handleUpdateMetaField = async () => {
    const {id, ...rest} = inputRef.current;
    const resp = await handleEdit({id, updateFields: rest});
    if (resp.success) {
      setData(prev =>
        prev.map(metafield => {
          if (metafield.id === resp.data.id) {
            return resp.data;
          }
          return metafield;
        })
      );
      inputRef.current = initialInput;
      closeModal();
    }
  };
  const modalContent = () => <MetaFieldModalContent inputRef={inputRef} isEditing />;
  const {editing, handleEdit} = useEditApi({
    fullResp: true,
    url: '/metafield'
  });
  const {openModal, closeModal, modal} = useConfirmModal({
    title: 'Update MetaField',
    buttonTitle: 'Update',
    defaultCurrentInput: inputRef.current,
    confirmAction: handleUpdateMetaField,
    HtmlContent: modalContent,
    loading: editing
  });
  const {deleting, handleDelete} = useDeleteApi({url: '/metafield'});

  const {selectedResources, allResourcesSelected, handleSelectionChange} = useIndexResourceState(
    data
  );

  const handleOpenModalUpdateMetaField = metafield => {
    inputRef.current = metafield;
    openModal();
  };
  const handleDeleteMetaField = async id => {
    const resp = await handleDelete({ids: [id]});
    if (resp) {
      setData(prev => prev.filter(metafield => metafield.id !== id));
    }
  };

  const handleDeleteBulkMetaFields = async () => {
    const resp = await handleDelete({ids: selectedResources});
    if (resp) {
      setData(prev => prev.filter(metafield => !selectedResources.includes(metafield.id)));
    }
  };
  const promotedBulkActions = [
    {
      content: 'Delete metafields',
      onAction: handleDeleteBulkMetaFields
    }
  ];

  const rowMarkup = data.map((metafield, index) => (
    <IndexTable.Row
      id={metafield.id}
      key={metafield.id}
      selected={selectedResources.includes(metafield.id)}
      position={index}
    >
      <IndexTable.Cell>{index + 1}</IndexTable.Cell>
      <IndexTable.Cell>{metafield.owner_resource}</IndexTable.Cell>
      <IndexTable.Cell>{metafield.type}</IndexTable.Cell>
      <IndexTable.Cell>{metafield.namespace}</IndexTable.Cell>
      <IndexTable.Cell>{metafield.key}</IndexTable.Cell>
      <IndexTable.Cell>{metafield.description}</IndexTable.Cell>
      <IndexTable.Cell>{metafield.value}</IndexTable.Cell>
      <IndexTable.Cell>
        {moment(new Date(metafield.created_at).getTime()).format('LL')}
      </IndexTable.Cell>
      <IndexTable.Cell>
        <Stack alignment="center" distribution="equalSpacing">
          <Button onClick={() => handleOpenModalUpdateMetaField(metafield)}>Update</Button>
          <Button
            onClick={() => handleDeleteMetaField(metafield.id)}
            destructive
            loading={selectedResources.includes(metafield.id) && deleting}
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
          {title: 'Owner Resource'},
          {title: 'Type'},
          {title: 'Namespace'},
          {title: 'Key'},
          {title: 'Description'},
          {title: 'Value'},
          {title: 'Created At'},
          {title: 'Action'}
        ]}
        onSelectionChange={handleSelectionChange}
        itemCount={data.length}
        loading={loading}
        resourceName={{
          singular: 'metafield',
          plural: 'metafields'
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
