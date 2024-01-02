import Router from 'koa-router';
import * as clientApiController from '@functions/controllers/clientApiController';

export default function apiRouter() {
  const router = new Router({prefix: '/clientApi'});

  router.get('/medias', clientApiController.getMedias);
  return router;
}
