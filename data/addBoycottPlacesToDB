const admin = require('firebase-admin');
const serviceAccount = require('../boycott-40766-firebase-adminsdk-9lfbk-0a9af0fd70.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://boycott-40766.firebaseio.com'
});

const firestore = admin.firestore();

const fs = require('fs');
const path = require('path');

// Read data from boycott.json
const filePath = path.join('./boycott.json');
const rawData = fs.readFileSync(filePath);
const jsonData = JSON.parse(rawData);

// Function to add data to Firestore
const addToFirestore = async (data) => {
  try {
    const boycottTargets = data.boycottTargets; // Assuming the property is named "boycottTargets"

    if (Array.isArray(boycottTargets)) {
      const collectionName = 'Boycott'; // Change this to the desired collection name

      // Create the collection
      const collectionRef = firestore.collection(collectionName);

      // Iterate through each item in the array
      for (const item of boycottTargets) {
        const documentId = item.name; // Use the "name" field as the document ID

        // Check if the document already exists
        const existingDoc = await collectionRef.doc(documentId).get();
        if (existingDoc.exists) {
          console.log(`Document with ID ${documentId} already exists. Skipping.`);
        } else {
          // Add the document to Firestore
          await collectionRef.doc(documentId).set(item);
          console.log(`Document with ID ${documentId} added to Firestore.`);
        }
      }

      console.log('Data added to Firestore successfully!');
    } else {
      console.error('The "boycottTargets" property in JSON file is not an array. Update the script to handle this case.');
    }
  } catch (error) {
    console.error('Error adding data to Firestore:', error);
  }
};

// Add data to Firestore
addToFirestore(jsonData);
