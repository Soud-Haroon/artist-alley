import { loggedInUser, logoutUser } from "./utilities.js";

const logoutBtn = document.getElementById('logoutBtn');

logoutBtn.addEventListener('click', async function (event) {
    event.preventDefault();

    logoutUser();
});
