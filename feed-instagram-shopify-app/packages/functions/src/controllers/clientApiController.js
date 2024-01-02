import {getMediaByShopifyDomain} from '@functions/repositories/mediaRepository';

export async function getMedias(ctx) {
  try {
    const {shopDomain} = ctx.req.query;
    const medias = await getMediaByShopifyDomain(shopDomain);
    if (!medias)
      return (ctx.body = {
        success: false,
        message: 'Something went wrong'
      });
    return (ctx.body = {
      success: true,
      data: medias
    });
  } catch (e) {
    console.log(e);
    return (ctx.body = {
      success: false,
      message: e.message
    });
  }
}
