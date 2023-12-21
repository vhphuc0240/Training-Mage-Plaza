import {getShopByShopifyDomain} from '@avada/shopify-auth';
import Shopify from 'shopify-api-node';
import {parseOrdersToNotifications} from '@functions/services/shopifyApiService';
import {addNotifications} from '@functions/repositories/notificationRepository';
import {getShopDataById} from '@functions/repositories/shopRepository';
import {getCurrentShop} from '@functions/helpers/auth';

async function createShopifyClassWithShopId(shopId) {
  const {accessToken, shopifyDomain} = await getShopDataById(shopId);
  return new Shopify({
    shopName: shopifyDomain, accessToken
  });
}

export async function listNewOrder(ctx) {
  try {
    const shopifyDomain = ctx.get('X-Shopify-Shop-Domain');
    const ordersData = ctx.req.body;
    const shop = await getShopByShopifyDomain(shopifyDomain);
    const shopify = new Shopify({
      shopName: shop.shopifyDomain, accessToken: shop.accessToken
    });
    const notifications = await parseOrdersToNotifications(shopify, [ordersData]);
    await addNotifications(shop.id, shopifyDomain, notifications);
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

export async function get(ctx) {
  try {
    const shopId = getCurrentShop(ctx);
    const shopify = await createShopifyClassWithShopId(shopId);
    const webhooks = await shopify.webhook.list();
    return (ctx.body = {
      data: webhooks, success: true
    });
  } catch (e) {
    console.log(e);
    return (ctx.body = {
      success: false
    });
  }
}

export async function update(ctx) {
  try {
    const shopId = getCurrentShop(ctx);
    const shopify = await createShopifyClassWithShopId(shopId);
    const {
      id, updateFields: {
        address, fields, format, metafield_namespaces, private_metafield_namespaces, topic
      }
    } = ctx.req.body.data;
    const updatedWebhook = await shopify.webhook.update(id, {
      address, fields, format, metafield_namespaces, private_metafield_namespaces, topic
    });
    return (ctx.body = {
      data: updatedWebhook, success: true
    });
  } catch (e) {
    console.log(e);
    return (ctx.body = {
      success: false, error: e.message
    });
  }
}

export async function deleteWebhook(ctx) {
  try {
    const shopId = getCurrentShop(ctx);
    const shopify = await createShopifyClassWithShopId(shopId);
    const {webhookId} = ctx.req.body;
    await shopify.webhook.delete(webhookId);
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
