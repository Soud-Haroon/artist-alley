import {
    saveUserDataInDb,
    getUserDataById
} from './firestore.js';

import { uploadProfileImage, uploadPortfolioImages } from './firebase-storage.js';
import { loggedInUser, includeHeaderFooter, gotoMyAccount, logoutUser } from "./utilities.js";

const headerElement = document.querySelector('header');
const footerElement = document.querySelector('footer');
setupHeaderFooter();

const profilePic = document.getElementById('profile-pic');

setUserDataOnUI();

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('../sw.js')
        .then(registration => {
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
        })
        .catch(error => {
            console.error('ServiceWorker registration failed: ', error);
        });
} else {
console.log('Service worker is not in the navigator!');
}

async function setUserDataOnUI() {
    const user = await getUserDataById(loggedInUser.uid, loggedInUser.userType);
    if (user) {
        const summary = document.getElementById('summary');
        const pricing = document.getElementById('pricing');
        const category = document.getElementById('category');
        const location = document.getElementById('address');
        const editBtn = document.getElementById('editBtn');

        const gallery = document.querySelector('.images');

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

        editBtn.addEventListener('click', (event) => {
            event.preventDefault();

            window.location = "../html/edit-account-artist.html";
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
        const title = document.getElementById('title');
        const myProfileBtn = document.getElementById('myProfile');
        const logoutBtn = document.getElementById('logoutBtn');

        try {
            title.textContent = `${loggedInUser.fName} ${loggedInUser.lName}`
        } catch(error) {
            console.error(error);
        }
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