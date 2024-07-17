
import {
    getUserDataById
} from '../javascript/firestore.js';

import { loggedInUser, includeHeaderFooter, gotoMyAccount, logoutUser } from "./utilities.js";

let userData = await getUserData(loggedInUser.uid, loggedInUser.userType);
localStorage.setItem("user", JSON.stringify(userData));

const headerElement = document.querySelector('header');
const footerElement = document.querySelector('footer');

includeHeaderFooter(setHeader, setFooter);

setDataOnUI();



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

    const rock = document.getElementById('rock');
    const rb = document.getElementById('r&b');;
    const indie = document.getElementById('indie');
    const guitar = document.getElementById('guitar');
    const comedy = document.getElementById('comedy');
    const pop = document.getElementById('pop');
    const dj = document.getElementById('dj');
    const dance = document.getElementById('dance');
    const country = document.getElementById('country');
    const sing = document.getElementById('sing');

    rock.addEventListener('click', () => {
        let url = `../html/search-result.html?query=rock`;
        window.location = url;
    })
    guitar.addEventListener('click', () => {
        let url = `../html/search-result.html?query=guitar`;
        window.location = url;
    })
    comedy.addEventListener('click', () => {
        let url = `../html/search-result.html?query=comedy`;
        window.location = url;
    })
    dj.addEventListener('click', () => {
        let url = `../html/search-result.html?query=dj`;
        window.location = url;
    })
    country.addEventListener('click', () => {
        let url = `../html/search-result.html?query=country`;
        window.location = url;
    })
    sing.addEventListener('click', () => {
        let url = `../html/search-result.html?query=sing`;
        window.location = url;
    })
    pop.addEventListener('click', () => {
        let url = `../html/search-result.html?query=pop`;
        window.location = url;
    })
}

async function getUserData(userId, userType) {
    return await getUserDataById(userId, userType);
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
