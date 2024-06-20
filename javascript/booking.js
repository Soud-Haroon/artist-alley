import { db } from '../app.js';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';
import { query, where, onSnapshot } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Define a model for your booking requests (optional)
class BookingRequest {
    constructor(name, email, phone, business_name, age, user_type, offer, address, req_date) {
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.business_name = business_name;
        this.age = age;
        this.user_type = user_type;
        this.offer = offer;
        this.address = address;
        this.req_date = req_date;
    }
}

// listening to data base //the callback function
// function myListening() {
//     try {
//         onSnapshot(collection(db, "request"), (snapshot) => {
//             console.log(`Total records : ${snapshot.size} `);
//             snapshot.forEach((doc) => {
//                 console.log(" Document id: ", doc.id);
//                 console.log(`Document content: ${JSON.stringify(doc.data())}`);
//             }
//             );
//         });
//     } catch (error) {
//         console.log("error while listening to request:", error);
//     }
// }

// Fetch and listen for data changes
const q = query(collection(db, "request"));
const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const requests = [];
    querySnapshot.forEach((doc) => {
        const requestData = doc.data();
        const myUser = new BookingRequest(
            requestData.name,
            requestData.email,
            requestData.phone,
            requestData.business_name,
            requestData.age,
            requestData.user_type,
            requestData.offer,
            requestData.address,
            requestData.req_date
        );
        requests.push(myUser);
    });

    // Clear previous content in #request
    document.getElementById('request').innerHTML = '';

    // Render the booking requests in the UI
    requests.forEach((request) => {
        renderBookingRequest(request);
    });

    console.log("Current request in database: ", requests);
});

// Function to render a booking request in the UI
function renderBookingRequest(request) {
    const requestElement = document.createElement('div');
    requestElement.classList.add('request-item');
    requestElement.innerHTML = `
        <h2>${request.name}</h2>
        <p>Email: ${request.email}</p>
        <p>Phone: ${request.phone}</p>
        <p>Business Name: ${request.business_name}</p>
        <p>Age: ${request.age}</p>
        <p>User Type: ${request.user_type}</p>
        <p>Offer: ${request.offer}</p>
        <p>Address: ${request.address}</p>
        <p>Request Date: ${request.req_date}</p>
    `;
    document.getElementById('request').appendChild(requestElement);
}


// Create Operation
async function makeRequest() {
    try {
        const docRef = await addDoc(collection(db, "request"), {
            name: "fiasal haroon",
            email: "soudharoon@gmail.com",
            phone: 6722728422,
            business_name: "root cafe",
            age: 24,
            user_type: "ower",
            offer: "Hi, $20 per hour",
            address: "vancouver",
            req_date: Date(),
        });
        const docID = docRef.id;

        await doc(db, "users", docID);
        updateDoc(docRef, {
            uid: docID,
        });
        console.log("request created and id updated!");
        console.log("Document written with ID: ", docID);
    } catch (error) {
        console.error("Error adding document: ", error);
    }
}


window.makeRequest = makeRequest;

console.log('Firebase booking loaded!');