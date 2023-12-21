import {getCurrentShop} from '@functions/helpers/auth';
import {createShopifyClassWithShopId} from '@functions/helpers/utils/createShopifyClassWithShopId';

export async function get(ctx) {
  try {
    const shopId = getCurrentShop(ctx);
    const shopify = await createShopifyClassWithShopId(shopId);
    const {
      key,
      namespace,
      owner_resource,
      type,
      created_at,
      value
    } = await shopify.metafield.list();
    return (ctx.body = {
      data: {key, namespace, owner_resource, type, created_at, value},
      success: true
    });
  } catch (e) {
    console.log(e);
    return (ctx.body = {
      success: false
    });
  }
}

export async function create(ctx) {
  try {
    const shopId = getCurrentShop(ctx);
    const shopify = await createShopifyClassWithShopId(shopId);
    const {address, format, topic} = ctx.req.body.data;
    console.log(ctx.req.body.data);
    const newWebhook = await shopify.webhook.create({
      address,
      format,
      topic
    });
    return (ctx.body = {
      data: newWebhook,
      success: true
    });
  } catch (e) {
    console.log(e);
    return (ctx.body = {
      success: false,
      error: e.message
    });
  }
}

export async function update(ctx) {
  try {
    const shopId = getCurrentShop(ctx);
    const shopify = await createShopifyClassWithShopId(shopId);
    const {
      id,
      updateFields: {
        address,
        fields,
        format,
        metafield_namespaces,
        private_metafield_namespaces,
        topic
      }
    } = ctx.req.body.data;
    const updatedWebhook = await shopify.webhook.update(id, {
      address,
      fields,
      format,
      metafield_namespaces,
      private_metafield_namespaces,
      topic
    });
    return (ctx.body = {
      data: updatedWebhook,
      success: true
    });
  } catch (e) {
    console.log(e);
    return (ctx.body = {
      success: false,
      error: e.message
    });
  }
}

export async function deleteWebhook(ctx) {
  try {
    const shopId = getCurrentShop(ctx);
    const shopify = await createShopifyClassWithShopId(shopId);
    const {ids} = ctx.req.body.data;
    await Promise.all(ids.map(async id => await shopify.webhook.delete(id)));
    return (ctx.body = {
      success: true
    });
  } catch (e) {
    console.log(e);
    return (ctx.body = {
      success: false
    });
  }
}
