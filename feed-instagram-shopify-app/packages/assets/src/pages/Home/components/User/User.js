import {Button, Card, FormLayout, Stack, TextStyle} from '@shopify/polaris';
import React from 'react';
import useFetchApi from '@assets/hooks/api/useFetchApi';
import queryString from 'query-string';
import {useStore} from '@assets/reducers/storeReducer';
import useDeleteApi from '@assets/hooks/api/useDeleteApi';
import PropTypes from 'prop-types';

export default function User({data, setData, successCallback}) {
  const {
    state: {shop}
  } = useStore();
  const link = `https://api.instagram.com/oauth/authorize/?${queryString.stringify({
    client_id: process.env.INSTAGRAM_APP_ID,
    redirect_uri: process.env.APP_REDIRECT_URL,
    scope: 'user_profile,user_media',
    response_type: 'code',
    state: shop.id
  })}`;

  const {fetchApi: handleSyncMedia, loading: syncing} = useFetchApi({
    url: '/sync',
    initLoad: false,
    presentData: setData
  });
  const {handleDelete: handleLogout, deleting: disconnecting} = useDeleteApi({
    url: '/user'
  });
  const handleDisconnect = async () => {
    await handleLogout();
    setData(null);
    setSet;
  };

  const handleOpenPopup = (link, title) => {
    const newWindow = window.open(
      link,
      title,
      `height=600,width=500,
      left=${window.screen.availWidth / 2 - 250},
      top=${window.screen.availHeight / 2 - 250}`
    );
    if (window.focus) {
      newWindow.focus();
    }
    const timer = setInterval(async () => {
      try {
        if (newWindow.location.href.includes('code')) {
          newWindow.close();
          await successCallback();
          clearInterval(timer);
        }
      } catch (error) {}
    }, 1000);
  };
  return (
    <Card sectioned>
      <FormLayout>
        {!data?.id && (
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
          >
            <TextStyle variation="strong">Connect with Instagram</TextStyle>
          </Button>
        )}
        {data?.id && (
          <Stack alignment="center">
            <Stack.Item>
              <TextStyle variation="strong"> Connected to @{data?.username} </TextStyle>
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
              <Button onClick={handleDisconnect} monochrome plain primary loading={disconnecting}>
                {' '}
                Disconnect
              </Button>
            </Stack.Item>
            <Stack.Item>|</Stack.Item>
            <Stack.Item>
              <Button onClick={() => handleSyncMedia()} primary monochrome plain loading={syncing}>
                Sync
              </Button>
            </Stack.Item>
            {/* <Stack.Item>|</Stack.Item>*/}
            {/* <Stack.Item>*/}
            {/*  <Button onClick={() => handleEditMedia()} primary monochrome plain>*/}
            {/*    Update Media Setting*/}
            {/*  </Button>*/}
            {/* </Stack.Item>*/}
          </Stack>
        )}
      </FormLayout>
    </Card>
  );
}

User.propTypes = {
  data: PropTypes.shape({
    id: PropTypes.string,
    username: PropTypes.string
  }),
  setData: PropTypes.func,
  successCallback: PropTypes.func,
  setSettings: PropTypes.func
};
