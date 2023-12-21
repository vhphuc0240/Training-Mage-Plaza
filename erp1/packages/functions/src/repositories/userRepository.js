import firebaseAdmin from '@functions/config/firebaseAdmin';

const userRef = firebaseAdmin.firestore().collection('users');

/**
 * @param {string} email
 * @returns {Object}
 */
export const checkUser = async email => {
  try {
    const userSnapshot = await userRef.where('email', '==', email).get();
    const user = userSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    return user[0];
  } catch (e) {
    console.log(e);
  }
};

/**
 * @param {string} id
 * @returns {Object}
 */
const getUserById = async id => {
  try {
    const userSnapshot = await userRef.doc(id).get();
    const user = userSnapshot.data();
    if (!user) return 'User not found';
    return {id, ...user};
  } catch (e) {
    console.log(e);
  }
};

/**
 * @param {string} id
 * @param {Object} updateFields
 * @returns {Object}
 */
export const updateUserById = async (id, updateFields) => {
  try {
    await userRef.doc(id).set(updateFields, {merge: true});
    return await getUserById(id);
  } catch (e) {
    console.log(e);
  }
};

/**
 * @param {number} limit
 * @param {"desc"|| "asc"} sort
 * @returns {Object}
 */
export const getUsers = async (limit, sort) => {
  try {
    const usersSnapshot = await userRef
      .limit(limit | 20)
      .orderBy('createdAt', sort)
      .get();
    return usersSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (e) {
    console.log(e);
  }
};

export const createUser = async createField => {
  try {
    const res = await userRef.add(createField);
    console.log('Added document with ID: ', res.id);
    const newUser = await getUserById(res.id);
    return {
      id: res.id,
      ...newUser
    };
  } catch (e) {
    console.log(e);
  }
};

export const deleteUser = async ids => {
  try {
    console.log(ids);
    const batch = firebaseAdmin.firestore().batch();
    ids.map(id => {
      const docRef = userRef.doc(id);
      batch.delete(docRef);
    });
    await batch.commit();
  } catch (e) {
    console.log(e);
  }
};

export const createBulkUsers = async data => {
  try {
    const batch = firebaseAdmin.firestore().batch();
    const resp = data.map(item => {
      const docRef = userRef.doc();
      batch.set(docRef, item);
      return {
        id: docRef.id,
        ...item
      };
    });
    await batch.commit();
    return resp;
  } catch (e) {
    console.log(e);
  }
};
