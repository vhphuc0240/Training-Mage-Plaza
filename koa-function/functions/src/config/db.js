const serviceAccount = require("../config/serviceAccount.json");
const admin = require("firebase-admin");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
