import {
  getUserByInstagramId,
  saveUser,
  updateUserWhenRefreshInstagramAccessToken
} from '@functions/repositories/userRepository';
import InstagramApi from '@functions/helpers/utils/InstagramApi';
import {
  getMediasByInstagramId,
  saveMediasWithInstagramId
} from '@functions/repositories/mediaRepository';

const Instagram = new InstagramApi();

/**
 *
 * @param ctx
 * @returns {Promise<{data: *[], error: string, status: boolean}|{data: {instagramId, id: (string|boolean), media: (*|boolean), username}, status: boolean}|{data: {instagramId: FirebaseFirestore.DocumentFieldValue, id: string, username: FirebaseFirestore.DocumentFieldValue}, status: boolean}|{data: {medias: *[], instagramId: FirebaseFirestore.DocumentFieldValue, id: string, username: FirebaseFirestore.DocumentFieldValue}, status: boolean}|{data: *[], error, status: boolean}>}
 */
export async function checkUserExit(ctx) {
  try {
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
    const user = await getUserByInstagramId(shortLiveAccessTokenData?.user_id);
    if (user) {
      /*
       * user exited in DB
       */

      const {id, expiresIn, instagramId, accessToken, username} = user;
      if (!(Number(expiresIn) / 1000 - 60 * 60 * 1000 > 0)) {
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
      const medias = await getMediasByInstagramId(instagramId);
      return (ctx.body = {
        data: {
          id,
          instagramId,
          username,
          medias
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
      createdAt: new Date(),
      updatedAt: new Date()
    });
    /*
     * get media from Instagram API => save to DB
     */
    const media = await Instagram.getMedia(shortLiveAccessTokenData?.user_id, access_token);
    console.log(media.data, id, userId);
    if (!media) {
      return (ctx.body = {
        data: [],
        error: 'Can not get media',
        status: false
      });
    }
    const saveMediaResult = await saveMediasWithInstagramId(id, userId, media.data);
    console.log(saveMediaResult, 'saveMediaResult');
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
        id: userId,
        media: saveMediaResult
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
    const data = ctx.req.query;
    const user = await getUserByInstagramId(data.instagramId);
    const medias = await getMediasByInstagramId(data.instagramId);
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
        medias
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
