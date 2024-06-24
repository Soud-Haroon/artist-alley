import {
    logout
} from "./auth.js";

import {
    getUserDataById
} from '../js/firestore.js';


const logoutBtn = document.getElementById('logoutBtn');
const userDiv = document.getElementById('user');

const loggedInUser = JSON.parse(localStorage.getItem("user"));
userDiv.innerHTML = loggedInUser.email;

let userData = await getUserData(loggedInUser.uid, loggedInUser.userType);
localStorage.setItem("user", JSON.stringify(userData));

console.log("USER DATA: "+JSON.stringify(loggedInUser));
logoutBtn.addEventListener('click', async function(event) {
    event.preventDefault();

    logoutUser();
})

async function getUserData(userId, userType) {
    return await getUserDataById(userId, userType);
}

function logoutUser() {
    logout(() => {
        console.log("logout successful");
        window.location.replace('../index.html');
    })
}