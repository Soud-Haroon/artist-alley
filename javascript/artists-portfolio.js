import {
    getUserDataById
} from '../javascript/firestore.js';

import { USER_TYPE_ARTIST } from './app-constants.js';

import { sendOffer } from './search.js';

const params = new URLSearchParams(window.location.search);
const uid = params.get('artist_id');
let userData = await getUserData(uid, USER_TYPE_ARTIST);


const userAvatar = document.getElementById('profile-pic');
const name = document.getElementById('name');
const stageName = document.getElementById('stage-name');
const genre = document.getElementById('genre');
const phone = document.getElementById('phone');
const website = document.getElementById('website');
const summary = document.getElementById('summary');

const address = document.getElementById('address').value;
const date = document.getElementById('date').value;
const offerPrice = document.getElementById('offer').value;

const saveBtn = document.getElementById('saveBtn');
const chatBtn = document.getElementById('chatBtn');


saveBtn.addEventListener('click', (event) => {
    event.preventDefault();

    try {
        console.log(`art id : ` + uid);
        console.log(`address : ` + address);
        console.log(`date : ` + date);
        console.log(`offer : ` + offerPrice);
        // sendOffer(uid, address, date, offerPrice);
    } catch (error) {
        console.log("on send offer click: " + error);
    }

})

chatBtn.addEventListener('click', (event) => {
    event.preventDefault();

})


setUserDataOnUI(userData);




async function getUserData(userId, userType) {
    return await getUserDataById(userId, userType);
}

function setUserDataOnUI(user) {
    if (user) {
        if (user.profile_image) {
            userAvatar.src = user.profile_image;
        }
        if (user.fName) {
            name.textContent = user.fName;
        }
        if (user.stageName) {
            stageName.textContent = user.stageName;
        }
        if (user.genre) {
            genre.textContent = user.genre;
        }
        if (user.phone) {
            phone.textContent = user.phone;
        }
        if (user.website) {
            website.textContent = user.website;
        }
        if (user.summary) {
            summary.textContent = user.summary;
        }
    }
}
