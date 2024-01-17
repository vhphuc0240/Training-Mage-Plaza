import {Firestore} from '@google-cloud/firestore';

const firestore = new Firestore();
/** @type CollectionReference */
const mediasRef = firestore.collection('medias');

/**
 * @param shopifyDomain
 * @param shopId
 * @param instagramId
 * @param userId
 * @param medias
 * @returns {Promise<{medias, instagramId, index, id: string, shopId, shopifyDomain, userId}|boolean>}
 */
export async function saveMedias(shopifyDomain, shopId, instagramId, userId, medias) {
  try {
    const media = await mediasRef.add({
      shopifyDomain,
      shopId,
      instagramId,
      userId,
      medias
    });
    return {
      id: media.id,
      shopifyDomain,
      shopId,
      instagramId,
      userId,
      medias
    };
  } catch (e) {
    console.log(e);
    return false;
  }
}

/**
 *
 * @param shopId
 * @returns {Promise<(*&{id: *})[]|*[]>}
 */
export async function getMediasByShopId(shopId) {
  try {
    const mediaSnapshot = await mediasRef.where('shopId', '==', shopId).get();
    if (mediaSnapshot.empty) return [];
    return mediaSnapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
  } catch (e) {
    console.log(e);
    return [];
  }
}

/**
 * @param shopId
 * @returns {Promise<boolean>}
 */
export async function deleteMediaByShopId(shopId) {
  try {
    const media = mediasRef.where('shopId', '==', shopId);
    const mediaSnapshot = await media.get();
    if (mediaSnapshot.empty) return true;
    const batch = firestore.batch();
    mediaSnapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });
    await batch.commit();
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
}

/**
 * @param shopifyDomain
 * @returns {Promise<(*&{id: *})[]|*[]>}
 */
export async function getMediaByShopifyDomain(shopifyDomain) {
  try {
    const mediaSnapshot = await mediasRef.where('shopifyDomain', '==', shopifyDomain).get();
    if (mediaSnapshot.empty) return [];
    return mediaSnapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
  } catch (e) {
    console.log(e);
    return [];
  }
}

export async function getMediaById(id) {
  try {
    const mediaSnapshot = await mediasRef.doc(id).get();
    return {id, ...mediaSnapshot.data()};
  } catch (e) {
    console.log(e);
    return [];
  }
}

export async function updateMediaById(id, data) {
  try {
    await mediasRef.doc(id).set(data, {merge: true});
  } catch (e) {
    console.log(e);
    return false;
  }
}

export async function deleteMediaById(id) {
  try {
    await mediasRef.doc(id).delete();
  } catch (e) {
    console.log(e);
    return false;
  }
}
