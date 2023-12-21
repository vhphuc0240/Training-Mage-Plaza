import axios from 'axios';
import createApp from '@shopify/app-bridge';
import {authenticatedFetch} from '@shopify/app-bridge-utils';
import {Redirect} from '@shopify/app-bridge/actions';
import {initializeApp} from 'firebase/app';
import {getAuth} from 'firebase/auth';
import {getApiPrefix} from '@functions/const/app';
import {isEmbeddedApp} from '@assets/config/app';

const app = initializeApp({
  appId: process.env.FIREBASE_APP_ID,
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET
});

export const auth = getAuth(app);
export const embedApp = createEmbedApp();
export const client = axios.create({timeout: 60000});
export const api = createApi();

if (module.hot) module.hot.accept();

function createEmbedApp() {
  const host = new URL(window.location).searchParams.get('host');
  if (host) return createApp({host, apiKey: process.env.SHOPIFY_API_KEY, forceRedirect: true});
}

/**
 * @return {(uri: string, options?: {headers?, body?, method?: 'GET' | 'POST' | 'PUT' | 'DELETE'}) => Promise<any>}
 */
function createApi() {
  const prefix = getApiPrefix(isEmbeddedApp);

  if (isEmbeddedApp) {
    const fetchFunction = authenticatedFetch(embedApp);
    return async (uri, options = {}) => {
      if (options.body) {
        options.body = JSON.stringify(options.body);
        options.headers = options.headers || {};
        options.headers['Content-Type'] = 'application/json';
      }
      const response = await fetchFunction(prefix + uri, options);
      checkHeadersForReauthorization(response.headers, embedApp);
      return await response.json();
    };
  }

  const sendRequest = async (uri, options) => {
    const idToken = await auth.currentUser.getIdToken(false);
    return client
      .request({
        ...options,
        headers: {
          accept: 'application/json',
          ...(options.headers || {}),
          'x-auth-token': idToken
        },
        url: prefix + uri,
        method: options.method,
        data: options.body
      })
      .then(res => res.data);
  };

  return async (uri, options = {}) => sendRequest(uri, options);
}

function checkHeadersForReauthorization(headers, app) {
  if (headers.get('X-Shopify-API-Request-Failure-Reauthorize') !== '1') {
    return;
  }
  const authUrlHeader = headers.get('X-Shopify-API-Request-Failure-Reauthorize-Url') || `/api/auth`;
  const redirect = Redirect.create(app);
  redirect.dispatch(
    Redirect.Action.REMOTE,
    authUrlHeader.startsWith('/')
      ? `https://${window.location.host}${authUrlHeader}`
      : authUrlHeader
  );
}
