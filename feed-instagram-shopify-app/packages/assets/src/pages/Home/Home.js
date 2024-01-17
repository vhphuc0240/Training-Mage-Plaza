import React from 'react';
import {FormLayout, Layout, Page} from '@shopify/polaris';
import Loading from '@assets/components/Loading';
import useFetchApi from '@assets/hooks/api/useFetchApi';
import useEditApi from '@assets/hooks/api/useEditApi';
import Preview from './components/Preview/Preview';
import Setting from './components/Setting/Setting';
import User from './components/User/User';
import defaultSettings from '@assets/const/defaultSettings';

/**
 * Render a home page for overview
 *
 * @return {React.ReactElement}
 * @constructor
 */

export default function Home() {
  const {data: settings, setData: setSettings} = useFetchApi({
    url: '/settings',
    defaultData: defaultSettings
  });

  const {data, setData, loading, fetchApi} = useFetchApi({
    url: '/user'
  });

  const {handleEdit} = useEditApi({
    url: '/media',
    fullResp: true
  });
  const handleEditHidden = async (docId, id, hidden) => {
    setData(prev => ({
      ...prev,
      medias: prev.medias.map(item => ({...item, hidden: item.id === id ? hidden : item.hidden}))
    }));
    await handleEdit({docId, id, hidden});
  };

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
                  <User data={data} setData={setData} successCallback={fetchApi} />
                </Layout.Section>
              </Layout>
            </FormLayout>
            <FormLayout>
              <Layout>
                <Layout.Section>
                  <Setting settings={settings} handleChange={handleChange} />
                </Layout.Section>
              </Layout>
            </FormLayout>
          </Layout.Section>
          <Layout.Section>
            <FormLayout>
              <Layout>
                <Layout.Section>
                  <Preview
                    settings={settings}
                    medias={data?.medias}
                    handleEditHidden={handleEditHidden}
                  />
                </Layout.Section>
              </Layout>
            </FormLayout>
          </Layout.Section>
        </Layout>
      )}
    </Page>
  );
}
