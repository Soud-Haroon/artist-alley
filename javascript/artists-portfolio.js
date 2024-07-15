import {
    getUserDataById,
    saveBookingInDb
} from '../javascript/firestore.js';

import { loggedInUser, includeHeaderFooter, gotoMyAccount } from './utilities.js';

import { USER_TYPE_ARTIST, STATUS_PENDING } from './app-constants.js';

const headerElement = document.querySelector('header');
const footerElement = document.querySelector('footer');

setupHeaderFooter();

// const cameraDiv = document.getElementById('camera');
// cameraDiv.style.display = 'none';


const params = new URLSearchParams(window.location.search);
const artist_id = params.get('artist_id');
console.log('Artist id: '+artist_id)
let artist_data = await getArtistData(artist_id, USER_TYPE_ARTIST);


const userAvatar = document.getElementById('profile-pic');
const name = document.getElementById('name');
const stageName = document.getElementById('stage-name');
const genre = document.getElementById('genre');
const phone = document.getElementById('phone');
const website = document.getElementById('website');
const summary = document.getElementById('summary');

const address = document.getElementById('address');
const date = document.getElementById('date');
const offerPrice = document.getElementById('offer');

const makeOfferBtn = document.getElementById('makeOfferBtn');
const chatBtn = document.getElementById('chatBtn');

setUserDataOnUI(artist_data);


makeOfferBtn.addEventListener('click', (event) => {
    event.preventDefault();
    console.log("====================");
    try {
        let booking = {
            booking_id: loggedInUser.uid+artist_data.uid,
            host_id: loggedInUser.uid,
            artist_id: artist_data.uid,
            artist_name: artist_data.fName,
            event_address: address.value,
            event_date: date.value,
            offer_price: offerPrice.value,
            status: STATUS_PENDING
        }
        makeAnOffer(booking);
    } catch (error) {
        console.log("on send offer click: " + error);
    }

})

chatBtn.addEventListener('click', (event) => {
    event.preventDefault();
    let url = `../html/demo_chat.html?artist_id=${artist_id}`;
    window.location = url;

})

async function getArtistData(userId, userType) {
    return await getUserDataById(userId, userType);
}

async function makeAnOffer(booking) {
    return await saveBookingInDb(booking);
}

function setUserDataOnUI(artist) {
    if (artist) {
        if (artist.profile_image) {
            userAvatar.src = artist.profile_image;
        }
        if (artist.fName) {
            name.textContent = artist.fName;
        }
        if (artist.stageName) {
            stageName.textContent = artist.stageName;
        }
        if (artist.genre) {
            genre.textContent = artist.genre;
        }
        if (artist.phone) {
            phone.textContent = artist.phone;
        }
        if (artist.website) {
            website.textContent = artist.website;
        }
        if (artist.summary) {
            summary.textContent = artist.summary;
        }
    }
}


// HEADER AND FOOTER ===========================================
function setupHeaderFooter() {
    includeHeaderFooter(setHeader, setFooter);
}

function setHeader(data) {
    if (headerElement) {
        headerElement.innerHTML = data;
        const myProfileBtn = document.getElementById('myProfile');
        const logoutBtn = document.getElementById('logoutBtn');

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