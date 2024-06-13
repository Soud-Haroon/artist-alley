import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';

const firebaseConfig = {
    apiKey: "AIzaSyAq_KXxghXKrYtbEpNEfL7M1hJOK9Z5LEA",
    authDomain: "artist-alley-24.firebaseapp.com",
    projectId: "artist-alley-24",
    storageBucket: "artist-alley-24.appspot.com",
    messagingSenderId: "341520869453",
    appId: "1:341520869453:web:b7dba029d03445f5101404",
    measurementId: "G-KZBL0MZCWF"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

onAuthStateChanged(auth, user => {
    if (user != null) {
        console.log('logged in!');
    } else {
        console.log('No user');
    }
});

// Create Operation
async function addDocument() {
    try {
        const docRef = await addDoc(collection(db, "users"), {
            name: "soud haroon",
            email: "soudharoon@gmail.com"
        });
        console.log("Document written with ID: ", docRef.id);
        displayMessage(`Document added with ID: ${docRef.id}`);
    } catch (error) {
        console.error("Error adding document: ", error);
        displayMessage("Error adding document");
    }
}

// Read Operation
async function getDocuments() {
    try {
        const querySnapshot = await getDocs(collection(db, "users"));
        let output = "";
        querySnapshot.forEach((doc) => {
            console.log(`${doc.id} => ${doc.data().name}, ${doc.data().email}`);
            output += `${doc.id} => ${doc.data().name}, ${doc.data().email}<br>`;
        });
        displayMessage(output);
    } catch (error) {
        console.error("Error getting documents: ", error);
        displayMessage("Error getting documents");
    }
}

// Update Operation
async function updateDocument(docId) {
    try {
        const docRef = doc(db, "users", docId);
        await updateDoc(docRef, {
            name: "Jane Doe"
        });
        console.log("Document successfully updated!");
        displayMessage("Document successfully updated!");
    } catch (error) {
        console.error("Error updating document: ", error);
        displayMessage("Error updating document");
    }
}

// Delete Operation
async function deleteDocument(docId) {
    try {
        const docRef = doc(db, "users", docId);
        await deleteDoc(docRef);
        console.log("Document successfully deleted!");
        displayMessage("Document successfully deleted!");
    } catch (error) {
        console.error("Error removing document: ", error);
        displayMessage("Error deleting document");
    }
}

// Function to display messages in the content div
function displayMessage(message) {
    document.getElementById("content").innerHTML = message;
}

// Expose functions to the global scope
window.addDocument = addDocument;
window.getDocuments = getDocuments;
window.updateDocument = updateDocument;
window.deleteDocument = deleteDocument;

console.log('Firebase loaded!');
