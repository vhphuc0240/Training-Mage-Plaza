import React from 'react';
import {Layout, Page} from '@shopify/polaris';

/**
 * Render a home page for overview
 *
 * @return {React.ReactElement}
 * @constructor
 */
export default function Home() {
  return (
    <Page title="Dashboard">
      <Layout>
        <Layout.Section>Home</Layout.Section>
      </Layout>
    </Page>
  );
}
