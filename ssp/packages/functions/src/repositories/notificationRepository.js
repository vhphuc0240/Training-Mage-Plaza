import {Firestore} from '@google-cloud/firestore';

const firestore = new Firestore();
/** @type CollectionReference */
const notificationsRef = firestore.collection('notifications');

export async function addNotifications(shopId, shopDomain, data) {
  try {
    const batch = firestore.batch();
    data.map(item => {
      const ref = notificationsRef.doc();
      batch.set(ref, {...item, shopId, shopDomain});
    });
    await batch.commit();
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
}

export async function getNotificationsByShopId(shopId, {perPage, page, sort}) {
  try {
    const [sortField, sortValue] = sort.split(':');
    const notificationQuery = await notificationsRef.where('shopId', '==', shopId);
    const notificationCount = await notificationQuery.count().get();
    const notificationSnapshot = await notificationQuery
      .orderBy(sortField, sortValue ? sortValue : 'asc')
      .offset((page - 1) * perPage)
      .limit(perPage)
      .get();
    const notifications = notificationSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    return {
      notifications,
      total: notificationCount.data().count
    };
  } catch (e) {
    console.error(e);
    return {data: [], count: 0, hasPre: false, hasNext: true, error: e.message};
  }
}

export async function getNotificationsByShopDomain(shopDomain) {
  try {
    const notificationSnapshot = await notificationsRef.where('shopDomain', '==', shopDomain).get();
    return notificationSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (e) {
    console.error(e);
    return {data: [], error: e.message};
  }
}
