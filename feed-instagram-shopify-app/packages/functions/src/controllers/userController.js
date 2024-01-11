import {
  deleteUserById,
  getUserByShopId,
  saveUser,
  updateUserWhenRefreshInstagramAccessToken
} from '@functions/repositories/userRepository';
import InstagramApi from '@functions/helpers/utils/InstagramApi';
import {
  deleteMediaById,
  deleteMediaByUserId,
  getMediasByShopId,
  saveMediasWithInstagramId,
  updateMediaById
} from '@functions/repositories/mediaRepository';
import {getCurrentShop} from '@functions/helpers/auth';
import {getShopById} from '@functions/repositories/shopRepository';
import {deleteSettingsByShopifyDomain} from '@functions/repositories/settingsRepository';
import {filterExpriredId, separateArray} from '@functions/helpers/utils/separateArray';

const Instagram = new InstagramApi();

/**
 * @param {string[]} expriredMediaIds
 * @param {[]}medias
 * @param {string} accessToken
 * @returns {Promise<void>}
 */
export async function refreshMedias(expriredMediaIds, medias, accessToken) {
  const mediasNewest = await Promise.all(
    expriredMediaIds.map(id => Instagram.getMediaById(id, accessToken))
  );

  const refreshedMedias = medias.map(media => {
    const newMedia = media?.medias.map(item => {
      const t = mediasNewest.find(n => item.id === n.id);
      const baseObj = {
        ...item,
        media_url: t?.media_url,
        lastSync: Date.now()
      };
      return t?.id
        ? t.media_type === 'VIDEO'
          ? {...baseObj, thumbnail_url: t.thumbnail_url}
          : baseObj
        : item;
    });
    return {
      ...media,
      medias: newMedia
    };
  });
  await Promise.all(
    refreshedMedias.map(
      async media =>
        await updateMediaById(media.id, media.instagramId, {
          medias: media?.medias
        })
    )
  );
}

/**
 *
 * @param ctx
 * @returns {Promise<{data: *[], error: string, status: boolean}|{data: {instagramId, id: (string|boolean), media: (*|boolean), username}, status: boolean}|{data: {instagramId: FirebaseFirestore.DocumentFieldValue, id: string, username: FirebaseFirestore.DocumentFieldValue}, status: boolean}|{data: {medias: *[], instagramId: FirebaseFirestore.DocumentFieldValue, id: string, username: FirebaseFirestore.DocumentFieldValue}, status: boolean}|{data: *[], error, status: boolean}>}
 */
export async function checkUserExit(ctx) {
  try {
    const shopId = getCurrentShop(ctx);
    const shopInfo = await getShopById(shopId);
    const {data} = ctx.req.body;
    /*
     * get short live access token from code on Instagram API
     */
    const shortLiveAccessTokenData = await Instagram.getShortLiveAccessToken(data);
    if (!shortLiveAccessTokenData) {
      return (ctx.body = {
        data: [],
        error: 'Can not get short live access token',
        status: false
      });
    }
    /*
     * check user exit in DB
     */
    const user = await getUserByShopId(shopId);
    if (user) {
      /*
       * user exited in DB
       */

      const {id, expiresIn, instagramId, accessToken, username} = user;
      if (Number(expiresIn) / 1000 - 60 * 60 * 1000 <= 0) {
        /*
         * token expired => refresh token
         */
        const refreshTokenResult = await Instagram.refreshInstagramToken(accessToken);
        if (!refreshTokenResult) {
          return (ctx.body = {
            data: [],
            error: 'Can not refresh token',
            status: false
          });
        }
        const {access_token, expires_in} = refreshTokenResult;
        /*
         *  update user in DB
         */
        const updateResult = await updateUserWhenRefreshInstagramAccessToken(id, {
          accessToken: access_token,
          expiresIn: Date.now() + expires_in * 1000,
          updatedAt: new Date()
        });

        if (!updateResult) {
          return (ctx.body = {
            data: [],
            error: 'Can not update user',
            status: false
          });
        }
        /*
         * return data for client
         */
        return (ctx.body = {
          data: {
            id,
            instagramId,
            username
          },
          status: true
        });
      }
      /*
       * token not expired => return data for client
       */
      return (ctx.body = {
        data: {
          id,
          instagramId,
          username
        },
        status: true
      });
    }
    /*
     * user not exit in DB => get long live access token from short live access token from Instagram API
     */
    const longLiveAccessTokenData = await Instagram.getLongLiveAccessToken(
      shortLiveAccessTokenData?.access_token
    );
    if (!longLiveAccessTokenData) {
      return (ctx.body = {
        data: [],
        error: 'Can not get long live access token',
        status: false
      });
    }
    const {access_token, expires_in, token_type} = longLiveAccessTokenData;

    /*
     * get user data from Instagram API
     */
    const userData = await Instagram.getUserData(shortLiveAccessTokenData?.user_id, access_token);
    if (!userData) {
      return (ctx.body = {
        data: [],
        error: 'Can not get user data',
        status: false
      });
    }

    const {id, username} = userData;
    /*
     * save user to DB
     */
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
    /*
     * get media from Instagram API => save to DB
     */
    const media = await Instagram.getMedia(shortLiveAccessTokenData?.user_id, access_token);
    if (!media) {
      return (ctx.body = {
        data: [],
        error: 'Can not get media',
        status: false
      });
    }
    /*
     * save media to DB (max item in media is 2), large item will be save to other document
     */
    const mediasSeparated = separateArray(media.data, 2);
    const saveMediaResult = await Promise.all(
      mediasSeparated.map(
        async media =>
          await saveMediasWithInstagramId(
            shopInfo?.shopifyDomain,
            shopId,
            id,
            userId,
            media.map(item => ({
              ...item,
              lastSync: Date.now()
            }))
          )
      )
    );
    if (!saveMediaResult) {
      return (ctx.body = {
        data: [],
        error: 'Can not save media',
        status: false
      });
    }
    return (ctx.body = {
      data: {
        username,
        instagramId: id,
        id: userId
      },
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

/**
 *
 * @param ctx
 * @returns {Promise<{data: *[], error: string, status: boolean}|{data: {medias: *[], instagramId: FirebaseFirestore.DocumentFieldValue, id: string, username: FirebaseFirestore.DocumentFieldValue}, status: boolean}|{data: *[], error, status: boolean}>}
 */
export async function getUserDataByInstagramId(ctx) {
  try {
    const shopId = getCurrentShop(ctx);
    const [user, medias] = await Promise.all([getUserByShopId(shopId), getMediasByShopId(shopId)]);
    /* data da ton tai nhung media_url(IMAGE) || media_url, thumbnail_url (VIDEO) da het han*/
    const expriredMediaIds = filterExpriredId(medias);
    if (expriredMediaIds.length > 0) {
      await refreshMedias(expriredMediaIds, medias, user?.accessToken);
    }
    if (!user) {
      return (ctx.body = {
        data: [],
        error: 'User not found',
        status: false
      });
    }
    const {id, instagramId, username} = user;
    return (ctx.body = {
      data: {
        id,
        instagramId,
        username,
        medias: (await getMediasByShopId(shopId)).map(item => item?.medias).flat()
      },
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

/**
 * @param shopId
 * @param shopifyDomain
 * @param instagramId
 * @param userId
 * @param oldMedias
 * @param newMedias
 * @returns {Promise<*[]>}
 */
async function mergeMedias(shopId, shopifyDomain, instagramId, userId, oldMedias, newMedias) {
  const formattedMedia = oldMedias.map(item => item.medias).flat();
  const newMediaIds = newMedias.data.map(item => item.id);
  const oldMediaIds = formattedMedia.map(item => item.id);
  /*
   * exit in new, not in old => new
   * exit in old, not in new => delete
   */
  const deleteMediaIds = oldMediaIds.filter(id => !newMediaIds.includes(id));
  const newMediasNotInOld = newMediaIds.filter(id => !oldMediaIds.includes(id));
  if (deleteMediaIds.length > 0 || newMediasNotInOld.length > 0) {
    const updatedMedias = formattedMedia.filter(item => !deleteMediaIds.includes(item.id));
    newMedias.data.map(item => {
      if (newMediasNotInOld.includes(item.id)) {
        const baseObj = {
          ...item,
          media_url: item?.media_url,
          lastSync: Date.now()
        };
        updatedMedias.push(
          item.media_type === 'VIDEO' ? {...baseObj, thumbnail_url: item.thumbnail_url} : baseObj
        );
      }
    });
    const synced = separateArray(updatedMedias, 2);
    const maxIndex = Math.max(oldMedias.length, synced.length);
    for (let index = 0; index < maxIndex; index++) {
      if (oldMedias[index] !== undefined) {
        if (synced[index] !== undefined) {
          await updateMediaById(oldMedias[index].id, oldMedias[index].instagramId, {
            ...oldMedias[index],
            medias: synced[index]
          });
        } else {
          await deleteMediaById(oldMedias[index].id);
        }
      } else {
        if (synced[index] !== undefined) {
          await saveMediasWithInstagramId(
            shopifyDomain,
            shopId,
            instagramId,
            userId,
            synced[index]
          );
        }
      }
    }
  }
}
export async function syncNewMedias(ctx) {
  try {
    const shopId = getCurrentShop(ctx);
    const [user, medias] = await Promise.all([getUserByShopId(shopId), getMediasByShopId(shopId)]);
    const {instagramId, accessToken, username, id, shopifyDomain} = user;
    const newestMedias = await Instagram.getMedia(instagramId, accessToken);
    await mergeMedias(shopId, shopifyDomain, instagramId, id, medias, newestMedias);
    return (ctx.body = {
      data: {
        id,
        instagramId,
        username,
        medias: (await getMediasByShopId(shopId)).map(item => item?.medias).flat()
      },
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

/**
 * @param ctx
 * @returns {Promise<{data: *[], error: string, status: boolean}|{data: *[], error, status: boolean}|{data: boolean, status: boolean}>}
 */
export async function deleteUser(ctx) {
  try {
    const shopId = getCurrentShop(ctx);
    const shopInfo = await getShopById(shopId);
    const {data} = ctx.req.body;
    const user = await deleteUserById(data.id);
    const media = await deleteMediaByUserId(data.id);
    const settings = await deleteSettingsByShopifyDomain(shopInfo.shopifyDomain);
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
