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
 * @param instagramId
 * @returns {Promise<{[p: string]: FirebaseFirestore.DocumentFieldValue, id: string}|null>}
 */
export async function getUserByInstagramId(instagramId) {
  try {
    console.log(instagramId, 'instagramId', typeof instagramId);
    const igId = typeof instagramId == 'string' ? instagramId : instagramId.toString();
    const userSnapshot = await userRef
      .where('instagramId', '==', igId)
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
