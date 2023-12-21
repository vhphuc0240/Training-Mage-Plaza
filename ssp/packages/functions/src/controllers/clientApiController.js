import {getNotificationsByShopDomain} from '@functions/repositories/notificationRepository';

export async function getShopDataByShopDomain(ctx) {
  const {shopDomain} = ctx.req.query;
  const notifications = await getNotificationsByShopDomain(shopDomain);
  return (ctx.body = {
    data: {
      notifications
    },
    success: true
  });
}
