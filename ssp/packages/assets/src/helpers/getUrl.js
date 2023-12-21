import {routePrefix} from '../config/app';

/**
 * @param url
 * @returns {string}
 */
export function getUrl(url) {
  return routePrefix + url;
}
