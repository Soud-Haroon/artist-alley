import {
    logout
} from "./firebase-auth.js";

import {
    getUserDataById
} from '../js/firestore.js';

import { loggedInUser } from "./utilities.js";

const logoutBtn = document.getElementById('logoutBtn');
const portfolioBtn = document.getElementById('portfolioBtn');
const userDiv = document.getElementById('user');

let userData = await getUserData(loggedInUser.uid, loggedInUser.userType);
localStorage.setItem("user", JSON.stringify(userData));

userDiv.innerHTML = `${userData.fName} ${userData.lName}`;

console.log("USER DATA: "+JSON.stringify(userData));
logoutBtn.addEventListener('click', async function(event) {
    event.preventDefault();

    logoutUser();
});

portfolioBtn.addEventListener('click', async function(event) {
    event.preventDefault();

    window.location = './my-portfolio.html';
});

async function getUserData(userId, userType) {
    return await getUserDataById(userId, userType);
}

function logoutUser() {
    logout(() => {
        console.log("logout successful");
        window.location.replace('../index.html');
    });
}
