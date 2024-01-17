import {Firestore} from '@google-cloud/firestore';

const firestore = new Firestore();
/** @type CollectionReference */
const settingRef = firestore.collection('settings');

/**
 * @param shopId
 * @returns {Promise<FirebaseFirestore.DocumentData|null>}
 */
export async function getSettingsByShopId(shopId) {
  try {
    const settingSnapshot = await settingRef.where('shopId', '==', shopId).get();
    if (settingSnapshot.empty) return null;
    return settingSnapshot.docs.map(doc => ({id: doc.id, ...doc.data()}))[0];
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
export async function saveSettingsWithShopId(shopifyDomain, shopId, instagramId, settings) {
  try {
    await settingRef
      .doc(shopId)
      .set({shopifyDomain, shopId, instagramId, ...settings}, {merge: true});
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

export async function updateSettingsByShopId(shopId, settings) {
  try {
    await settingRef.doc(shopId).set({...settings}, {merge: true});
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
}

/**
 * @param shopId
 * @returns {Promise<boolean>}
 */
export async function deleteSettingsByShopId(shopId) {
  try {
    const settingsSnapshot = await settingRef.where('shopId', '==', shopId).get();
    if (settingsSnapshot.empty) return true;
    const batch = firestore.batch();
    settingsSnapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });
    await batch.commit();
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
}
