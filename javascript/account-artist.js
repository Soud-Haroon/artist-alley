import {
    saveUserDataInDb,
    getUserDataById
} from './firestore.js';

import { uploadProfileImage, uploadPortfolioImages } from './firebase-storage.js';
import { loggedInUser, includeHeaderFooter, gotoMyAccount, logoutUser } from "./utilities.js";

const headerElement = document.querySelector('header');
const footerElement = document.querySelector('footer');
setupHeaderFooter();

const profilePic = document.getElementById('profile-pic');

setUserDataOnUI();

async function setUserDataOnUI() {
    const user = await getUserDataById(loggedInUser.uid, loggedInUser.userType);
    if(user) {
        const summary = document.getElementById('summary');
    const pricing = document.getElementById('pricing');
    const category = document.getElementById('category');
    const location = document.getElementById('address');
    const editBtn = document.getElementById('editBtn');

    const gallery = document.querySelector('.images');

    if(user.profile_image) {
        profilePic.src = user.profile_image;
    }
    if(user.summary) {
        summary.textContent = user.summary
    }

    if(user.pricing) {
        pricing.textContent = user.pricing;
    }

    if(user.category) {
        category.textContent = user.category;
    }

    if(user.location) {
        location.textContent = user.location;
    }
    if(user.portfolio_images) {
        gallery.innerHTML = '';
        user.portfolio_images.forEach(link => {
            let img = document.createElement('img');
            img.src = link
            gallery.appendChild(img);
        });
    }

    editBtn.addEventListener('click', (event)=> {
        event.preventDefault();

        window.location = "../html/edit-account-artist.html";
    })
    }
}

// HEADER & FOOTER DATA =========================================================================================

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

// const imageInput = document.getElementById('imageInput');
// const uploadImageBtn = document.getElementById('uploadImageBtn');

// const portfolioImageInput = document.getElementById('portfolioImageInput');
// const uploadPortfolioImageBtn = document.getElementById('uploadPortfolioImageBtn');

// const stageName = document.getElementById('stage-name');
// const genre = document.getElementById('genre');
// const phone = document.getElementById('phone');
// const website = document.getElementById('website');
// const summary = document.getElementById('summary');
// const imagePreviewDiv = document.getElementById('portfolio-images');
// const saveBtn = document.getElementById('saveBtn');

// console.log('setting userdata on UI')
// setUserDataOnUI();

// async function updateUserData(user) {
//     await saveUserDataInDb(user);
//     window.location.replace("homepage.html");
// }

// // preview the selected profile picture of the user
// imageInput.addEventListener('change', function (event) {
//     const file = event.target.files[0];
//     if (file) {
//         const reader = new FileReader();
//         reader.onload = function (e) {
//             profilePic.src = e.target.result;
//         };
//         reader.readAsDataURL(file);
//     }
// });

// // upload the profile picture of the user
// uploadImageBtn.addEventListener('click', function (event) {
//     event.preventDefault();
//     const file = imageInput.files[0];
//     if (file) {
//         try {
//             uploadProfileImage(file);
//         } catch (error) {
//             console.error(error);
//         }
//     } else {
//         alert('No image selected!');
//     }
// })

// // preview the portfolio selected images of the user
// portfolioImageInput.addEventListener('change', function (event) {
//     event.preventDefault();
//     const files = event.target.files;
//     imagePreviewDiv.innerHTML = ''; // Clear previous images

//     for (let i = 0; i < files.length; i++) {
//         const file = files[i];
//         const reader = new FileReader();

//         reader.onload = function (e) {
//             const img = document.createElement('img');
//             img.src = e.target.result;
//             imagePreviewDiv.appendChild(img);
//         };

//         reader.readAsDataURL(file);
//     }
// });

// // upload the portfolio images of the user
// uploadPortfolioImageBtn.addEventListener('click', function (event) {
//     event.preventDefault();
//     const files = portfolioImageInput.files;
//     if (files.length > 0) {
//         try {
//             uploadPortfolioImages(files);
//         } catch (error) {
//             console.error(error);
//         }
//     } else {
//         alert('No files selected!');
//     }
// })

// // Save the user input data
// saveBtn.addEventListener('click', function (event) {
//     event.preventDefault();

//     loggedInUser.stageName = stageName.textContent;
//     loggedInUser.genre = genre.textContent;
//     loggedInUser.phone = phone.textContent;
//     loggedInUser.website = website.textContent;
//     loggedInUser.summary = summary.textContent;

//     updateUserData(loggedInUser);
// });


// function setUserDataOnUI() {
//     if (loggedInUser) {
//         if (loggedInUser.profile_image) {
//             profilePic.src = loggedInUser.profile_image;
//         }
//         if (loggedInUser.stageName) {
//             stageName.textContent = loggedInUser.stageName;
//         }
//         if (loggedInUser.genre) {
//             for (let i = 0; i < genre.options.length; i++) {
//                 if (genre.options[i].textContent == loggedInUser.genre) {
//                     genre.selectedIndex = i;
//                 }
//             }
//         }
//         if (loggedInUser.phone) {
//             phone.textContent = loggedInUser.phone;
//         }
//         if (loggedInUser.website) {
//             website.textContent = loggedInUser.website;
//         }
//         if (loggedInUser.summary) {
//             summary.textContent = loggedInUser.summary;
//         }
//         if (loggedInUser.portfolio_images) {
//             imagePreviewDiv.innerHTML = '';
//             loggedInUser.portfolio_images.forEach(imageUrl => {
//                 const img = document.createElement('img');
//                 img.src = imageUrl;
//                 imagePreviewDiv.appendChild(img);
//             });
//         }
//     }
// }