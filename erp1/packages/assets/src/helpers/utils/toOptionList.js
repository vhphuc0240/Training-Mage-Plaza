/**
 * Prepare data to option data format
 *
 * @param options
 * @returns {{label: *, value: string}[]}
 */
export default function toOptionList(options) {
  return Object.keys(options).map(key => ({
    label: options[key],
    value: key
  }));
}
