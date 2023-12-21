import {Card, Layout, Page} from '@shopify/polaris';
import React, {useRef} from 'react';

import useConfirmModal from '@assets/hooks/popup/useConfirmModal';
import ListUser from './ListUser';
import UserDataModal from './UserDataModal';
import useCreateApi from '@assets/hooks/api/useCreateApi';
import useFetchApi from '@assets/hooks/api/useFetchApi';
import {read, utils} from 'xlsx';
import * as Yup from 'yup';
import {setToast} from '@assets/actions/storeActions';
import {useStore} from '@assets/reducers/storeReducer';

const schema = Yup.object().shape({
  fullName: Yup.string().required(),
  email: Yup.string()
    .email()
    .required(),
  englishName: Yup.string(),
  role: Yup.string().matches(/(user|admin)/),
  active: Yup.string().matches(/(true|false)/)
});
export default function User() {
  const {dispatch} = useStore();
  const inputFileRef = useRef(null);
  const initialInput = {
    email: '',
    role: 'user',
    fullName: '',
    active: false
  };
  const inputRef = useRef(initialInput);
  const {data, loading, setData} = useFetchApi({
    url: '/users',
    initLoad: true
  });
  const {handleCreate: handleCreateUser, creating: creatingUser} = useCreateApi({
    url: '/user',
    fullResp: true
  });
  const {handleCreate: handleCreateUsers, creating: creatingUsers} = useCreateApi({
    url: '/users',
    fullResp: true
  });
  const modalContent = () => <UserDataModal inputRef={inputRef} />;
  const {modal, openModal, closeModal} = useConfirmModal({
    confirmAction: async () => {
      const resp = await handleCreateUser(inputRef.current);
      setData(prev => [...prev, resp.data]);
      inputRef.current = initialInput;
      closeModal();
    },
    title: 'Create User',
    buttonTitle: 'Create',
    HtmlContent: modalContent,
    defaultCurrentInput: inputRef.current,
    loading: creatingUser
  });
  const handleOnClickBulk = () => {
    inputFileRef.current.click();
  };
  const onChangeFile = e => {
    e.stopPropagation();
    e.preventDefault();
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = async evt => {
      const binaryStr = evt.target.result;
      const wb = read(binaryStr, {type: 'binary'});
      const ws = wb.Sheets[wb.SheetNames[0]];
      const dataFromCsv = utils.sheet_to_json(ws);
      const dataToCreate = dataFromCsv.map(item => {
        return schema
          .validate(item)
          .then(val => {
            return {
              ...val,
              active: val.active === 'true',
              role: [val.role.toLowerCase()],
              createdAt: {_seconds: Date.now() / 1000}
            };
          })
          .catch(() => {
            setToast(dispatch, `Fail to import user: ${item.email}`, true);
          });
      });
      const res = (await Promise.all(dataToCreate)).filter(item => item !== undefined);
      const resp = await handleCreateUsers(res);
      if (resp.success) {
        setToast(
          dispatch,
          `Import ${resp.data.length} / ${dataToCreate.length} users successful`,
          true
        );
        setData(prev => [...prev, ...resp.data]);
      }
    };
    reader.readAsBinaryString(file);
  };
  return (
    <Page
      title="User"
      primaryAction={{content: 'Create', onClick: openModal}}
      secondaryActions={[
        {
          content: 'Import user from file',
          onAction: handleOnClickBulk,
          outline: true,
          loading: creatingUsers
        }
      ]}
    >
      <input
        type="file"
        id="file"
        accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
        ref={inputFileRef}
        style={{display: 'none'}}
        onChange={onChangeFile.bind(this)}
      />
      <Layout>
        <Layout.Section>
          <Card>
            <ListUser data={data} setData={setData} loading={loading} />
          </Card>
        </Layout.Section>
      </Layout>
      {modal}
    </Page>
  );
}
