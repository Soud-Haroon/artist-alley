import { logout } from "./firebase-auth.js";
import { USER_TYPE_ARTIST } from "./app-constants.js";

const loggedInUser = JSON.parse(localStorage.getItem("user"));

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

    } else {
        window.location.replace('../html/account-organiser.html');
    }
}

function logoutUser() {
    logout(() => {
        console.log("logout successful");
        window.location.replace('../html/login.html');
    });
}

async function includeHeaderFooter(setHeader, setFooter) {
    fetch('../html/header.html')
        .then(response => response.text())
        .then(data => {
            setHeader(data);
        })
        .catch(error => console.error("Error fetching header: ", error));

    fetch('../html/footer.html')
        .then(response => response.text())
        .then(data => {
            setFooter(data);
        })
        .catch(error => console.error("Error fetching footer: ", error));
}

export { loggedInUser, dataUrlToFile, gotoMyAccount, logoutUser, includeHeaderFooter };