import {Firestore} from '@google-cloud/firestore';

const firestore = new Firestore();
/** @type CollectionReference */
const webhooksRef = firestore.collection('webhooks');

export async function addWebhooks(shopId, shopDomain, data) {
  try {
    await webhooksRef.add({shopId: shopId, shopDomain: shopDomain, ...data});
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
}
