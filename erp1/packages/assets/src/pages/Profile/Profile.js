import React from 'react';
import {
  Avatar,
  Badge,
  Card,
  DisplayText,
  Layout,
  Page,
  ResourceItem,
  ResourceList
} from '@shopify/polaris';
import {getStorageData} from '@assets/helpers/storage';

/**
 * Render a home page for overview
 *
 * @return {React.ReactElement}
 * @constructor
 */
export default function Profile() {
  const {user} = getStorageData('user');
  return (
    <Page title="My account">
      <Layout>
        <Layout.AnnotatedSection id="detail" title="Detail">
          <Card>
            <ResourceList
              resourceName={{singular: 'User', plural: 'Users'}}
              items={[
                {
                  avatarSource: user ? user.avatar : '',
                  name: user ? user.fullName : '',
                  englishName: user ? user.englishName : '',
                  role: user ? user.role : '',
                  id: user ? user.id : ''
                }
              ]}
              renderItem={item => {
                const {avatarSource, name, englishName, role, id} = item;

                return (
                  <ResourceItem
                    media={<Avatar customer name={name} source={avatarSource} />}
                    accessibilityLabel={`View details for ${name}`}
                    name={name}
                    key={id}
                    id={id}
                  >
                    <DisplayText size="small">
                      {name}
                      <Badge tone="info">{role}</Badge>
                    </DisplayText>
                    <div>{englishName}</div>
                  </ResourceItem>
                );
              }}
            />
          </Card>
        </Layout.AnnotatedSection>
      </Layout>
    </Page>
  );
}
