import {getCurrentShop} from '@functions/helpers/auth';
import {getMediaById, getMediasByShopId} from '@functions/repositories/mediaRepository';
import {sortByTime} from '@functions/helpers/utils/sortByTime';

export async function updateHiddenMediaById(ctx) {
  const shopId = getCurrentShop(ctx);
  const {data} = ctx.req.body;
  console.log(JSON.stringify(data, null, 2), 'data in line 12');
  const medias = await getMediaById(data.docId);
  // const t = medias.medias.map(media => )
  return (ctx.body = {
    success: true,
    message: 'Updated successfully',
    data: {
      medias: (await getMediasByShopId(shopId))
        .map(item => item?.medias)
        .flat()
        .sort(sortByTime)
    }
  });
}
