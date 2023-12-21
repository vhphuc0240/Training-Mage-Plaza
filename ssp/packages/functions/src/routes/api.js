import Router from 'koa-router';
import * as sampleController from '@functions/controllers/sampleController';
import * as shopController from '@functions/controllers/shopController';
import * as subscriptionController from '@functions/controllers/subscriptionController';
import * as appNewsController from '@functions/controllers/appNewsController';
import * as settingController from '@functions/controllers/settingController';
import * as notificationController from '@functions/controllers/notificationController';
import * as webhookController from '@functions/controllers/webhookController';
import {getApiPrefix} from '@functions/const/app';

export default function apiRouter(isEmbed = false) {
  const router = new Router({prefix: getApiPrefix(isEmbed)});

  router.get('/samples', sampleController.exampleAction);
  router.get('/shops', shopController.getUserShops);
  router.get('/subscription', subscriptionController.getSubscription);
  router.get('/appNews', appNewsController.getList);

  router.get('/settings', settingController.getShopSettingsById);
  router.put('/settings', settingController.updateShopSettingsById);

  router.get('/notifications', notificationController.getNotifications);

  router.get('/webhooks', webhookController.get);
  router.put('/webhook', webhookController.update);
  router.delete('/webhook', webhookController.deleteWebhook);
  return router;
}
