(function() {
  const BASE_URL = 'http://localhost:5000/scripttag';
  const scriptEle = document.createElement('script');
  scriptEle.type = 'text/javascript';
  scriptEle.src = `${BASE_URL}/test-notifications.js?v=${new Date().getTime()}`;
  const firstScript = document.getElementsByTagName('script')[0];
  firstScript.parentNode.insertBefore(scriptEle, firstScript);
})();
