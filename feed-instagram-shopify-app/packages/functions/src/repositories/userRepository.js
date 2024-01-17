import {Firestore} from '@google-cloud/firestore';

const firestore = new Firestore();
/** @type CollectionReference */
const userRef = firestore.collection('users');

/**
 *
 * @param data
 * @returns {Promise<boolean|string>}
 */
export async function saveUser(data) {
  try {
    const user = await userRef.add({...data});
    return user.id;
  } catch (e) {
    console.log(e);
    return false;
  }
}

/**
 *
 * @param shopId
 * @returns {Promise<{[p: string]: FirebaseFirestore.DocumentFieldValue, id: string}|null>}
 */
export async function getUserByShopId(shopId) {
  try {
    const userSnapshot = await userRef
      .where('shopId', '==', shopId)
      .limit(1)
      .get();
    if (userSnapshot.empty) return null;
    const [doc] = userSnapshot.docs;
    return {id: doc.id, ...doc.data()};
  } catch (e) {
    console.log(e);
    return null;
  }
}

/**
 *
 * @param id
 * @returns {Promise<{[p: string]: FirebaseFirestore.DocumentFieldValue, id}|null>}
 */
export async function getUserById(id) {
  try {
    const userSnapshot = await userRef.doc(id).get();
    if (!userSnapshot.exists) return null;
    return {id, ...userSnapshot.data()};
  } catch (e) {
    console.log(e);
    return null;
  }
}

/**
 *
 * @param id
 * @param data
 * @returns {Promise<{[p: string]: FirebaseFirestore.DocumentFieldValue, id}|null|boolean>}
 */
export async function updateUserWhenRefreshInstagramAccessToken(id, data) {
  try {
    await userRef.doc(id).set(data, {merge: true});
    return await getUserById(id);
  } catch (e) {
    console.log(e);
    return false;
  }
}

/**
 * @param shopId
 * @returns {Promise<boolean>}
 */
export async function deleteUserByShopId(shopId) {
  try {
    const userSnapshot = await userRef.where('shopId', '==', shopId).get();
    if (userSnapshot.empty) return true;
    const batch = firestore.batch();
    userSnapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });
    await batch.commit();
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
}
