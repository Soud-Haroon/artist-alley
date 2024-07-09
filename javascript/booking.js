import { STATUS_PENDING, STATUS_DECLINED, getStatus, STATUS_ACCEPTED } from './app-constants.js';
import { getBookingsFromDb, saveBookingInDb } from './firestore.js';
import { loggedInUser } from './utilities.js';

// import { bookingPendingTemplate } from '../templates/booking-cards-template.html'

let bookings = await getBookings();

const bookingsPendingContainer = document.getElementById('bookings-pending');
const bookingsAcceptedContainer = document.getElementById('bookings-accepted');


// let pendinBookings = [];
// let acceptedBookings = [];

bookings.forEach(booking => {
    if (booking.status === STATUS_PENDING) {
        // pendinBookings.push(booking);
        fetchAndUsePendingTemplate(booking);
    } else {
        // acceptedBookings.push(booking);
        fetchAndUseAcceptedTemplate(booking);
    }
});

async function getBookings() {
    return await getBookingsFromDb(loggedInUser.uid, loggedInUser.userType);
}

async function fetchAndUsePendingTemplate(pendingBooking) {
    const response = await fetch('../templates/booking-cards-template.html');
    const html = await response.text();

    // Create a temporary element to hold the HTML content
    const temp = document.createElement('div');
    temp.innerHTML = html;

    
    // Extract the template content
    const bookingPendingTemplate = temp.querySelector('#bookingPendingTemplate');
    const clone = document.importNode(bookingPendingTemplate.content, true);

    // const hostName = clone.querySelector('#host-name');
    const eventAddress = clone.querySelector('#event-address');
    const eventDate = clone.querySelector('#event-date');
    const requestOffer = clone.querySelector('#request-offer');
    const requestStatus = clone.querySelector('#request-status');

    const acceptBtn = clone.querySelector('#accept-request');
    const declineBtn = clone.querySelector('#decline-request');

    // hostName.innerHTML = pendingBooking.hostName;
    eventAddress.innerHTML = pendingBooking.event_address;
    eventDate.innerHTML = pendingBooking.event_date;
    requestOffer.textContent = pendingBooking.offer_price;
    requestStatus.textContent = getStatus(pendingBooking.status);

    acceptBtn.addEventListener('click', () => {
        pendingBooking.status = STATUS_ACCEPTED;
        updateBookingStatus(pendingBooking);
    });

    declineBtn.addEventListener('click', () => {
        pendingBooking.status = STATUS_DECLINED;
        updateBookingStatus(pendingBooking);
    });

    bookingsPendingContainer.appendChild(clone);
}

async function updateBookingStatus(pendingBooking) {
    await saveBookingInDb(pendingBooking);
    location.reload();
}

async function fetchAndUseAcceptedTemplate(acceptedBooking) {
    const response = await fetch('../templates/booking-cards-template.html');
    const html = await response.text();

    // Create a temporary element to hold the HTML content
    const temp = document.createElement('div');
    temp.innerHTML = html;

    // Extract the template content
    const bookingAcceptedTemplate = temp.querySelector('#bookingAcceptedTemplate');
    const clone = document.importNode(bookingAcceptedTemplate.content, true);

    // const hostName = clone.querySelector('#host-name');
    const eventAddress = clone.querySelector('#event-address');
    const eventDate = clone.querySelector('#event-date');
    const requestOffer = clone.querySelector('#request-offer');
    const requestStatus = clone.querySelector('#request-status');

    // hostName.innerHTML = pendingBooking.hostName;
    eventAddress.innerHTML = acceptedBooking.event_address;
    eventDate.innerHTML = acceptedBooking.event_date;
    requestOffer.textContent = acceptedBooking.offer_price;
    requestStatus.textContent = getStatus(acceptedBooking.status);

    bookingsAcceptedContainer.appendChild(clone);
}
