import {
    saveUserDataInDb
} from '../js/firestore.js';

const saveBtn = document.getElementById('saveBtn');

saveBtn.addEventListener('click', function (event) {
    event.preventDefault();

    const stageName = document.getElementById('stage-name').value;
    const genre = document.getElementById('genre').value;
    const phone = document.getElementById('phone').value;
    const website = document.getElementById('website').value;
    const summary = document.getElementById('summary').value;

    // TODO: save this data to the firestore and localStorage
    const loggedInUser = JSON.parse(localStorage.getItem("user"));
    loggedInUser.stageName = stageName;
    loggedInUser.genre = genre;
    loggedInUser.phone = phone;
    loggedInUser.website = website;
    loggedInUser.summary = summary;

    updateUserData(loggedInUser);
});

async function updateUserData(user) {
    await saveUserDataInDb(user);
    window.location.replace("homepage.html");
}

document.getElementById('captureBtn').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('profile-pic').src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});