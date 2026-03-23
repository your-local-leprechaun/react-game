import { initializeApp } from 'firebase/app'
import { getFirestore, collection, addDoc, getDocs, query, orderBy, limit } from 'firebase/firestore'

const firebaseConfig = {
    apiKey: "API_KEY_HERE",
    authDomain: "racer-b6526.firebaseapp.com",
    projectId: "racer-b6526",
    storageBucket: "racer-b6526.firebasestorage.app",
    messagingSenderId: "754563958926",
    appId: "1:754563958926:web:9927056652ab3fb673a1df",
    measurementId: "G-Q9K5FLNLFJ"
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

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
