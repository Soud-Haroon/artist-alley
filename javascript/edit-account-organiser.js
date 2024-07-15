import { dataUrlToFile, loggedInUser, gotoMyAccount, includeHeaderFooter } from "./utilities.js";
import { uploadProfileImage } from "./firebase-storage.js";
import { saveUserDataInDb } from "./firestore.js";

const headerElement = document.querySelector('header');
const footerElement = document.querySelector('footer');

setupHeaderFooter();

const cameraDiv = document.getElementById('camera');
cameraDiv.style.display = 'none';

const startCameraBtn = document.getElementById('start-camera');

const userAvatar = document.getElementById('profile-image');
const firstName = document.getElementById('fName');
const lastName = document.getElementById('lName');
const orgName = document.getElementById('orgName');
const role = document.getElementById('role');
const phone = document.getElementById('phone');
const address = document.getElementById('address');
const summary = document.getElementById('summary');

const saveBtn = document.getElementById('saveBtn');

const video = document.getElementById('webcam');
const canvas = document.getElementById('canvas');
const captureButton = document.getElementById('capture');
let stream;

setUserDataOnUI();

// Capture the image
captureButton.addEventListener('click', () => {
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/png');
    uploadProfileImage(dataUrlToFile(dataUrl, 'profile'));
    userAvatar.src = dataUrl;

    stopCamera();
});

startCameraBtn.addEventListener('click', () => {
    startCamera();
});

saveBtn.addEventListener('click', (event) => {
    event.preventDefault();
    loggedInUser.fName = firstName.value;
    loggedInUser.lName = lastName.value;
    loggedInUser.org_name = orgName.value;
    loggedInUser.role = role.value;
    loggedInUser.phone = phone.value;
    loggedInUser.address = address.value;
    loggedInUser.summary = summary.value;

    updateUserData(loggedInUser);
});

async function updateUserData(user) {
    await saveUserDataInDb(user);
    window.location.replace("account-organiser.html");
}

function startCamera() {
    cameraDiv.style.display = 'block';
    video.style.display = 'block';
    captureButton.style.display = 'block';
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(mediaStream => {
            stream = mediaStream;
            video.srcObject = stream;
        })
        .catch(error => {
            console.error('Error accessing the webcam:', error);
        });
}

function stopCamera() {
    // Stop the webcam stream
    stream.getTracks().forEach(track => track.stop());

    // Hide the video element and display the canvas
    video.style.display = 'none';
    canvas.style.display = 'none';
    captureButton.style.display = 'none';
    cameraDiv.style.display = 'none';
    stream = null;

}

function setUserDataOnUI() {
    if (loggedInUser) {
        if(loggedInUser.profile_image) {
            userAvatar.src = loggedInUser.profile_image;
        }
        if(loggedInUser.fName) {
            firstName.value = loggedInUser.fName;
        }
        if(loggedInUser.lName) {
            lastName.value = loggedInUser.lName;
        }
        if(loggedInUser.org_name) {
            orgName.value = loggedInUser.org_name;
        }
        if(loggedInUser.role) {
            role.value = loggedInUser.role;
        }
        if(loggedInUser.phone) {
            phone.value = loggedInUser.phone;
        }
        if(loggedInUser.address) {
            address.value = loggedInUser.address;
        }
        if(loggedInUser.summary) {
            summary.value = `${loggedInUser.summary}`;
        }
    }
}

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