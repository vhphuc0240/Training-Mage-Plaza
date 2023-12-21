import {
  getShopSettingsByShopId,
  updateShopSettingsByShopId
} from '@functions/repositories/settingRepository';
import {getCurrentShop} from '@functions/helpers/auth';
import {createShopifyClassWithShopId} from '@functions/helpers/utils/createShopifyClassWithShopId';

export async function getShopSettingsById(ctx) {
  const shopId = getCurrentShop(ctx);
  const shopSettings = await getShopSettingsByShopId(shopId);
  ctx.body = {data: shopSettings, success: true};
}

export async function updateShopSettingsById(ctx) {
  try {
    const shopId = getCurrentShop(ctx);
    const shopify = await createShopifyClassWithShopId(shopId);
    const metafields = await shopify.metafield.list({
      key: 'settings_attributes',
      value: 'shopify_shop_settings',
      ownerResource: 'shop'
    });
    console.log(metafields, 'metafields');
    const {data} = ctx.req.body;
    await Promise.all(
      metafields.map(
        async metafield =>
          await shopify.metafield.update(metafield.id, {value: JSON.stringify(data)})
      )
    );
    const shopSettings = await updateShopSettingsByShopId(shopId, data);
    ctx.body = {data: shopSettings, success: true};
  } catch (e) {
    console.log(e);
    return (ctx.body = {
      success: false,
      error: e.message
    });
  }
}
