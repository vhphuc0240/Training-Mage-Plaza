/**
 * @param {string} str
 * @param {number} num
 * @returns {string}
 */
export default function truncateString(str, num = 30) {
  if (str.length > num) {
    return str.slice(0, num) + '...';
  }
  return str;
}
