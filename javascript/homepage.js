
import {
    getUserDataById
} from '../javascript/firestore.js';

import { loggedInUser } from "./utilities.js";

let userData = await getUserData(loggedInUser.uid, loggedInUser.userType);
localStorage.setItem("user", JSON.stringify(userData));

console.log("USER DATA: " + JSON.stringify(userData));

async function getUserData(userId, userType) {
    return await getUserDataById(userId, userType);
}

