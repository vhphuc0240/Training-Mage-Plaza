import App from 'koa';
import 'isomorphic-fetch';
import {contentSecurityPolicy, getShopByShopifyDomain, shopifyAuth} from '@avada/shopify-auth';
import shopifyConfig from '@functions/config/shopify';
import render from 'koa-ejs';
import path from 'path';
import createErrorHandler from '@functions/middleware/errorHandler';
import firebase from 'firebase-admin';
import appConfig from '@functions/config/app';
import {
  createMetaFields,
  getNotifications,
  registerWebhook
} from '@functions/services/shopifyApiService';
import {syncNotifications} from '@functions/services/notificaionService';
import {addSettingsForShopByShopId} from '@functions/repositories/settingRepository';
import {defaultSettings} from '@functions/const/setting/defaulSetting';
import Shopify from 'shopify-api-node';

if (firebase.apps.length === 0) {
  firebase.initializeApp();
}

// Initialize all demand configuration for an application
const app = new App();
app.proxy = true;

render(app, {
  cache: true,
  debug: false,
  layout: false,
  root: path.resolve(__dirname, '../../views'),
  viewExt: 'html'
});
app.use(createErrorHandler());
app.use(contentSecurityPolicy(true));

// Register all routes for the application
app.use(
  shopifyAuth({
    apiKey: shopifyConfig.apiKey,
    firebaseApiKey: shopifyConfig.firebaseApiKey,
    scopes: shopifyConfig.scopes,
    secret: shopifyConfig.secret,
    successRedirect: '/embed',
    initialPlan: {
      id: 'free',
      name: 'Free',
      price: 0,
      trialDays: 0,
      features: {}
    },
    hostName: appConfig.baseUrl,
    isEmbeddedApp: true,
    afterInstall: async ctx => {
      const shopifyDomain = ctx.state.shopify.shop;
      const shopData = await getShopByShopifyDomain(shopifyDomain);
      const {id} = shopData;
      const shopify = new Shopify({
        accessToken: shopData.accessToken,
        shopName: shopData.shopifyDomain
      });
      const orders = await getNotifications(shopify);
      await syncNotifications(id, shopifyDomain, orders);
      await addSettingsForShopByShopId(id, shopifyDomain, defaultSettings);
      await registerWebhook(id, shopifyDomain, shopify);
      await createMetaFields(id, shopify);

      // await registerScriptTags(shopify);
      return (ctx.body = {
        success: true
      });
    },
    afterThemePublish: ctx => {
      // Publish assets when theme is published or changed here
      return (ctx.body = {
        success: true
      });
    }
  }).routes()
);

// Handling all errors
app.on('error', err => {
  console.error(err);
});

export default app;
