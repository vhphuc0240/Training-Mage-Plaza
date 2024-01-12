import {getMediaByShopifyDomain} from '@functions/repositories/mediaRepository';
import {sortByTime} from '@functions/helpers/utils/sortByTime';

export async function getMedias(ctx) {
  try {
    const {shopDomain} = ctx.req.query;
    const data = await getMediaByShopifyDomain(shopDomain);
    if (!data)
      return (ctx.body = {
        success: false,
        message: 'Something went wrong'
      });
    console.log(JSON.stringify(data, null, 4), 'data in line 13');
    data[0].medias = data[0].medias.sort(sortByTime);
    return (ctx.body = {
      success: true,
      data
    });
  } catch (e) {
    console.log(e);
    return (ctx.body = {
      success: false,
      message: e.message
    });
  }
}
