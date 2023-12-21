import {store} from '../../index';
import {setToast} from '../../actions/layout/setToastAction';

/**
 * @param {string} text
 * @returns {*}
 */
export default function copyToClipboard(text) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => {});
  } else {
    fallbackCopyToClipboard(text);
  }
  store.dispatch(setToast({content: 'Copied to clipboard'}));
}

function fallbackCopyToClipboard(text) {
  const textArea = document.createElement('textarea');
  textArea.value = text;

  // Avoid scrolling to bottom
  textArea.style.top = '0';
  textArea.style.left = '0';
  textArea.style.position = 'fixed';

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    const successful = document.execCommand('copy');
    const msg = successful ? 'successful' : 'unsuccessful';
    console.log('Fallback: Copying text command was ' + msg);
  } catch (err) {
    console.error('Fallback: Oops, unable to copy', err);
  }

  document.body.removeChild(textArea);
}
