import React, {useEffect, useState} from 'react';
import * as ReactDOM from 'react-dom';
import {
  Button,
  Card,
  Form,
  FormLayout,
  Layout,
  Page,
  Select,
  Stack,
  TextField,
  TextStyle
} from '@shopify/polaris';
import {useStore} from '@assets/reducers/storeReducer';
import queryString from 'query-string';
import {useAuth} from '../../reducers/authReducer';
import useCreateApi from '../../hooks/api/useCreateApi';
import Loading from '@assets/components/Loading';
import {disconnect} from '../../actions/authAction';
import useFetchApi from '@assets/hooks/api/useFetchApi';
import PreviewMediaSetup from '@assets/components/PreviewMediaSetup/PreviewMediaSetup';
import useEditApi from '@assets/hooks/api/useEditApi';
import useDeleteApi from '@assets/hooks/api/useDeleteApi';

/**
 * Render a home page for overview
 *
 * @return {React.ReactElement}
 * @constructor
 */
export default function Home() {
  const {
    state: {shop}
  } = useStore();
  const {state, updateUser} = useAuth();
  const initSettings = {
    col: '2',
    row: '2',
    title: state?.user?.username,
    spacing: '10px'
  };
  const {data: settings, setData: setSettings} = useFetchApi({
    url: '/settings',
    initLoad: !!state?.user?.id,
    defaultData: initSettings
  });
  const [popup, setPopup] = useState(window);
  const link = `https://api.instagram.com/oauth/authorize/?${queryString.stringify({
    client_id: process.env.INSTAGRAM_APP_ID,
    redirect_uri: process.env.APP_REDIRECT_URL,
    scope: 'user_profile,user_media',
    response_type: 'code',
    state: shop.id
  })}`;
  const {handleCreate: handleGetUserByCode, creating: gettingUser} = useCreateApi({
    url: '/check-user-exit',
    fullResp: true
  });
  const {handleEdit: handleUpdateSetting, editing: updating} = useEditApi({
    url: '/settings',
    fullResp: true
  });
  const {data, setData, loading} = useFetchApi({
    url: '/user',
    initLoad: !!state?.user?.id
  });
  const {fetchApi: handleSyncMedia, loading: syncing} = useFetchApi({
    url: '/sync',
    initLoad: false,
    presentData: setData
  });
  const {handleDelete: handleLogout, deleting} = useDeleteApi({
    url: '/user'
  });

  // const handleUpdateMedia = async () => {
  //   await handleSyncMedia();
  //   setData(syncedMedias);
  // };
  useEffect(() => {
    const params = queryString.parse(window.location.search);

    async function getInstagramAuthCode() {
      if (params.code) {
        ReactDOM.render(<Loading />, popup.document.body);
        const result = await handleGetUserByCode(params.code);
        localStorage.setItem('user', JSON.stringify(result.data));
        updateUser(result.data);
        popup.close();
      }
    }

    getInstagramAuthCode();

    return getInstagramAuthCode;
  }, [popup?.unload]);
  const handleOpenPopup = (link, title) => {
    const newWindow = window.open(
      link,
      title,
      `height=600,width=500,
      left=${window.screen.availWidth / 2 - 250},
      top=${window.screen.availHeight / 2 - 250}`
    );
    setPopup(newWindow);
    if (window.focus) {
      newWindow.focus();
    }
    return false;
  };
  const handleDisconnect = async () => {
    updateUser(null);
    await handleLogout({
      id: state?.user?.id
    });
    setData(null);
    disconnect();
  };

  const timer = setInterval(() => {
    if (popup.closed) {
      console.log(data);
      updateUser(JSON.parse(localStorage.getItem('user')).user);
      clearInterval(timer);
    }
  }, 1000);
  const handleChange = (value, name) => {
    setSettings(prev => ({...prev, [name]: value}));
  };

  return (
    <Page title="Main feed" fullWidth>
      {loading ? (
        <Loading />
      ) : (
        <Layout>
          <Layout.Section oneThird>
            <FormLayout>
              <Layout>
                <Layout.Section>
                  <Card sectioned>
                    <FormLayout>
                      {!state?.user?.id && (
                        <Button
                          primary
                          textAlign="center"
                          icon={
                            <svg
                              viewBox="0 0 20 20"
                              className="Icon_Icon__Dm3QW"
                              style={{width: '20px', height: '20px'}}
                            >
                              <path
                                fillRule="evenodd"
                                d="M6 10.5a3.5 3.5 0 1 0 7 0 3.5 3.5 0 0 0-7 0Zm1 0a2.5 2.5 0 1 1 5 0 2.5 2.5 0 0 1-5 0Z"
                              ></path>
                              <path d="M13.25 7.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z"></path>
                              <path
                                fillRule="evenodd"
                                d="M12.5 17h-6a3.5 3.5 0 0 1-3.5-3.5v-6a3.5 3.5 0 0 1 3.5-3.5h6a3.5 3.5 0 0 1 3.5 3.5v6a3.5 3.5 0 0 1-3.5 3.5Zm-8.5-9.5a2.5 2.5 0 0 1 2.5-2.5h6a2.5 2.5 0 0 1 2.5 2.5v6a2.5 2.5 0 0 1-2.5 2.5h-6a2.5 2.5 0 0 1-2.5-2.5v-6Z"
                              ></path>
                            </svg>
                          }
                          onClick={() => handleOpenPopup(link, 'Connect with Instagram')}
                          loading={gettingUser}
                        >
                          <TextStyle variation="strong">Connect with Instagram</TextStyle>
                        </Button>
                      )}
                      {state?.user?.id && (
                        <Stack>
                          <Stack.Item>
                            <TextStyle variation="strong">
                              {' '}
                              Connected to @{state?.user?.username}{' '}
                            </TextStyle>
                          </Stack.Item>
                          <Stack.Item>|</Stack.Item>
                          <Stack.Item>
                            <Button
                              onClick={() => handleOpenPopup(link, 'Connect with Instagram')}
                              monochrome
                              plain
                              primary
                            >
                              {' '}
                              Change account
                            </Button>
                          </Stack.Item>
                          <Stack.Item>|</Stack.Item>
                          <Stack.Item>
                            <Button
                              onClick={handleDisconnect}
                              monochrome
                              plain
                              primary
                              loading={deleting}
                            >
                              {' '}
                              Disconnect
                            </Button>
                          </Stack.Item>
                          <Stack.Item>|</Stack.Item>
                          <Stack.Item>
                            <Button onClick={() => handleSyncMedia()} primary loading={syncing}>
                              Sync
                            </Button>
                          </Stack.Item>
                        </Stack>
                      )}
                    </FormLayout>
                  </Card>
                </Layout.Section>
              </Layout>
            </FormLayout>
            <FormLayout>
              <Layout>
                <Layout.Section>
                  <Card sectioned>
                    <Form
                      onSubmit={() =>
                        handleUpdateSetting({id: state?.user?.instagramId, ...settings})
                      }
                    >
                      <FormLayout>
                        <TextField
                          label={<TextStyle variation="strong">Feed title</TextStyle>}
                          autoComplete="off"
                          name="title"
                          value={settings?.title}
                          onChange={value => handleChange(value, 'title')}
                        />

                        <Stack alignment="trailing" distribution="fill">
                          <Stack.Item>
                            <TextField
                              autoComplete="off"
                              label={<TextStyle variation="strong">Post spacing</TextStyle>}
                              type="number"
                              name="spacing"
                              value={settings?.spacing?.replace('px', '')}
                              onChange={value => handleChange(`${value}px`, 'spacing')}
                            />
                          </Stack.Item>
                        </Stack>

                        <Stack alignment="trailing" distribution="fill">
                          <Stack.Item>
                            <Select
                              label={<TextStyle variation="strong">Layout</TextStyle>}
                              value="grid"
                              onChange={value => handleChange(value, 'layout')}
                              options={[
                                {label: 'Open in new tab', value: 'new_tab'},
                                {
                                  label: 'Grid',
                                  value: 'grid'
                                }
                              ]}
                            />
                          </Stack.Item>
                        </Stack>

                        <Stack alignment="trailing" distribution="fill">
                          <TextField
                            autoComplete="off"
                            label={<TextStyle variation="strong">Number of rows</TextStyle>}
                            type="number"
                            name="row"
                            value={settings?.row}
                            onChange={value => handleChange(value, 'row')}
                          />

                          <Stack.Item>
                            <TextField
                              autoComplete="off"
                              label={<TextStyle variation="strong">Number of columns</TextStyle>}
                              type="number"
                              name="col"
                              value={settings?.col}
                              onChange={value => handleChange(value, 'col')}
                            />
                          </Stack.Item>
                        </Stack>

                        <Button primary fullWidth submit loading={updating}>
                          <TextStyle variation="strong">Save feed</TextStyle>
                        </Button>
                      </FormLayout>
                    </Form>
                  </Card>
                </Layout.Section>
              </Layout>
            </FormLayout>
          </Layout.Section>
          <Layout.Section>
            <FormLayout>
              <Layout>
                <Layout.Section>
                  <Card sectioned title="Preview">
                    <Card.Section>
                      <PreviewMediaSetup settings={settings} medias={data?.medias} />
                    </Card.Section>
                  </Card>
                </Layout.Section>
              </Layout>
            </FormLayout>
          </Layout.Section>
        </Layout>
      )}
    </Page>
  );
}
