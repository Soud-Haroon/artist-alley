
import {
    getUserDataById
} from '../javascript/firestore.js';

import { loggedInUser, includeHeaderFooter, gotoMyAccount, logoutUser, includeHomePageHeader } from "./utilities.js";

const headerElement = document.querySelector('header');
const footerElement = document.querySelector('footer');

// includeHeaderFooter(setHeader, setFooter);
let userData;

// const toggleSearch = document.getElementById('search-toggle');
// const searchInput = document.getElementById('search');

// toggleSearch.addEventListener('click', (event) => {
//     event.preventDefault();
//     console.log('THIISIHGIHSI')
//     console.log('button clicked!')
//     document.body.classList.toggle("search-active");
// })
// const searchButton = document.getElementById('searchBtn');

// searchButton.addEventListener('click', async function () {
//     const query = searchInput.value.trim();
//     if (query !== '') {
//         let url = `../html/search-result.html?query=${query}`;
//         console.log(`url is: ${url}`)
//         alert(`query is: ${query}`)
//         document.body.classList.toggle("search-active");
//         window.location = '../html/search-result.html?query=' + query;
//     } else {
//         alert('Please enter something in the search box!');
//     }
// });

if (loggedInUser) {
    includeHomePageHeader(setHeader);
    userData = await getUserData(loggedInUser.uid, loggedInUser.userType);
    localStorage.setItem("user", JSON.stringify(userData));
    setDataOnUI();
}

function setDataOnUI() {


    const searchInput = document.getElementById('search');
    const searchButton = document.getElementById('searchBtn');

    const navSearch = document.getElementById('nav-search');
    const searchCloseBtn = document.getElementById('searchCloseBtn');

    navSearch.addEventListener('click', (event) => {
        event.preventDefault();
        document.body.classList.toggle("search-active");
        // alert("Welcom from inside!")
    })

    searchCloseBtn.addEventListener('click', (event) => {
        console.log("1==========================");
        event.preventDefault();
        document.body.classList.remove("search-active")
        console.log("==========================");
    })

    searchButton.addEventListener('click', (event) => {
        event.preventDefault();
        const query = searchInput.value.trim();
        if (query !== '') {
            let url = `../html/search-result.html?query=${query}`;


            document.body.classList.toggle("searchactive");
            console.log(`url is: ${url}`)
            window.location = url;
        } else {
            alert('Please enter something in the search box!');
        }
    })

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

});