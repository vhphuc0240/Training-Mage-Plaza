import {Firestore} from '@google-cloud/firestore';

const firestore = new Firestore();
/** @type CollectionReference */
const settingRef = firestore.collection('settings');

/**
 * @param instagramId
 * @returns {Promise<FirebaseFirestore.DocumentData|null>}
 */
export async function getSettingsByInstagramId(instagramId) {
  try {
    const settingSnapshot = await settingRef.doc(instagramId).get();
    if (!settingSnapshot.exists) return null;
    return settingSnapshot.data();
  } catch (e) {
    console.log(e);
    return null;
  }
}

/**
 * @param shopifyDomain
 * @param shopId
 * @param instagramId
 * @param settings
 * @returns {Promise<(*&{id, shopId, shopifyDomain})|boolean>}
 */
export async function saveSettingsWithInstagramId(shopifyDomain, shopId, instagramId, settings) {
  try {
    await settingRef.doc(instagramId).set({shopifyDomain, shopId, ...settings}, {merge: true});
    return {
      id: instagramId,
      ...settings,
      shopifyDomain,
      shopId
    };
  } catch (e) {
    console.log(e);
    return false;
  }
}

/**
 * @param shopifyDomain
 * @returns {Promise<boolean>}
 */
export async function deleteSettingsByShopifyDomain(shopifyDomain) {
  try {
    const settings = await settingRef.where('shopifyDomain', '==', shopifyDomain).get();
    if (settings.empty) return true;
    await Promise.all(settings.docs.map(async doc => await doc.ref.delete()));
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
}
