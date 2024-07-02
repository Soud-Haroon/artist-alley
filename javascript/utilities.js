const loggedInUser = JSON.parse(localStorage.getItem("user"));
import { logout } from "./firebase-auth.js";
import { USER_TYPE_ARTIST } from "./app-constants.js";

const logoutBtn = document.getElementById('logoutBtn');
logoutBtn.addEventListener('click', (event) => {
    event.preventDefault();
    console.log('logout button clicked!');
    logoutUser();
});

const profileBtn = document.getElementById('myProfile');
profileBtn.addEventListener('click', (event) => {
    event.preventDefault();
    gotoMyAccount();
});

function dataUrlToFile(dataUrl, fileName) {
    const arr = dataUrl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], fileName, { type: mime });
}

function gotoMyAccount() {
    if (loggedInUser.userType == USER_TYPE_ARTIST) {
        window.location.replace('../html/account-artist.html');
        console.log(`User email is: ${loggedInUser.email}`);

    } else {
        console.log('went to my account');
        window.location.replace('../html/account-organiser.html');
    }
}

function logoutUser() {
    logout(() => {
        console.log("logout successful");
        window.location.replace('../index.html');
    });
}

export { loggedInUser, dataUrlToFile, logoutUser };