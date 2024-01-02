import {
  getSettingsByInstagramId,
  saveSettingsWithInstagramId
} from '@functions/repositories/settingsRepository';
import {getCurrentShop} from '@functions/helpers/auth';
import {getShopById} from '@functions/repositories/shopRepository';

/**
 * @param ctx
 * @returns {Promise<{success: boolean, error: string}|{success: boolean, error}|{data: FirebaseFirestore.DocumentData, success: boolean}>}
 */
export async function getSettingsByIgId(ctx) {
  try {
    const {instagramId} = ctx.query;
    const result = await getSettingsByInstagramId(instagramId);
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
