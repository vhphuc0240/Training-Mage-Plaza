import Router from 'koa-router';
import * as sampleController from '@functions/controllers/sampleController';
import * as shopController from '@functions/controllers/shopController';
import * as subscriptionController from '@functions/controllers/subscriptionController';
import * as appNewsController from '@functions/controllers/appNewsController';
import * as userController from '@functions/controllers/userController';
import * as settingsController from '@functions/controllers/settingsController';

import {getApiPrefix} from '@functions/const/app';

export default function apiRouter(isEmbed = false) {
  const router = new Router({prefix: getApiPrefix(isEmbed)});

  router.get('/samples', sampleController.exampleAction);
  router.get('/shops', shopController.getUserShops);
  router.get('/subscription', subscriptionController.getSubscription);
  router.get('/appNews', appNewsController.getList);

  router.post('/check-user-exit', userController.checkUserExit);
  router.get('/user', userController.getUserDataByInstagramId);
  router.delete('/user', userController.deleteUser);
  router.get('/sync', userController.syncNewMedias);
  // router.get('/get-media');
  router.put('/settings', settingsController.saveSettings);
  router.get('/settings', settingsController.getSettingsByIgId);

  return router;
}
