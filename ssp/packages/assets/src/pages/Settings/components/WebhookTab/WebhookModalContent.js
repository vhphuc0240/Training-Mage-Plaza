import {Modal, Select, TextField} from '@shopify/polaris';
import React, {useState} from 'react';
import {formatWebhookTopicLabel} from '@assets/helpers/utils/formatWebhookTopicLabel';

const WebhookTopic = [
  'app/uninstalled',
  'bulk_operations/finish',
  'carts/create',
  'carts/update',
  'checkouts/create',
  'checkouts/delete',
  'checkouts/update',
  'collection_listings/add',
  'collection_listings/remove',
  'collection_listings/update',
  'collections/create',
  'collections/delete',
  'collections/update',
  'customer_groups/create',
  'customer_groups/delete',
  'customer_groups/update',
  'customers/create',
  'customers/delete',
  'customers/disable',
  'customers/enable',
  'customers/update',
  'customers_marketing_consent/update',
  'draft_orders/create',
  'draft_orders/delete',
  'draft_orders/update',
  'fulfillment_events/create',
  'fulfillment_events/delete',
  'fulfillments/create',
  'fulfillments/update',
  'inventory_items/create',
  'inventory_items/delete',
  'inventory_items/update',
  'inventory_levels/connect',
  'inventory_levels/disconnect',
  'inventory_levels/update',
  'locations/create',
  'locations/delete',
  'locations/update',
  'order_transactions/create',
  'orders/cancelled',
  'orders/create',
  'orders/delete',
  'orders/edited',
  'orders/fulfilled',
  'orders/paid',
  'orders/partially_fulfilled',
  'orders/updated',
  'payment_terms/create',
  'payment_terms/delete',
  'payment_terms/update',
  'product_listings/add',
  'product_listings/remove',
  'product_listings/update',
  'products/create',
  'products/delete',
  'products/update',
  'refunds/create',
  'selling_plan_groups/create',
  'selling_plan_groups/delete',
  'selling_plan_groups/update',
  'shop/update',
  'subscription_billing_attempts/challenged',
  'subscription_billing_attempts/failure',
  'subscription_billing_attempts/success',
  'tender_transactions/create',
  'themes/create',
  'themes/delete',
  'themes/publish',
  'themes/update'
];
export default function WebhookModalContent({inputRef}) {
  const [webhookData, setWebhookData] = useState(inputRef.current);

  const topicOptions = WebhookTopic.map(topic => {
    return {
      label: formatWebhookTopicLabel(topic),
      value: topic
    };
  });
  const handleChange = (value, name) => {
    setWebhookData(prev => ({...prev, [name]: value}));
    inputRef.current = {...inputRef.current, [name]: value};
  };
  return (
    <Modal.Section>
      <TextField
        label="Address"
        autoComplete="off"
        name="address"
        value={webhookData.address}
        onChange={value => handleChange(value, 'address')}
      />
      <Select
        label="Format"
        options={[
          {label: 'JSON', value: 'json'},
          {label: 'XML', value: 'xml'}
        ]}
        value={webhookData.format}
        onChange={value => handleChange([value], 'format')}
      />
      <Select
        label="Topic"
        options={topicOptions}
        value={webhookData.topic}
        onChange={value => handleChange([value], 'topic')}
      />
    </Modal.Section>
  );
}
