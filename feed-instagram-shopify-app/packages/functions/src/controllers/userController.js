import {
  deleteUserByShopId,
  getUserByShopId,
  updateUserWhenRefreshInstagramAccessToken
} from '@functions/repositories/userRepository';
import InstagramApi from '@functions/helpers/utils/InstagramApi';
import {
  deleteMediaById,
  deleteMediaByShopId,
  getMediasByShopId,
  saveMedias,
  updateMediaById
} from '@functions/repositories/mediaRepository';
import {getCurrentShop} from '@functions/helpers/auth';
import {deleteSettingsByShopId} from '@functions/repositories/settingsRepository';
import {filterExpriredId, mergeMedias, refreshMedias} from '@functions/helpers/utils/media';
import {sortByTime} from '@functions/helpers/utils/sortByTime';

const Instagram = new InstagramApi();

/**
 * @param shopId
 * @returns {Promise<{[p: string]: FirebaseFirestore.DocumentFieldValue, id: string}|{[p: string]: FirebaseFirestore.DocumentFieldValue, id}|boolean|null>}
 */
export async function checkUserExit(shopId) {
  try {
    const user = await getUserByShopId(shopId);
    if (user) {
      const {id, expiresIn, accessToken} = user;
      if (Number(expiresIn) / 1000 - 60 * 60 * 1000 <= 0) {
        /*
         * token expired => refresh token
         */
        const refreshTokenResult = await Instagram.refreshInstagramToken(accessToken);
        const {access_token, expires_in} = refreshTokenResult;
        /*
         *  update user in DB
         */
        return await updateUserWhenRefreshInstagramAccessToken(id, {
          accessToken: access_token,
          expiresIn: Date.now() + expires_in * 1000,
          updatedAt: new Date()
        });
      }
      return user;
    }
    return false;
  } catch (e) {
    console.log(e);
    return false;
  }
}

/**
 * @param ctx
 * @returns {Promise<{data: {medias: FlatArray<*[], 1>[], instagramId, id, username}, status: boolean}|{data: {}, error: string, status: boolean}|{data: {}, error, status: boolean}>}
 */
export async function getUserData(ctx) {
  try {
    const shopId = getCurrentShop(ctx);
    const [user, medias] = await Promise.all([checkUserExit(shopId), getMediasByShopId(shopId)]);
    if (!user) {
      return (ctx.body = {
        data: {},
        error: 'User not found',
        status: false
      });
    }
    const {id, instagramId, username, accessToken} = user;
    /* data da ton tai nhung media_url(IMAGE) || media_url, thumbnail_url (VIDEO) da het han*/
    const expriredMediaIds = filterExpriredId(medias);
    const newestMedias = await Instagram.getMedia(instagramId, accessToken);
    if (expriredMediaIds.length > 0) {
      const refreshedMedias = refreshMedias(expriredMediaIds, medias, newestMedias.data);
      await Promise.all(
        refreshedMedias.map(
          async media =>
            await updateMediaById(media.id, {
              medias: media?.medias
            })
        )
      );
    }
    return (ctx.body = {
      data: {
        id,
        instagramId,
        username,
        medias: (await getMediasByShopId(shopId))
          .map(item => item?.medias.map(media => ({docId: item.id, ...media})))
          .flat()
          .sort(sortByTime)
      },
      status: true
    });
  } catch (e) {
    console.log(e);
    return (ctx.body = {
      data: {},
      error: e.message,
      status: false
    });
  }
}

export async function syncNewMedias(ctx) {
  try {
    const shopId = getCurrentShop(ctx);
    const [user, medias] = await Promise.all([getUserByShopId(shopId), getMediasByShopId(shopId)]);
    const {instagramId, accessToken, username, id, shopifyDomain} = user;
    const {data: newestMedias} = await Instagram.getMedia(instagramId, accessToken);
    const mergedMedias = await mergeMedias(medias, newestMedias);
    console.log(JSON.stringify(mergedMedias, null, 2), 'mergedMedias in line 113');
    await Promise.all([
      ...mergedMedias.update.map(item => updateMediaById(item.id, item)),
      ...mergedMedias.delete.map(id => deleteMediaById(id)),
      ...mergedMedias.new.map(media => saveMedias(shopifyDomain, shopId, instagramId, id, media))
    ]);
    return (ctx.body = {
      data: {
        id,
        instagramId,
        username,
        medias: (await getMediasByShopId(shopId))
          .map(item => item?.medias.map(media => ({docId: item.id, ...media})))
          .flat()
          .sort(sortByTime)
      },
      status: true
    });
  } catch (e) {
    console.log(e);
    return (ctx.body = {
      data: {},
      error: e.message,
      status: false
    });
  }
}

/**
 * @param ctx
 * @returns {Promise<{data: *[], error: string, status: boolean}|{data: *[], error, status: boolean}|{data: boolean, status: boolean}>}
 */
export async function deleteUser(ctx) {
  try {
    const shopId = getCurrentShop(ctx);
    const user = await deleteUserByShopId(shopId);
    const media = await deleteMediaByShopId(shopId);
    const settings = await deleteSettingsByShopId(shopId);
    if (!user || !media || !settings) {
      return (ctx.body = {
        data: [],
        error: 'User not found',
        status: false
      });
    }
    return (ctx.body = {
      data: [],
      status: true
    });
  } catch (e) {
    console.log(e);
    return (ctx.body = {
      data: [],
      error: e.message,
      status: false
    });
  }
}
