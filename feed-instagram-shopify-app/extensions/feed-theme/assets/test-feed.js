(function() {
  const BASE_URL = 'http://localhost:5000/scripttag';
  console.log('test-feed.js');
  const scriptEle = document.createElement('script');
  scriptEle.type = 'text/javascript';
  scriptEle.src = `${BASE_URL}/test-feed.js?v=${new Date().getTime()}`;
  const firstScript = document.getElementsByTagName('script')[0];
  firstScript.parentNode.insertBefore(scriptEle, firstScript);
})();
