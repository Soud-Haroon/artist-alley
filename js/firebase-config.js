
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBaekTDsTlMwiJyHuLv_veg44dvRv3gNkk",
  authDomain: "artist-alley-73c47.firebaseapp.com",
  projectId: "artist-alley-73c47",
  storageBucket: "artist-alley-73c47.appspot.com",
  messagingSenderId: "522572537907",
  appId: "1:522572537907:web:fab0c5a7d822e533bc0346",
  measurementId: "G-LXKCBRQSVV"
};

// Initialize Firebase
const firebase = initializeApp(firebaseConfig);
export { firebase };