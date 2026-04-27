import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, addDoc, query, orderBy, limit, getDocs } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export const submitScore = async (name, distance) => {
    await addDoc(collection(db, 'scores'), {
        name,
        distance,
        date: new Date()
    })
}

export const getTopScores = async (limitCount = 10) => {
    const q = query(collection(db, 'scores'), orderBy('distance', 'desc'), limit(limitCount))
    const snapshot = await getDocs(q)
    return snapshot.docs.map(doc => doc.data())
}
