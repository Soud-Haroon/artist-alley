import { db } from '../app.js';
import { collection, addDoc, getDocs, getDoc, updateDoc, deleteDoc, doc } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';
import { query, where, onSnapshot } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
// by soud
const currentUser = JSON.parse(localStorage.getItem("user"));
let unsubscribe;

// Define a model for your booking requests (optional)
// class BookingRequest {
//     constructor(name, email, phone, business_name, age, user_type, offer, address, req_date, response, uid, artist_id) {
//         this.name = name;
//         this.email = email;
//         this.phone = phone;
//         this.business_name = business_name;
//         this.age = age;
//         this.user_type = user_type;
//         this.offer = offer;
//         this.address = address;
//         this.req_date = req_date;
//         this.response = response;
//         this.uid = uid;
//         this.artist_id = artist_id;
//     }
// }
class BookingRequest {
    constructor(uid, name, email, phone, artist_id, host_id, business_name, offer, address, req_date, response) {
        this.uid = uid;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.artist_id = artist_id;
        this.host_id = host_id;
        this.business_name = business_name;
        this.offer = offer;
        this.address = address;
        this.req_date = req_date;
        this.response = response;
    }
}

// Load templates from a separate HTML file
async function loadTemplates() {
    const response = await fetch('../templates/booking-cards-template.html');
    const text = await response.text();
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = text;
    document.body.appendChild(tempDiv);
}

// ====================Start==========================//
// Fetch and listen for data changes
function listenToRequests() {
    const q = query(collection(db, "request"));
    unsubscribe = onSnapshot(q, (querySnapshot) => {
        const requests = [];
        querySnapshot.forEach((doc) => {
            const requestData = doc.data();
            if (currentUser.uid === requestData.uid) {
                if (requestData.response != "decline") {
                    const myUser = new BookingRequest(
                        requestData.uid,
                        requestData.name,
                        requestData.email,
                        requestData.phone,
                        requestData.artist_id,
                        requestData.host_id,
                        requestData.business_name,
                        requestData.offer,
                        requestData.address,
                        requestData.req_date,
                        requestData.response,
                    );
                    requests.push(myUser);
                }
            }
        });

        // Clear previous content in #request
        document.getElementById('request-view').innerHTML = '';
        renderBookingRequest(requests);
        console.log("Current request in database: ", requests);
    });
}

// Function to generate HTML for all booking requests and update the UI
function renderBookingRequest(requests) {
    // Get the template content
    const template = document.getElementById('request-template');
    const container = document.getElementById('request-view');

    // Clear the container
    container.innerHTML = '';

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
        clone.querySelector('.request-offer').textContent = requests.offer;
        clone.querySelector('.request-address').textContent = requests.address;

        fragment.appendChild(clone);
    });

    // Append the fragment to the container
    container.appendChild(fragment);
}
//---------------------End---------------------------//

// =====================Start=========================//
// Function to fetch and listen to the `booking` collection
function listenToBookings() {
    const q = query(collection(db, "booking"));
    unsubscribe = onSnapshot(q, (querySnapshot) => {
        const bookings = [];
        querySnapshot.forEach((doc) => {
            const bookingtData = doc.data();
            if (bookingtData.response == "accept") {
                const bookUser = new BookingRequest(
                    bookingtData.uid,
                    bookingtData.name,
                    bookingtData.email,
                    bookingtData.phone,
                    bookingtData.artist_id,
                    bookingtData.host_id,
                    bookingtData.business_name,
                    bookingtData.offer,
                    bookingtData.address,
                    bookingtData.req_date,
                    bookingtData.response,
                );
                bookings.push(bookUser);
            }
        });

        // Clear previous content in #request
        document.getElementById('booking-view').innerHTML = '';
        renderBookingList(bookings);
        console.log("Current booking in database: ", bookings);
    });
}

// Render a single booking item
function renderBookingList(bookings) {
    const template = document.getElementById('booking-template');
    const bookingView = document.getElementById('booking-view');

    // Clear the container
    bookingView.innerHTML = '';

    // Create document fragment to minimize reflows
    const fragment = document.createDocumentFragment();


    bookings.forEach(bookings => {
        const clone = template.content.cloneNode(true);
        const bookingItem = clone.querySelector('.booking-item');
        bookingItem.setAttribute('data-uid', bookings.uid);
        clone.querySelector('.booking-name').textContent = bookings.name;
        clone.querySelector('.booking-email').textContent = bookings.email;
        clone.querySelector('.booking-phone').textContent = bookings.phone;
        clone.querySelector('.booking-business-name').textContent = bookings.business_name;
        clone.querySelector('.booking-offer').textContent = bookings.offer;
        clone.querySelector('.booking-address').textContent = bookings.address;
        // clone.querySelector('.booking-req-date').textContent = bookings.req_date;
        clone.querySelector('.booking-response').textContent = bookings.response;

        fragment.appendChild(clone);
    });

    bookingView.appendChild(fragment);
}
// ---------------------End--------------------------//

// ================================ || ================================ //
// Making an demo request ===========//
async function makeRequest() {
    try {
        const docRef = await addDoc(collection(db, "request"), {
            name: "Soud haroon",
            email: "soudharoon@gmail.com",
            artist_id: 224277,
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


// function to accept Booking request ============ //
async function bookingAccepted(docID) {
    try {
        // Get a reference to the document
        const docReqRef = doc(db, "request", docID);
        // Retrieve the document data
        const docSnap = await getDoc(docReqRef);
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

        await deleteBooking(docID);
        console.log("document accepted and created in db!");
    } catch (error) {
        console.log("error while accepting request:" + error);
    }
}

// function to decline Booking request ============ //
async function bookingDeclined(docID) {
    try {
        const bookingRef = doc(db, 'request', docID);
        // Update the document
        await updateDoc(bookingRef, {
            'response': 'decline',
        });
        console.log('Document successfully updated!');
    } catch (error) {
        console.error('Error updating document: ', error);
    }
}

// function to delete an document =============//
async function deleteBooking(docID) {
    try {
        // Reference to the document to delete
        const bookingRef = doc(db, "request", docID);
        // Delete the document
        await deleteDoc(bookingRef);
        console.log("Document successfully deleted!");
    } catch (error) {
        console.error("Error deleting document: ", error);
    }
}

// Load templates and then start listening to Firestore collections
loadTemplates().then(() => {
    listenToRequests();
    listenToBookings();
});


// unsubscribeListener();

window.makeRequest = makeRequest;
window.bookingComfirmed = bookingAccepted;
window.bookingDeclined = bookingDeclined;


console.log('Firebase booking loaded!');
