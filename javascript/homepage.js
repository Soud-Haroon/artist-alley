
import {
    getUserDataById
} from '../javascript/firestore.js';

import { loggedInUser, includeHeaderFooter, gotoMyAccount, logoutUser, includeHomePageHeader } from "./utilities.js";

const headerElement = document.querySelector('header');
const footerElement = document.querySelector('footer');

// includeHeaderFooter(setHeader, setFooter);
let userData;

if (loggedInUser) {
    includeHomePageHeader(setHeader);
    userData = await getUserData(loggedInUser.uid, loggedInUser.userType);
    localStorage.setItem("user", JSON.stringify(userData));
    setDataOnUI();
}



function setDataOnUI() {
    const searchButton = document.getElementById('searchButton');

    searchButton.addEventListener('click', async function () {
        const searchInput = document.getElementById('searchInput').value.trim();

        if (searchInput !== '') {
            let url = `../html/search-result.html?query=${searchInput}`;
            window.location = url;
        } else {
            alert('Please enter something in the search box!');
        }
    });

    // const rock = document.getElementById('rock');
    // const rb = document.getElementById('r&b');;
    // const indie = document.getElementById('indie');
    // const guitar = document.getElementById('guitar');
    // const comedy = document.getElementById('comedy');
    // const pop = document.getElementById('pop');
    // const dj = document.getElementById('dj');
    // const dance = document.getElementById('dance');
    // const country = document.getElementById('country');
    // const sing = document.getElementById('sing');

    // rock.addEventListener('click', () => {
    //     let url = `../html/search-result.html?query=rock`;
    //     window.location = url;
    // })
    // guitar.addEventListener('click', () => {
    //     let url = `../html/search-result.html?query=guitar`;
    //     window.location = url;
    // })
    // comedy.addEventListener('click', () => {
    //     let url = `../html/search-result.html?query=comedy`;
    //     window.location = url;
    // })
    // dj.addEventListener('click', () => {
    //     let url = `../html/search-result.html?query=dj`;
    //     window.location = url;
    // })
    // country.addEventListener('click', () => {
    //     let url = `../html/search-result.html?query=country`;
    //     window.location = url;
    // })
    // sing.addEventListener('click', () => {
    //     let url = `../html/search-result.html?query=sing`;
    //     window.location = url;
    // })
    // pop.addEventListener('click', () => {
    //     let url = `../html/search-result.html?query=pop`;
    //     window.location = url;
    // })
}

async function getUserData(userId, userType) {
    return await getUserDataById(userId, userType);
}

function setHeader(data) {
    if (headerElement) {
        headerElement.innerHTML = "";
        headerElement.innerHTML = data;
        const title = document.getElementById('title');
        const myProfileBtn = document.getElementById('myProfile');
        const logoutBtn = document.getElementById('logoutBtn');

        // title.textContent = `Welcome ${loggedInUser.fName}!`;
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

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('search-toggle').addEventListener('click', function (event) {
        const body = document.body;
        // event.preventDefault(); // Prevent the default link behavior
        // alert('Search clicked!');
        body.classList.toggle("search-active");
        // You can add more functionality here
    });
});

var inputField = document.getElementById("search");

document.addEventListener('DOMContentLoaded', function () {
    // document.getElementById('getSearch').addEventListener('click', function (event) {
    // alert("hi");
    // const searchInput = inputField.value;
    // const url = `../html/search-result.html`;
    // console.log(`uuuuuuuuuuuu` + url);
    // window.location.replace = url;

    // });
    const searchButton = document.getElementById('getSearch');

    searchButton.addEventListener('click', async function () {
        const searchInput = document.getElementById('search').value.trim();

        if (searchInput !== '') {
            let url = `../html/search-result.html?query=${searchInput}`;
            window.location = url;
        } else {
            alert('Please enter something in the search box!');
        }
    });
});