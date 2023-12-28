import {Firestore} from '@google-cloud/firestore';

const firestore = new Firestore();
/** @type CollectionReference */
const mediaRef = firestore.collection('medias');

/**
 *
 * @param instagramId
 * @param userId
 * @param medias
 * @returns {Promise<*|boolean>}
 */
export async function saveMediasWithInstagramId(instagramId, userId, medias) {
  try {
    const batch = firestore.batch();
    const resp = medias.map(media => {
      const docRef = mediaRef.doc();
      batch.set(docRef, {instagramId, userId, ...media});
      return {
        id: docRef.id,
        ...media
      };
    });
    await batch.commit();
    return resp;
  } catch (e) {
    console.log(e);
    return false;
  }
}

/**
 *
 * @param instagramId
 * @returns {Promise<(*&{id: *})[]|*[]>}
 */
export async function getMediasByInstagramId(instagramId) {
  try {
    const mediaSnapshot = await mediaRef
      .where('instagramId', '==', instagramId)
      .orderBy('timestamp', 'desc')
      .get();
    if (mediaSnapshot.empty) return [];
    return mediaSnapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
  } catch (e) {
    console.log(e);
    return [];
  }
}
