// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore/lite"
import { getStorage } from "firebase/storage"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

// console.log(process.env.REACT_APP_FIREBASE_projectId)

const firebaseConfig = {
    apiKey: "AIzaSyB4REmMUgL5jupPs5Vkbvs14fEmshWrvLg",
    authDomain: "my-todo-app-01.firebaseapp.com",
    projectId: "my-todo-app-01",
    storageBucket: "my-todo-app-01.appspot.com",
    messagingSenderId: "433680291721",
    appId: "1:433680291721:web:c7a0bd313337eb15f03358",
    measurementId: "G-6V49G1MK8Q"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const firestore = getFirestore(app);
const storage = getStorage(app);

export { analytics, auth, firestore, storage }