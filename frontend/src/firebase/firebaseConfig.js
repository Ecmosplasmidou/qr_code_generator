import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// Importe ici les services dont tu auras besoin, par exemple :
// import { getFirestore } from "firebase/firestore";
// import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBYWOYjhxu6_CHfcqL86HjsG-sdifh5Ozo",
  authDomain: "qr-code-generator-d14e5.firebaseapp.com",
  projectId: "qr-code-generator-d14e5",
  storageBucket: "qr-code-generator-d14e5.firebasestorage.app",
  messagingSenderId: "797213894838",
  appId: "1:797213894838:web:f7bae2a3c8229d092dde17",
  measurementId: "G-PK1SQCE61G"
};

// Initialisation de Firebase
const app = initializeApp(firebaseConfig);

// Initialisation des services
export const analytics = getAnalytics(app);
// export const db = getFirestore(app);
// export const auth = getAuth(app);

export default app;