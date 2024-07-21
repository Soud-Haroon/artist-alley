import {
    getUserDataById,
    saveBookingInDb
} from './firestore.js';

import { loggedInUser, includeHeaderFooter, gotoMyAccount, logoutUser } from "./utilities.js";
import { USER_TYPE_ARTIST, STATUS_PENDING } from './app-constants.js';

const headerElement = document.querySelector('header');
const footerElement = document.querySelector('footer');
setupHeaderFooter();

const params = new URLSearchParams(window.location.search);
const artist_id = params.get('artist_id');

if (artist_id) {
    setUserDataOnUI(artist_id);
}

async function setUserDataOnUI(artist_id) {
    const user = await getUserDataById(artist_id, USER_TYPE_ARTIST);
    console.log("Artist Data arrived: " + user.fName)
    if (user) {
        const profilePic = document.getElementById('profile-pic');
        const summary = document.getElementById('summary');
        const pricing = document.getElementById('pricing');
        const category = document.getElementById('category');
        const location = document.getElementById('address');

        const bookBtn = document.getElementById('bookBtn');
        const chatBtn = document.getElementById('chatBtn');
        const ctaDiv = document.getElementById('ctaDiv');

        const closeBookPopupButton = document.getElementById('close-popup-book');
        const bookPopupContainer = document.getElementById('popup-container-book');

        const successPopupContainer = document.getElementById('popup-container-success');
        const closeSuccessPopupButton = document.getElementById('close-popup-success');

        const eventAddress = document.getElementById('address');
        const eventDate = document.getElementById('date');
        const offerPrice = document.getElementById('offer');



        const makeOfferBtn = document.getElementById('makeOfferBtn');

        const gallery = document.querySelector('.images');
        if (loggedInUser.userType == USER_TYPE_ARTIST) {
            ctaDiv.style.display = 'none';
        } else {
            ctaDiv.style.display = 'grid';
        }
        if (user.profile_image) {
            profilePic.src = user.profile_image;
        }
        if (user.summary) {
            summary.textContent = user.summary
        }

        if (user.pricing) {
            pricing.textContent = user.pricing;
        }

        if (user.category) {
            category.textContent = user.category;
        }

        if (user.location) {
            location.textContent = user.location;
        }
        if (user.portfolio_images) {
            gallery.innerHTML = '';
            user.portfolio_images.forEach(link => {
                let img = document.createElement('img');
                img.src = link
                gallery.appendChild(img);
            });
        }

        bookBtn.addEventListener('click', (event) => {
            event.preventDefault();
            bookPopupContainer.style.display = 'block';
        })

        closeBookPopupButton.addEventListener('click', (event) => {
            event.preventDefault();
            bookPopupContainer.style.display = 'none';
        })

        closeSuccessPopupButton.addEventListener('click', (event) => {
            event.preventDefault();
            successPopupContainer.style.display = 'none';
            window.location = '../html/bookings.html';

        })

        chatBtn.addEventListener('click', (event) => {
            event.preventDefault();

            window.location = `../html/chat.html?artist_id=${user.uid}`;
        })

        makeOfferBtn.addEventListener('click', (event) => {
            event.preventDefault();
            try {
                let booking = {
                    booking_id: loggedInUser.uid + user.uid,
                    host_id: loggedInUser.uid,
                    host_name: loggedInUser.fName,
                    artist_id: user.uid,
                    artist_name: user.fName,
                    event_address: eventAddress.value,
                    event_date: eventDate.value,
                    offer_price: offerPrice.value,
                    status: STATUS_PENDING
                }
                makeAnOffer(booking, bookPopupContainer, successPopupContainer);
            } catch (error) {
                console.log("on send offer click: " + error);
                alert('Oops, something went wrong!');
            }
        })
    }
}

async function makeAnOffer(booking, bookPopupContainer, successPopupContainer) {
    const isRequestSent = await saveBookingInDb(booking);
    if (isRequestSent) {
        bookPopupContainer.style.display = 'none';
        successPopupContainer.style.display = 'block'
    } else {
        alert('Oops! Something went wrong.')
    }
}

// HEADER & FOOTER DATA =========================================================================================

function setupHeaderFooter() {
    includeHeaderFooter(setHeader, setFooter);
}

function setHeader(data) {
    if (headerElement) {
        headerElement.innerHTML = data;
        const title = document.getElementById('title');
        const myProfileBtn = document.getElementById('myProfile');
        const logoutBtn = document.getElementById('logoutBtn');

        title.textContent = 'Artist Profile';
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