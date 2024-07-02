const loggedInUser = JSON.parse(localStorage.getItem("user"));
import { logout } from "./firebase-auth.js";

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

function logoutUser() {
    logout(() => {
        console.log("logout successful");
        window.location.replace('../index.html');
    });
}


export { loggedInUser, dataUrlToFile, logoutUser };