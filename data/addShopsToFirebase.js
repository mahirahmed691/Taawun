const admin = require('firebase-admin');
const serviceAccount = require('../boycott-40766-firebase-adminsdk-9lfbk-0a9af0fd70.json');
const shopData = require('./allowed.json');

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://boycott-40766.firebaseio.com',
});

// Reference to Firestore
const db = admin.firestore();

// Add data to Firestore
async function addShopsToFirestore() {
  try {
    // Use the correct property name
    const shopsArray = shopData.allowedTargets;

    for (const shop of shopsArray) {
      const { name, ...shopDataWithoutName } = shop;
      const shopRef = db.collection('Shops').doc(name);

      // Check if the document already exists
      const existingDoc = await shopRef.get();
      if (existingDoc.exists) {
        console.log(`Shop with ID ${name} already exists. Skipping.`);
      } else {
        // Set the data for the document.
        await shopRef.set(shopDataWithoutName);

        // Print information about the added document
        console.log(`Shop added with ID: ${name}`);
        console.log('Data:');
        console.log(JSON.stringify(shopDataWithoutName, null, 2)); // Display with indentation
        console.log('------------------------------------');
      }
    }
    console.log('All shops added successfully!');
  } catch (error) {
    console.error('Error adding shops: ', error);
  } finally {
    // Close the Firestore connection
    admin.app().delete();
  }
}

// Run the function
addShopsToFirestore();
