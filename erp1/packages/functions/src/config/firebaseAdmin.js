import serviceAccount from "../../serviceAccount.development.json" ;
import * as admin from "firebase-admin";

const firebaseAdmin = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export default firebaseAdmin;
