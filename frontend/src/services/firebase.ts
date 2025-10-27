// // src/services/firebase.ts
// import { initializeApp } from 'firebase/app';
// import { getAuth, connectAuthEmulator } from 'firebase/auth';
// import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
// import { getStorage, connectStorageEmulator } from 'firebase/storage';
// import { getAnalytics, isSupported } from 'firebase/analytics';

// // Firebase configuration from environment variables
// const firebaseConfig = {
//   apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
//   authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
//   projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
//   storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
//   appId: import.meta.env.VITE_FIREBASE_APP_ID,
//   measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);

// // Initialize Firebase Authentication
// export const auth = getAuth(app);

// // Initialize Firestore Database
// export const db = getFirestore(app);

// // Initialize Firebase Storage
// export const storage = getStorage(app);

// // Initialize Analytics (only in production)
// let analytics;
// if (typeof window !== 'undefined') {
//   isSupported().then((supported) => {
//     if (supported) {
//       analytics = getAnalytics(app);
//     }
//   });
// }
// export { analytics };

// // Connect to emulators in development
// if (import.meta.env.DEV) {
//   // Uncomment these lines if you're using Firebase emulators
//   // connectAuthEmulator(auth, 'http://localhost:9099');
//   // connectFirestoreEmulator(db, 'localhost', 8080);
//   // connectStorageEmulator(storage, 'localhost', 9199);
//   console.log('🔥 Firebase initialized in development mode');
// }

// export default app;
