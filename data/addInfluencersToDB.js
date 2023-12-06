const admin = require('firebase-admin');
const serviceAccount = require('../boycott-40766-firebase-adminsdk-9lfbk-0a9af0fd70.json');
const peopleData = require('./people.json'); // Assuming people.json is in the same directory

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://boycott-40766.firebaseio.com',
});

// Reference to Firestore
const db = admin.firestore();

// Function to add people to Firestore
async function addPeopleToFirestore() {
  try {
    const people = peopleData.influencers; // Assuming the property is named "influencers"
    const collectionName = 'Influencers'; // Change this to the desired collection name

    for (const person of people) {
      const personRef = db.collection(collectionName).doc(person.id);
        
      // Check if the person already exists
      const existingPerson = await personRef.get();
        
      if (!existingPerson.exists) {
        // Add the person if it doesn't exist
        await personRef.set(person);
        
        // Print information about the added document
        console.log(`Person added with ID (and as name): ${person.id}`);
        console.log('Data:', person);
        console.log('------------------------------------');
      } else {
        // Print information about the duplicate
        console.log(`Duplicate person found with ID: ${person.id}`);
        console.log('Data:', person);
        console.log('------------------------------------');
      }
    }
    console.log('All people added successfully!');
  } catch (error) {
    console.error('Error adding people: ', error);
  } finally {
    // Close the Firestore connection
    admin.app().delete();
  }
}

// Run the function
addPeopleToFirestore();
