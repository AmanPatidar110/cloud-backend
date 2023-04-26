const admin = require('firebase-admin');
const { getDatabase } = require('firebase-admin/database');
const { firebaseConfig } = require('./firebase-config');

// Initialize the app with a service account, granting admin privileges
const firebaseApp = admin.initializeApp({
  credential: admin.credential.cert(firebaseConfig),
  // The database URL depends on the location of the database
  databaseURL:
    'https://in-house-cloud-default-rtdb.asia-southeast1.firebasedatabase.app/',
});

// As an admin, the app has access to read and write all data, regardless of Security Rules

const realTimeDB = getDatabase();
// var ref = reaTimeDB.ref('restricted_access/secret_document');

module.exports = { realTimeDB, firebaseApp };
