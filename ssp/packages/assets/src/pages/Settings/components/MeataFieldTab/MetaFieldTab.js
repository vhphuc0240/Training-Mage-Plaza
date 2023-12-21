import React, {useRef} from 'react';
import {Page} from '@shopify/polaris';
import useFetchApi from '@assets/hooks/api/useFetchApi';
import useCreateApi from '@assets/hooks/api/useCreateApi';
import useConfirmModal from '@assets/hooks/popup/useConfirmModal';
import ListMetaField from '@assets/pages/Settings/components/MeataFieldTab/ListMetaField';
import MetaFieldModalContent from '@assets/pages/Settings/components/MeataFieldTab/MetaFieldModalContent';

const MetaFieldTab = () => {
  const initialInput = {
    address: '',
    format: 'json',
    topic: 'orders/create'
  };
  const inputRef = useRef(initialInput);

  const {data, setData, loading} = useFetchApi({url: '/metafields'});
  const {handleCreate: handleCreateMetaField, creating: creatingMetaField} = useCreateApi({
    url: '/metafield',
    fullResp: true
  });
  const modalContent = () => <MetaFieldModalContent inputRef={inputRef} />;
  const {modal, openModal, closeModal} = useConfirmModal({
    confirmAction: async () => {
      const resp = await handleCreateMetaField(inputRef.current);
      setData(prev => [...prev, resp.data]);
      inputRef.current = initialInput;
      closeModal();
    },
    title: 'Create MetaField',
    buttonTitle: 'Create',
    HtmlContent: modalContent,
    defaultCurrentInput: inputRef.current,
    loading: creatingMetaField
  });
  return (
    <>
      <Page title="MetaField" primaryAction={{content: 'Create', onClick: openModal}}>
        <ListMetaField data={data} setData={setData} loading={loading} />
      </Page>
      {modal}
    </>
  );
};
export default MetaFieldTab;
