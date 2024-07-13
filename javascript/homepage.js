
import {
    getUserDataById
} from '../javascript/firestore.js';

import { loggedInUser, includeHeaderFooter, gotoMyAccount, logoutUser } from "./utilities.js";

let userData = await getUserData(loggedInUser.uid, loggedInUser.userType);
localStorage.setItem("user", JSON.stringify(userData));

const headerElement = document.querySelector('header');
const footerElement = document.querySelector('footer');

includeHeaderFooter(setHeader, setFooter);

async function getUserData(userId, userType) {
    return await getUserDataById(userId, userType);
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
