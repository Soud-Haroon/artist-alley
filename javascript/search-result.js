import { includeHeaderFooter, gotoMyAccount, logoutUser, loggedInUser } from "./utilities.js";

import { getSearchResults } from "./firestore.js";



const headerElement = document.querySelector('header');
const footerElement = document.querySelector('footer');
setupHeaderFooter();


const params = new URLSearchParams(window.location.search);
const searchInput = params.get('query');

searchAndDisplayArtists(searchInput);

async function searchAndDisplayArtists(searchInput) {
    if (searchInput !== '') {
        const result = await getSearchResults(searchInput);
        let filteredResult = [];
        result.forEach(artist => {
            if (loggedInUser.uid !== artist.uid) {
                filteredResult.push(artist);
            }
        })
        console.log(`${filteredResult.length} artists found!`);
        const artistContainer = document.getElementById('container');
        if (filteredResult.length > 0) {
            artistContainer.innerHTML = '';
            result.forEach(artist => {
                displayArtistCard(artist, artistContainer);
            })

        } else {
            const noArtist = document.createElement('div');
            noArtist.textContent = 'No artist found!';
            noArtist.id = 'no-artist'
            artistContainer.appendChild(noArtist);
        }
    }

}

async function displayArtistCard(artist, artistContainer) {
    const response = await fetch('../templates/search-result-artist-template.html');
    const html = await response.text();

    // Create a temporary element to hold the HTML content
    const temp = document.createElement('div');
    temp.innerHTML = html;


    // Extract the template content
    let artistTemplate = temp.querySelector('#search-artist-template');
    let clone = document.importNode(artistTemplate.content, true);

    const profilePic = clone.querySelector('#profile_pic');
    const summary = clone.querySelector('#summary');
    const portfolioImages = clone.querySelector(".images");
    const viewProfile = clone.querySelector('#view-profile');

    profilePic.src = artist.profile_image;
    summary.textContent = artist.summary;
    viewProfile.addEventListener('click', (event) => {
        event.preventDefault();
        let url = `../html/artist-portfolio.html?artist_id=${artist.uid}`;
        window.location = url;
    });

    if (artist.portfolio_images) {
        portfolioImages.innerHTML = '';

        artist.portfolio_images.forEach(imageLink => {
            const img = document.createElement('img');
            img.src = imageLink;
            portfolioImages.appendChild(img);
        });
    }

    artistContainer.appendChild(clone);
}




// HEADER AND FOOTER ================================================================

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