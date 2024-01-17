import InstagramApi from '@functions/helpers/utils/InstagramApi';
import {getShopById} from '@functions/repositories/shopRepository';
import {saveUser} from '@functions/repositories/userRepository';
import {saveMedias} from '@functions/repositories/mediaRepository';
import {saveSettingsWithShopId} from '@functions/repositories/settingsRepository';
import defaultSettings from '@functions/const/defaultSettings';
import {separateArray} from '@functions/helpers/utils/media';

const Instagram = new InstagramApi();

/*
 * @param ctx
 * @returns {Promise<string>}
 */
export async function handle(ctx) {
  const {code, state: shopId} = ctx.query;
  const shopInfo = await getShopById(shopId);
  const {access_token: shortLiveAccessToken, user_id} = await Instagram.getShortLiveAccessToken(
    code
  );
  const {access_token, expires_in, token_type} = await Instagram.getLongLiveAccessToken(
    shortLiveAccessToken
  );
  const {id, username} = await Instagram.getUserData(user_id, access_token);
  const userId = await saveUser({
    accessToken: access_token,
    expiresIn: Date.now() + expires_in * 1000,
    tokenType: token_type,
    instagramId: id,
    username,
    shopId,
    shopifyDomain: shopInfo.shopifyDomain,
    createdAt: new Date(),
    updatedAt: new Date()
  });
  await saveSettingsWithShopId(shopInfo?.shopifyDomain, shopId, id, defaultSettings);
  const media = await Instagram.getMedia(id, access_token);
  const mediasSeparated = separateArray(media.data, 2);
  await Promise.all(
    mediasSeparated.map(media =>
      saveMedias(
        shopInfo?.shopifyDomain,
        shopId,
        id,
        userId,
        media.map(item => ({
          ...item,
          lastSync: Date.now(),
          hidden: false
        }))
      )
    )
  );
  /**
   * <script>window.close();</script>
   */
  return (ctx.body = 'Please close this window');
}
