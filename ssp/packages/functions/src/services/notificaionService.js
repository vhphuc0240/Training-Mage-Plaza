import {addNotifications} from '@functions/repositories/notificationRepository';

export async function syncNotifications(shopId, shopDomain, data) {
  try {
    return await addNotifications(shopId, shopDomain, data);
  } catch (e) {
    console.log(e);
    return false;
  }
}
