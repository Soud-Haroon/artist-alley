import { db } from '../app.js';
import { collection, addDoc, getDocs, getDoc, updateDoc, deleteDoc, doc } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';
import { query, where, onSnapshot } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Define a model for your booking requests (optional)
class BookingRequest {
    constructor(name, email, phone, business_name, age, user_type, offer, address, req_date, response, uid) {
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.business_name = business_name;
        this.age = age;
        this.user_type = user_type;
        this.offer = offer;
        this.address = address;
        this.req_date = req_date;
        this.response = response;
        this.uid = uid;
    }
}


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
            requestData.req_date,
            requestData.response,
            requestData.uid,
        );
        requests.push(myUser);
    });

    // Clear previous content in #request
    document.getElementById('request').innerHTML = '';

    // Render the booking requests in the UI
    // requests.forEach((request) => {
    //     renderBookingRequest(request);
    // });

    renderBookingRequest(requests);

    console.log("Current request in database: ", requests);
});

// Function to generate HTML for all booking requests and update the UI
function renderBookingRequest(requests) {
    const container = document.getElementById('request');

    // Clear the container
    container.innerHTML = '';

    // Get the template content
    const template = document.getElementById('request-template');

    // Create document fragment to minimize reflows
    const fragment = document.createDocumentFragment();

    requests.forEach(requests => {
        const clone = template.content.cloneNode(true);

        // Set the data attribute for UID
        const requestItem = clone.querySelector('.request-item');
        requestItem.setAttribute('data-uid', requests.uid); // Ensure request.uid is not null

        clone.querySelector('.request-name').textContent = requests.name;
        clone.querySelector('.request-email').textContent = requests.email;
        clone.querySelector('.request-phone').textContent = requests.phone;
        clone.querySelector('.request-business-name').textContent = requests.business_name;
        clone.querySelector('.request-age').textContent = requests.age;
        clone.querySelector('.request-user-type').textContent = requests.user_type;
        clone.querySelector('.request-offer').textContent = requests.offer;
        clone.querySelector('.request-address').textContent = requests.address;
        clone.querySelector('.request-req-date').textContent = requests.req_date;
        // clone.querySelector('.request-uid').textContent = requests.uid;

        fragment.appendChild(clone);
    });

    // Append the fragment to the container
    container.appendChild(fragment);
}

// Create Operation
async function makeRequest() {
    try {
        const docRef = await addDoc(collection(db, "request"), {
            name: "Soud haroon",
            email: "soudharoon@gmail.com",
            phone: 6722728422,
            business_name: "root cafe",
            age: 24,
            user_type: "ower",
            offer: "Hi, $20 per hour",
            address: "vancouver",
            req_date: Date(),
            response: "none",
        });
        const docID = docRef.id;

        await updateDoc(docRef, {
            uid: docID,
        });
        console.log("request created and id updated!");
        console.log("Document written with ID: ", docID);
    } catch (error) {
        console.error("Error adding document: ", error);
    }
}

async function bookingComfirmed(docID) {
    try {
        console.log("================" + docID);
        // Get a reference to the document
        const docReqRef = doc(db, "request", docID);

        // console.log('========------------===========');
        // Retrieve the document data
        const docSnap = await getDoc(docReqRef);

        // console.log('========------------===========');
        if (!docSnap.exists()) {
            console.error("No such document! ==========");
            return;
        }

        const docData = docSnap.data();

        // Ensure docData is not null or undefined
        if (!docData) {
            console.error("Document data is null or undefined!");
            return;
        }

        console.log('========------------===========');
        // Add the booking to the 'booking' collection
        const bookingCollectionRef = collection(db, "booking");
        const newBookingDocRef = await addDoc(bookingCollectionRef, {
            name: docData.name || "",
            email: docData.email || "",
            phone: docData.phone || "",
            business_name: docData.business_name || "",
            age: docData.age || "",
            user_type: docData.user_type || "",
            offer: docData.offer || "",
            address: docData.address || "",
            req_date: docData.req_date || "",
            response: "accept",
        });
        await updateDoc(newBookingDocRef, {
            uid: newBookingDocRef.id,
        });
        console.log("document accepted and created in db!");
    } catch (error) {
        console.log("error while accepting request:" + error);
    }
}


window.makeRequest = makeRequest;
window.bookingComfirmed = bookingComfirmed;

console.log('Firebase booking loaded!');


//  <p>Age: ${requests.age}</p>
//         <p>User Type: ${requests.user_type}</p>
//         <p>Offer: ${requests.offer}</p>
//         <p>Address: ${requests.address}</p>
//         <p>Request Date: ${requests.req_date}</p>



// Function to render a booking request in the UI
// function renderBookingRequest(request) {
//     const requestElement = document.createElement('div');
//     requestElement.classList.add('.request-item');
//     requestElement.innerHTML = `
//         <h2>${requests.name}</h2>
//         <p>Email: ${requests.email}</p>
//         <p>Phone: ${requests.phone}</p>
//         <p>Business Name: ${requests.business_name}</p>

//     `;
//     document.getElementById('request').appendChild(requestElement);
// }


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