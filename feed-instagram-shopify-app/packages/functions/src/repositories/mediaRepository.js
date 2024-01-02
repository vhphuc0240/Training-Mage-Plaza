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
 * @returns {Promise<{medias, instagramId, id: string, shopId, shopifyDomain, userId}|boolean>}
 */
export async function saveMediasWithInstagramId(
  shopifyDomain,
  shopId,
  instagramId,
  userId,
  medias
) {
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
 * @param instagramId
 * @returns {Promise<(*&{id: *})[]|*[]>}
 */
export async function getMediasByInstagramId(instagramId) {
  try {
    const mediaSnapshot = await mediasRef
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

/**
 * @param userId
 * @returns {Promise<boolean>}
 */
export async function deleteMediaByUserId(userId) {
  try {
    const media = mediasRef.where('userId', '==', userId);
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
