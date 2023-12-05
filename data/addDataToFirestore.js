const admin = require('firebase-admin');
const serviceAccount = require('../boycott-40766-firebase-adminsdk-9lfbk-0a9af0fd70.json'); // Replace with your serviceAccountKey.json path

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const firestore = admin.firestore();

const forumsData = [
  {
    id: "1",
    name: "Forum 1",
    description: "Description for Forum 1",
    date: new Date().toLocaleDateString(),
  },
  {
    id: "2",
    name: "Forum 2",
    description: "Description for Forum 2",
    date: new Date().toLocaleDateString(),
  },
  {
    id: "3",
    name: "Forum 3",
    description: "Description for Forum 3",
    date: new Date().toLocaleDateString(),
  },
];

const postsData = [
  {
    id: "1",
    type: "tweet",
    title: "Exciting news!",
    content: "Just launched my new product. Check it out!",
    date: "2023-11-17",
image: "../assets/images/bird.png",
  },
];

async function addData() {
  try {
    // Add forums data to Firestore
    await Promise.all(forumsData.map(async (forum) => {
      await firestore.collection('forums').add(forum);
    }));

    // Add posts data to Firestore
    await Promise.all(postsData.map(async (post) => {
      await firestore.collection('posts').add(post);
    }));

    console.log('Data added to Firestore successfully!');
  } catch (error) {
    console.error('Error adding data to Firestore:', error);
  } finally {
    // Close the Firebase Admin app
    admin.app().delete();
  }
}

addData();
