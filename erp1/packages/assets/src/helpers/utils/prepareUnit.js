/**
 * @param {string|number} count
 * @param {string} singular
 * @param {string} plural
 * @returns {string}
 */
export default function prepareUnit(count, singular = 'item', plural = '') {
  const unit = Math.abs(count) <= 1 ? singular : plural;
  if (!unit && singular) {
    return singular + 's';
  }
  return unit;
}
