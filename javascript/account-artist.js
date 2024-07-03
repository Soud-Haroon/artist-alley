// import { dataUrlToFile, loggedInUser } from "./utilities.js";
// import { uploadProfileImage } from "./firebase-storage.js";

// const userAvatar = document.getElementById('profile-image');
// const userInfoDiv = document.getElementById('info');
// const portfolioImages = document.getElementById('portfolio-images');

// userAvatar.src = loggedInUser.profile_image;

// const userName = document.createElement('h2');
// userName.textContent = `${loggedInUser.fName} ${loggedInUser.lName} (${loggedInUser.stageName})`;
// userName.style.color = 'tomato';

// const genre = document.createElement('h2');
// genre.textContent = `My Speciality: ${loggedInUser.genre}`;

// const contact = document.createElement('h2');
// contact.textContent = `Contact Info: +1 ${loggedInUser.phone} -- ${loggedInUser.email}`;

// const summary = document.createElement('h2');
// summary.textContent = `${loggedInUser.summary}`;

// const video = document.getElementById('webcam');
// const canvas = document.getElementById('canvas');
// const captureButton = document.getElementById('capture');
// let stream;

// const saveImageDiv = document.getElementById('save-image');
// saveImageDiv.display = 'none';

// userInfoDiv.appendChild(userName);
// userInfoDiv.appendChild(genre);
// userInfoDiv.appendChild(contact);
// userInfoDiv.appendChild(summary);

// loggedInUser.portfolio_images.forEach(url => {
//     const image = document.createElement('img');
//     image.src = `${url}`;
//     image.id = "img-portfolio"
//     portfolioImages.appendChild(image);
// });

// // Access the webcam
// navigator.mediaDevices.getUserMedia({ video: true })
//     .then(mediaStream => {
//         stream = mediaStream;
//         video.srcObject = stream;
//     })
//     .catch(error => {
//         console.error('Error accessing the webcam:', error);
//     });

// // Capture the image
// captureButton.addEventListener('click', () => {
//     const context = canvas.getContext('2d');
//     context.drawImage(video, 0, 0, canvas.width, canvas.height);
//     const dataUrl = canvas.toDataURL('image/png');
//     uploadProfileImage(dataUrlToFile(dataUrl, 'profile'));
//     userAvatar.src = dataUrl;
//     // showImagePreview(dataUrl);

//     // Stop the webcam stream
//     stream.getTracks().forEach(track => track.stop());

//     // Hide the video element and display the canvas
//     video.style.display = 'none';
//     canvas.style.display = 'block';
//     captureButton.style.display = 'none';
//     saveImageDiv.style.display = 'block';
// });

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
    if(loggedInUser) {
        profilePic.src = loggedInUser.profile_image;
        stageName.value = loggedInUser.stageName;
        if(loggedInUser.genre) {
            for(let i = 0; i < genre.options.length; i++) {
                if(genre.options[i].value == loggedInUser.genre) {
                    genre.selectedIndex = i;
                }
            }
        }
        phone.value = loggedInUser.phone;
        website.value = loggedInUser.website;
        summary.value = loggedInUser.summary;

        imagePreviewDiv.innerHTML = '';
        loggedInUser.portfolio_images.forEach(imageUrl => {
            const img = document.createElement('img');
            img.src = imageUrl;
            imagePreviewDiv.appendChild(img);
        });
    }
}