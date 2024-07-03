import {
    saveUserDataInDb
} from './firestore.js';

import { uploadProfileImage, uploadPortfolioImages } from './firebase-storage.js';
import { loggedInUser } from "./utilities.js";


const imageInput = document.getElementById('imageInput');
const uploadImageBtn = document.getElementById('uploadImageBtn');

const portfolioImageInput = document.getElementById('portfolioImageInput');
const uploadPortfolioImageBtn = document.getElementById('uploadPortfolioImageBtn');

const profilePic = document.getElementById('profile-pic');
const stageName = document.getElementById('stage-name');
const genre = document.getElementById('genre');
const phone = document.getElementById('phone');
const website = document.getElementById('website');
const summary = document.getElementById('summary');
const imagePreviewDiv = document.getElementById('portfolio-images');
const saveBtn = document.getElementById('saveBtn');

console.log('setting userdata on UI')
setUserDataOnUI();

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
            profilePic.src = e.target.result;
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
uploadPortfolioImageBtn.addEventListener('click', function (event) {
    event.preventDefault();
    const files = portfolioImageInput.files;
    if (files.length > 0) {
        try {
            uploadPortfolioImages(files);
        } catch (error) {
            console.error(error);
        }
    } else {
        alert('No files selected!');
    }
})

// Save the user input data
saveBtn.addEventListener('click', function (event) {
    event.preventDefault();

    loggedInUser.stageName = stageName.value;
    loggedInUser.genre = genre.value;
    loggedInUser.phone = phone.value;
    loggedInUser.website = website.value;
    loggedInUser.summary = summary.value;

    updateUserData(loggedInUser);
});


function setUserDataOnUI() {
    if (loggedInUser) {
        if (loggedInUser.profile_image) {
            profilePic.src = loggedInUser.profile_image;
        }
        if (loggedInUser.stageName) {
            stageName.value = loggedInUser.stageName;
        }
        if (loggedInUser.genre) {
            for (let i = 0; i < genre.options.length; i++) {
                if (genre.options[i].value == loggedInUser.genre) {
                    genre.selectedIndex = i;
                }
            }
        }
        if (loggedInUser.phone) {
            phone.value = loggedInUser.phone;
        }
        if (loggedInUser.website) {
            website.value = loggedInUser.website;
        }
        if (loggedInUser.summary) {
            summary.value = loggedInUser.summary;
        }
        if (loggedInUser.portfolio_images) {
            imagePreviewDiv.innerHTML = '';
            loggedInUser.portfolio_images.forEach(imageUrl => {
                const img = document.createElement('img');
                img.src = imageUrl;
                imagePreviewDiv.appendChild(img);
            });
        }
    }
}