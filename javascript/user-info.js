import {
    saveUserDataInDb
} from '../javascript/firestore.js';

import { uploadProfileImage, uploadPortfolioImages } from './firebase-storage.js';
import { loggedInUser } from "../javascript/utilities.js";


const imageInput = document.getElementById('imageInput');
const uploadImageBtn = document.getElementById('uploadImageBtn');

const portfolioImageInput = document.getElementById('portfolioImageInput');
const uploadPortfolioImageBtn = document.getElementById('uploadPortfolioImageBtn');

const saveBtn = document.getElementById('saveBtn');

async function updateUserData(user) {
    await saveUserDataInDb(user);
    window.location.replace("homepage.html");
}

// preview the selected profile picture of the user
imageInput.addEventListener('change', function (event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            document.getElementById('profile-pic').src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});

// upload the profile picture of the user
uploadImageBtn.addEventListener('click', function (event) {
    event.preventDefault();
    const file = imageInput.files[0];
    if (file) {
        try {
            uploadProfileImage(file);
        } catch (error) {
            console.error(error);
        }
    } else {
        alert('No image selected!');
    }
})

// preview the portfolio selected images of the user
portfolioImageInput.addEventListener('change', function (event) {
    event.preventDefault();
    const files = event.target.files;
    const imagePreviewDiv = document.getElementById('portfolio-images');
    imagePreviewDiv.innerHTML = ''; // Clear previous images

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();

        reader.onload = function (e) {
            const img = document.createElement('img');
            img.src = e.target.result;
            imagePreviewDiv.appendChild(img);
        };

        reader.readAsDataURL(file);
    }
});

// upload the portfolio images of the user
uploadPortfolioImageBtn.addEventListener('click', function(event) {
    event.preventDefault();
    const files = portfolioImageInput.files;
    if(files.length > 0) {
        try {
            uploadPortfolioImages(files);
        } catch(error) {
            console.error(error);
        }
    } else {
        alert('No files selected!');
    }
})

// Save the user input data
saveBtn.addEventListener('click', function (event) {
    event.preventDefault();

    const stageName = document.getElementById('stage-name').value;
    const genre = document.getElementById('genre').value;
    const phone = document.getElementById('phone').value;
    const website = document.getElementById('website').value;
    const summary = document.getElementById('summary').value;

    loggedInUser.stageName = stageName;
    loggedInUser.genre = genre;
    loggedInUser.phone = phone;
    loggedInUser.website = website;
    loggedInUser.summary = summary;

    updateUserData(loggedInUser);
});