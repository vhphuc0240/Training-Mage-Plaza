import axios from 'axios';
import * as firebase from 'firebase/app';
import 'firebase/storage';
import 'firebase/auth';
import 'firebase/firestore';
import {createBrowserHistory} from 'history';
import {CRM_APP_KEY, CRM_ENV_KEY, getStorageData} from './helpers/storage';
import isOutboundLink from './helpers/utils/isOutboundLink';

firebase.initializeApp({
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET
});

export const auth = firebase.auth();
export const storage = firebase.storage();
export const db = firebase.firestore();

export const history = createBrowserHistory();

if (module.hot) module.hot.accept();

/**
 * A method to call API with given settings
 *
 * @param {string} url
 * @param {string} method
 * @param {object} data
 * @param {object} params
 * @param {object} options
 * @param {object} clientConfig
 * @return {Promise<object>}
 */
export async function api({
  url,
  method = 'GET',
  data = {},
  params = {},
  options = {},
  clientConfig = {timeout: 30000}
}) {
  const idToken = await auth.currentUser.getIdToken(false);
  const apiUrl = isOutboundLink(url) ? url : `/api${url}`;
  // if (!isOutboundLink(url)) {
  //   params.env = getStorageData(CRM_ENV_KEY, '');
  //   params.appType = getStorageData(CRM_APP_KEY, '');
  // }

  const {timeout} = clientConfig;
  const client = axios.create({
    baseURL: 'http://127.0.0.1:5000',
    headers: {
      'Content-Type': 'application/json'
    },
    timeout
  });
  return client
    .request({
      ...options,
      data,
      headers: {
        accept: 'application/json',
        ...(options.headers || {}),
        'x-auth-token': idToken
      },
      method,
      // params,
      url: apiUrl
    })
    .then(res => res.data);
}

export function slugify(string) {
  const a = 'àáâäæãåāăąçćčđďèéêëēėęěğǵḧîïíīįìłḿñńǹňôöòóœøōõőṕŕřßśšşșťțûüùúūǘůűųẃẍÿýžźż·/_,:;';
  const b = 'aaaaaaaaaacccddeeeeeeeegghiiiiiilmnnnnoooooooooprrsssssttuuuuuuuuuwxyyzzz------';
  const p = new RegExp(a.split('').join('|'), 'g');

  return string
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(p, c => b.charAt(a.indexOf(c))) // Replace special characters
    .replace(/&/g, '-and-') // Replace & with 'and'
    .replace(/[^\w\-]+/g, '') // Remove all non-word characters
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text
}
