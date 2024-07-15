import {
    saveUserDataInDb,
    getUserDataById
} from './firestore.js';

import { uploadProfileImage, uploadPortfolioImages } from './firebase-storage.js';
import { loggedInUser, includeHeaderFooter, gotoMyAccount, logoutUser } from "./utilities.js";
import { USER_TYPE_ARTIST } from './app-constants.js';

const headerElement = document.querySelector('header');
const footerElement = document.querySelector('footer');
setupHeaderFooter();

const params = new URLSearchParams(window.location.search);
const artist_id = params.get('artist_id');

if(artist_id) {
    setUserDataOnUI(artist_id);
}

async function setUserDataOnUI(artist_id) {
    const user = await getUserDataById(artist_id, USER_TYPE_ARTIST);
    console.log("Artist Data arrived: "+user.fName)
    if (user) {
        const profilePic = document.getElementById('profile-pic');
        const summary = document.getElementById('summary');
        const pricing = document.getElementById('pricing');
        const category = document.getElementById('category');
        const location = document.getElementById('address');

        const bookBtn = document.getElementById('bookBtn');
        const chatBtn = document.getElementById('chatBtn');
        const ctaDiv = document.getElementById('ctaDiv');

        const gallery = document.querySelector('.images');
        if(loggedInUser.userType == USER_TYPE_ARTIST) {
            ctaDiv.style.display = 'none';
        } else {
            ctaDiv.style.display = 'inline';
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

            window.location = "../html/edit-account-artist.html";
        })

        chatBtn.addEventListener('click', (event) => {
            event.preventDefault();

            window.location = `../html/chat.html?artist_id=${user.uid}`;
        })
    }
}

// HEADER & FOOTER DATA =========================================================================================

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