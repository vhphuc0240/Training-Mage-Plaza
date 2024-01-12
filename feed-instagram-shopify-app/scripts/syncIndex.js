const {promisify} = require('util');
const exec = promisify(require('child_process').exec);
const fs = require('fs');

const indexFile = 'firestore.indexes.json';

(async () => {
  console.log('[1] Updating local indexes file...');
  const indexOutput = await exec('firebase firestore:indexes');
  fs.writeFileSync(indexFile, indexOutput.stdout);
  console.log(`[1][Result] File: ${indexFile} updated!!`);
  console.log('[2] Deploying indexes...');
  const deployResult = await exec('firebase deploy --only firestore:indexes');
  console.log('[2]' + '[Result]', deployResult.stdout);
  console.log('-----------Finished sync index-----------');
})();
