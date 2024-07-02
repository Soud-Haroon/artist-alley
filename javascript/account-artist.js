import { dataUrlToFile, loggedInUser } from "./utilities.js";
import { uploadProfileImage } from "./firebase-storage.js";

const userAvatar = document.getElementById('profile-image');
const userInfoDiv = document.getElementById('info');
const portfolioImages = document.getElementById('portfolio-images');

userAvatar.src = loggedInUser.profile_image;

const userName = document.createElement('h2');
userName.textContent = `${loggedInUser.fName} ${loggedInUser.lName} (${loggedInUser.stageName})`;
userName.style.color = 'tomato';

const genre = document.createElement('h2');
genre.textContent = `My Speciality: ${loggedInUser.genre}`;

const contact = document.createElement('h2');
contact.textContent = `Contact Info: +1 ${loggedInUser.phone} -- ${loggedInUser.email}`;

const summary = document.createElement('h2');
summary.textContent = `${loggedInUser.summary}`;

const video = document.getElementById('webcam');
const canvas = document.getElementById('canvas');
const captureButton = document.getElementById('capture');
let stream;

const saveImageDiv = document.getElementById('save-image');
saveImageDiv.display = 'none';

userInfoDiv.appendChild(userName);
userInfoDiv.appendChild(genre);
userInfoDiv.appendChild(contact);
userInfoDiv.appendChild(summary);

loggedInUser.portfolio_images.forEach(url => {
    const image = document.createElement('img');
    image.src = `${url}`;
    image.id = "img-portfolio"
    portfolioImages.appendChild(image);
});

// Access the webcam
navigator.mediaDevices.getUserMedia({ video: true })
    .then(mediaStream => {
        stream = mediaStream;
        video.srcObject = stream;
    })
    .catch(error => {
        console.error('Error accessing the webcam:', error);
    });

// Capture the image
captureButton.addEventListener('click', () => {
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/png');
    uploadProfileImage(dataUrlToFile(dataUrl, 'profile'));
    userAvatar.src = dataUrl;
    // showImagePreview(dataUrl);

    // Stop the webcam stream
    stream.getTracks().forEach(track => track.stop());

    // Hide the video element and display the canvas
    video.style.display = 'none';
    canvas.style.display = 'block';
    captureButton.style.display = 'none';
    saveImageDiv.style.display = 'block';
});