const admin = require('firebase-admin');
const serviceAccount = require('../boycott-40766-firebase-adminsdk-9lfbk-0a9af0fd70.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://boycott-40766.firebaseio.com'
});

const firestore = admin.firestore();

const deleteEverything = async () => {
  try {
    // Get all top-level collections in the Firestore database
    const collections = await firestore.listCollections();

    // Iterate through each collection and delete all documents
    for (const collectionRef of collections) {
      const documents = await collectionRef.listDocuments();
      for (const docRef of documents) {
        await docRef.delete();
      }
    }

    console.log('All data deleted from Firestore successfully!');
  } catch (error) {
    console.error('Error deleting data from Firestore:', error);
  } finally {
    // Close the Firestore connection
    admin.app().delete();
  }
};

// Delete everything in Firestore
deleteEverything();
