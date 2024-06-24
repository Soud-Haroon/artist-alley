import {
    signupWithEmailAndPassword
} from './auth.js';

import {
    USER_TYPE_ARTIST,
    USER_TYPE_ORGANISER
} from '../js/app-constants.js';

import {
    saveUserDataInDb
} from '../js/firestore.js';

const statusBox = document.getElementById('status');

const submitBtn = document.getElementById('submitBtn');
submitBtn.addEventListener('click', async function (event) {
    event.preventDefault();
    try {
        statusBox.style.display = 'none';

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const confirmPass = document.getElementById("confirmPass").value;
        const userType = document.getElementById('userType').value;
        if (userType === '') {
            statusBox.innerHTML = 'Required fields missing!';
            statusBox.style.display = 'block';
        } else {
            if (password != '' && password === confirmPass) {
                let result = await signupWithEmailAndPassword(email, password)
                if (result) {
                    gotoHomepage(result.user, userType);
                } else {
                    alert("Oops, something went wrong!");
                }
            } else {
                statusBox.innerHTML = 'Required fields missing!';
                statusBox.style.display = 'block';
            }
        }
    } catch (error) {
        console.log(error);
        statusBox.innerHTML = error;
        statusBox.style.display = 'block';
    }
});

async function gotoHomepage(loggedInUser, userType) {
    let user = {
        uid: loggedInUser.uid,
        email: loggedInUser.email,
        userType: userType,
        isProfileComplete: false
    };
    // store this user info in appropriate userType table in db
    await saveUser(user);
    // store this user data in the local storage
    localStorage.setItem("user", JSON.stringify(user));
    // go to the homepage or any other appropriate page

    window.location.replace("user-info.html");
}

async function saveUser(user) {
    let location = '';
    if (user.userType == USER_TYPE_ARTIST) {
        location = 'artists';
    } else if (user.userType == USER_TYPE_ORGANISER) {
        location = 'organiser';
    }
    if (location) {
        await saveUserDataInDb(user);
    }
}