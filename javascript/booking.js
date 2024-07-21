import { STATUS_PENDING, STATUS_DECLINED, getStatus, STATUS_ACCEPTED, USER_TYPE_ARTIST } from './app-constants.js';
import { getBookingsFromDb, saveBookingInDb } from './firestore.js';
import { loggedInUser, includeHeaderFooter, gotoMyAccount, logoutUser } from "./utilities.js";

// import { bookingPendingTemplate } from '../templates/booking-cards-template.html'


const headerElement = document.querySelector('header');
const footerElement = document.querySelector('footer');

setupHeaderFooter();

let bookings = await getBookings();

const bookingsPendingContainer = document.getElementById('bookings-pending');
const bookingsAcceptedContainer = document.getElementById('bookings-accepted');

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
    let bookingPendingTemplate;
    let clone;
    if (loggedInUser.userType == USER_TYPE_ARTIST) {
        bookingPendingTemplate = temp.querySelector('#bookingPendingTemplateArtist');
        clone = document.importNode(bookingPendingTemplate.content, true);

        const acceptBtn = clone.querySelector('#accept-request');
        const declineBtn = clone.querySelector('#decline-request');
        acceptBtn.addEventListener('click', () => {
            pendingBooking.status = STATUS_ACCEPTED;
            updateBookingStatus(pendingBooking);
        });

        declineBtn.addEventListener('click', () => {
            pendingBooking.status = STATUS_DECLINED;
            updateBookingStatus(pendingBooking);
        });
    } else {
        bookingPendingTemplate = temp.querySelector('#bookingPendingTemplateOrganiser');
        clone = document.importNode(bookingPendingTemplate.content, true);
    }

    const hostName = clone.querySelector('#host-name');
    const eventAddress = clone.querySelector('#event-address');
    const eventDate = clone.querySelector('#event-date');
    const requestOffer = clone.querySelector('#request-offer');
    const requestStatus = clone.querySelector('#request-status');

    if(pendingBooking.host_name) {
        hostName.innerHTML = pendingBooking.host_name;
    }
    eventAddress.innerHTML = pendingBooking.event_address;
    eventDate.innerHTML = pendingBooking.event_date;
    requestOffer.textContent = pendingBooking.offer_price;
    requestStatus.textContent = getStatus(pendingBooking.status);

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

    const hostName = clone.querySelector('#host-name');
    const eventAddress = clone.querySelector('#event-address');
    const eventDate = clone.querySelector('#event-date');
    const requestOffer = clone.querySelector('#request-offer');
    const requestStatus = clone.querySelector('#request-status');

    if(acceptedBooking.host_name) {
        hostName.innerHTML = acceptedBooking.host_name;
    }
    eventAddress.innerHTML = acceptedBooking.event_address;
    eventDate.innerHTML = acceptedBooking.event_date;
    requestOffer.textContent = acceptedBooking.offer_price;
    requestStatus.textContent = getStatus(acceptedBooking.status);

    bookingsAcceptedContainer.appendChild(clone);
}

function setupHeaderFooter() {
    includeHeaderFooter(setHeader, setFooter);
}

function setHeader(data) {
    if (headerElement) {
        headerElement.innerHTML = data;
        const title = document.getElementById('title');
        const myProfileBtn = document.getElementById('myProfile');
        const logoutBtn = document.getElementById('logoutBtn');

        title.textContent = 'Bookings'
        myProfileBtn.addEventListener('click', (event) => {
            event.preventDefault();
            gotoMyAccount();
        })

        logoutBtn.addEventListener('click', (event) => {
            event.preventDefault();
            logoutUser();
        })
    }
}

function setFooter(data) {
    if (footerElement) {
        footerElement.innerHTML = data;
    }
}