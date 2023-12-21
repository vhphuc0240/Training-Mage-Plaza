import {getCurrentShop} from '@functions/helpers/auth';
import {getNotificationsByShopId} from '@functions/repositories/notificationRepository';

export async function getNotifications(ctx) {
  const shopId = getCurrentShop(ctx);
  const {limit, page, sort} = ctx.req.query;
  const {notifications, total} = await getNotificationsByShopId(shopId, {
    perPage: Number(limit),
    sort,
    page: Number(page)
  });

  return (ctx.body = {
    data: notifications,
    success: true,
    pageInfo: {
      total,
      hasPrev: Number(page) > 1,
      hasNext: Number(page) < Math.ceil(total / Number(limit))
    }
  });
}
