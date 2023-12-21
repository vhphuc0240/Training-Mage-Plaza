/**
 * Check is outbound link or not
 * @param {string} url
 * @return {boolean}
 */
export default function isOutboundLink(url) {
  return /^(?:[a-z][a-z\d+.-]*:|\/\/)/.test(url);
}
