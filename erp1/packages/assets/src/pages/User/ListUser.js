import {
  Avatar,
  Button,
  DisplayText,
  IndexTable,
  Stack,
  useIndexResourceState
} from '@shopify/polaris';
import React, {useRef} from 'react';
import useDeleteApi from '@assets/hooks/api/useDeleteApi';
import useEditApi from '@assets/hooks/api/useEditApi';
import useConfirmModal from '@assets/hooks/popup/useConfirmModal';
import UserDataModal from '@assets/pages/User/UserDataModal';

export default function ListUser({data, setData, loading}) {
  const initialInput = {
    email: '',
    role: 'user',
    fullName: '',
    active: false
  };
  const inputRef = useRef(initialInput);
  const handleUpdateUser = async () => {
    const {id, ...rest} = inputRef.current;
    const resp = await handleEdit({id, updateFields: rest});
    if (resp.success) {
      setData(prev =>
        prev.map(user => {
          if (user.id === resp.data.id) {
            return resp.data;
          }
          return user;
        })
      );
      inputRef.current = initialInput;
      closeModal();
    }
  };
  const modalContent = () => <UserDataModal inputRef={inputRef} isEditing />;
  const {editing, handleEdit} = useEditApi({
    fullResp: true,
    url: '/user'
  });
  const {openModal, closeModal, modal} = useConfirmModal({
    title: 'Update User',
    buttonTitle: 'Update',
    defaultCurrentInput: inputRef.current,
    confirmAction: handleUpdateUser,
    HtmlContent: modalContent,
    loading: editing
  });
  const {deleting, handleDelete} = useDeleteApi({url: '/user'});

  const {selectedResources, allResourcesSelected, handleSelectionChange} = useIndexResourceState(
    data
  );

  const handleOpenModalUpdateUser = user => {
    inputRef.current = user;
    openModal();
  };
  const handleDeleteUser = async id => {
    const resp = await handleDelete({ids: [id]});
    if (resp) {
      setData(prev => prev.filter(user => user.id !== id));
    }
  };

  const handleDeleteBulkUsers = async () => {
    const resp = await handleDelete({ids: selectedResources});
    if (resp) {
      setData(prev => prev.filter(user => !selectedResources.includes(user.id)));
    }
  };
  const promotedBulkActions = [
    {
      content: 'Delete users',
      onAction: handleDeleteBulkUsers
    }
  ];

  const rowMarkup = data.map((user, index) => (
    <IndexTable.Row
      id={user.id}
      key={user.id}
      selected={selectedResources.includes(user.id)}
      position={index}
    >
      <IndexTable.Cell>{index + 1}</IndexTable.Cell>
      <IndexTable.Cell>
        <Stack alignment="center">
          <Avatar source={user.avatar} alt={user.fullName} />
          <DisplayText size="small">{user.fullName}</DisplayText>
        </Stack>
      </IndexTable.Cell>
      <IndexTable.Cell>{user.email}</IndexTable.Cell>
      <IndexTable.Cell>{user.role.toString()}</IndexTable.Cell>
      <IndexTable.Cell>
        {new Date(user.createdAt._seconds * 1000).toLocaleDateString('vi-VN').toString()}
      </IndexTable.Cell>
      <IndexTable.Cell>
        <Stack alignment="center" distribution="equalSpacing">
          <Button onClick={() => handleOpenModalUpdateUser(user)}>Update</Button>
          <Button
            onClick={() => handleDeleteUser(user.id)}
            destructive
            loading={selectedResources.includes(user.id) && deleting}
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
          {title: 'Name'},
          {title: 'Email'},
          {title: 'Role'},
          {title: 'Created At'},
          {title: 'Action'}
        ]}
        onSelectionChange={handleSelectionChange}
        itemCount={data.length}
        loading={loading}
        resourceName={{
          singular: 'user',
          plural: 'users'
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
