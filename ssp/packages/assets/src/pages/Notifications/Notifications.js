import React, {useEffect, useState} from 'react';
import {
  Card,
  FormLayout,
  Page,
  Pagination,
  ResourceItem,
  ResourceList,
  Stack
} from '@shopify/polaris';
import moment from 'moment/moment';
import NotificationPopup from '@assets/components/NotificationPopup/NotificationPopup';
import usePaginate from '@assets/hooks/api/usePaginate';

export default function Notifications() {
  const [sortValue, setSortValue] = useState('timestamp:desc');
  const {data, onQueryChange, pageInfo, prevPage, nextPage} = usePaginate({
    url: '/notifications',
    initQueries: {
      sort: sortValue
    }
  });
  useEffect(() => {
    onQueryChange('sort', sortValue, true);
  }, [sortValue]);

  const [selectedNotifications, setSelectedNotifications] = useState([]);
  const resolveItemIds = ({id}) => {
    return id;
  };

  return (
    <Page fullWidth title="Notifications" subtitle="List of sales notifcation from Shopify">
      <Card>
        <ResourceList
          items={data}
          resourceName={{singular: 'notification', plural: 'notifications'}}
          selectedItems={selectedNotifications}
          onSelectionChange={setSelectedNotifications}
          resolveItemId={resolveItemIds}
          totalItemsCount={data.length}
          showHeader
          selectable
          sortOptions={[
            {
              label: 'Newest update',
              value: 'timestamp:desc'
            },
            {
              label: 'Oldest update',
              value: 'timestamp:asc'
            }
          ]}
          sortValue={sortValue}
          onSortChange={setSortValue}
          renderItem={notification => (
            <ResourceItem id={notification.id}>
              <Stack alignment="center" distribution="equalSpacing">
                <Stack.Item>
                  <NotificationPopup
                    firstName={notification.firstName}
                    productName={notification.productName}
                    city={notification.city}
                    productImage={notification.productImage}
                    country={notification.country}
                    timestamp={notification.timestamp}
                  />
                </Stack.Item>
                <Stack.Item>
                  <div className="Wrapper-Time">
                    From {moment(notification.timestamp).format('LL')}
                  </div>
                </Stack.Item>
              </Stack>
            </ResourceItem>
          )}
        />
      </Card>
      <FormLayout>
        <Stack distribution="center">
          <Pagination
            hasNext={pageInfo.hasNext}
            hasPrevious={pageInfo.hasPrev}
            onNext={nextPage}
            onPrevious={prevPage}
          />
        </Stack>
      </FormLayout>
    </Page>
  );
}
