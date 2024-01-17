import Router from 'koa-router';
import * as socialController from '@functions/controllers/socialController';

export default function apiRouter() {
  const router = new Router({prefix: '/authSocial'});

  router.get('/handle', socialController.handle);
  return router;
}
