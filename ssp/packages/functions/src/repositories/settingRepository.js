import {Firestore} from '@google-cloud/firestore';

const firestore = new Firestore();
/** @type CollectionReference */
const shopSettingsRef = firestore.collection('settings');

export async function addSettingsForShopByShopId(shopId, shopifyDomain, data) {
  try {
    await shopSettingsRef.add({shopId: shopId, shopDomain: shopifyDomain, ...data});
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
}

const getShopSettings = async shopId => {
  try {
    const shopSettingsSnap = await shopSettingsRef.where('shopId', '==', shopId).get();
    if (shopSettingsSnap.empty) {
      return null;
    }
    return shopSettingsSnap.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (e) {
    console.log(e);
    return null;
  }
};

export async function getShopSettingsByShopDomain(shopDomain) {
  try {
    const shopSettingsSnap = await shopSettingsRef.where('shopDomain', '==', shopDomain).get();
    if (shopSettingsSnap.empty) {
      return null;
    }
    return shopSettingsSnap.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (e) {
    console.log(e);
    return null;
  }
}

/**
 * Get shop settings by given shop ID
 *
 * @param {string} shopId
 * @return {Promise<FirebaseFirestore.DocumentData>}
 */
export async function getShopSettingsByShopId(shopId) {
  const shopSettings = await getShopSettings(shopId);
  return shopSettings[0];
}

export async function updateShopSettingsByShopId(shopId, data) {
  try {
    await shopSettingsRef.doc(shopId).set(data, {merge: true});
    return await getShopSettings(shopId);
  } catch (err) {
    console.log(err);
    return {data: {}, error: err.message};
  }
}
