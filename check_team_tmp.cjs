const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs } = require('firebase/firestore');
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
getDocs(collection(db, 'team')).then(snap => {
  snap.forEach(d => {
    const data = d.data();
    console.log('ID:', d.id);
    console.log('  name:', data.name);
    console.log('  image:', data.image || '(empty)');
    console.log('  photoUrl:', data.photoUrl || '(empty)');
    console.log('  imageUrl:', data.imageUrl || '(empty)');
    console.log('  active:', data.active);
  });
}).catch(e => console.error('ERR:', e.message));
