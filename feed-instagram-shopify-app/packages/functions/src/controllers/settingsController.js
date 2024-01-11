import {
  getSettingsByShopId,
  saveSettingsWithInstagramId
} from '@functions/repositories/settingsRepository';
import {getCurrentShop} from '@functions/helpers/auth';
import {getShopById} from '@functions/repositories/shopRepository';
import {createShopifyClassWithShopId} from '@functions/helpers/utils/createShopifyClassByShopId';

/**
 * @param ctx
 * @returns {Promise<{success: boolean, error: string}|{success: boolean, error}|{data: FirebaseFirestore.DocumentData, success: boolean}>}
 */
export async function getSettingsByIgId(ctx) {
  try {
    const shopId = getCurrentShop(ctx);
    const result = await getSettingsByShopId(shopId);
    if (!result) {
      return (ctx.body = {
        success: false,
        error: 'Failed to get settings'
      });
    }
    return (ctx.body = {
      success: true,
      data: result
    });
  } catch (e) {
    console.log(e);
    return (ctx.body = {
      success: false,
      error: e.message
    });
  }
}

/**
 * @param ctx
 * @returns {Promise<{data: (*|boolean), success: boolean}|{success: boolean, error}>}
 */
export async function saveSettings(ctx) {
  try {
    const {
      data: {id, ...settings}
    } = ctx.req.body;

    const shopId = getCurrentShop(ctx);
    const shopInfo = await getShopById(shopId);
    const shopify = await createShopifyClassWithShopId(shopId);

    const metafields = await shopify.metafield.list({
      key: 'feed_settings_attributes',
      value: 'feed_shopify_shop_settings',
      ownerResource: 'shop'
    });
    console.log(metafields, 'metafields');
    if (metafields.length === 0) {
      const query = `{
        currentAppInstallation {
          id
        }
    }`;
      const graphqlRes = await shopify.graphql(query);
      const currentAppInstallationId = graphqlRes.currentAppInstallation.id;
      await shopify.metafield.create({
        key: 'feed_settings_attributes',
        namespace: 'feed_shopify_shop_settings',
        value: JSON.stringify(settings),
        type: 'json_string',
        ownerResource: 'shop',
        ownerId: currentAppInstallationId
      });
    }
    await Promise.all(
      metafields.map(
        async metafield =>
          await shopify.metafield.update(metafield.id, {value: JSON.stringify(settings)})
      )
    );
    const result = await saveSettingsWithInstagramId(shopInfo?.shopifyDomain, shopId, id, settings);
    if (!result) {
      return (ctx.body = {
        success: false,
        error: 'Failed to save'
      });
    }
    return (ctx.body = {
      success: true,
      data: result
    });
  } catch (e) {
    console.log(e);
    return (ctx.body = {
      success: false,
      error: e.message
    });
  }
}
