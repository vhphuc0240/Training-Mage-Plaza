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
 *
 * @param instagramId
 * @param settings
 * @returns {Promise<(*&{id})|boolean>}
 */
export async function saveSettingsWithInstagramId(instagramId, settings) {
  try {
    await settingRef.doc(instagramId).set(settings, {merge: true});
    return {
      id: instagramId,
      ...settings
    };
  } catch (e) {
    console.log(e);
    return false;
  }
}
