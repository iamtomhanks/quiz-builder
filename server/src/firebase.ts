import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore/lite";
import { getAuth } from "firebase/auth";
import admin from "firebase-admin";
import dotenv from "dotenv";
dotenv.config();

const firebaseConfig = {
	apiKey: `${process.env.FIREBASE_API_KEY}`,
	authDomain: `${process.env.FIREBASE_AUTH_DOMAIN}`,
	projectId: `${process.env.FIREBASE_PROJECT_ID}`,
	storageBucket: `${process.env.FIREBASE_STORAGE_BUCKET}`,
	messagingSenderId: `${process.env.FIREBASE_MESSAGING_SENDER_ID}`,
	appId: `${process.env.FIREBASE_APP_ID}`,
	measurementId: `${process.env.FIREBASE_MEASUREMENT_ID}`
};

const firebaseAccountKey: admin.ServiceAccount = {
  privateKey: `${process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')}`,
  clientEmail: `${process.env.FIREBASE_CLIENT_EMAIL}`,
  projectId: `${process.env.FIREBASE_PROJECT_ID}`,
};

const firebaseAdminApp = admin.initializeApp({
  credential: admin.credential.cert(firebaseAccountKey),
  databaseURL: firebaseConfig.authDomain
});

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const firebaseAuth = getAuth(firebaseApp);

export {
    firebaseAdminApp,
    db,
    firebaseAuth
};