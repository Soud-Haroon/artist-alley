// var fireLink = "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import { firebase, db } from "../app.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


// Load templates from a separate HTML file
async function loadTemplates() {
    const response = await fetch('../templates/userProfile-template.html');
    const text = await response.text();
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = text;
    document.body.appendChild(tempDiv);
}

document.getElementById('searchButton').addEventListener('click', async function () {
    var search = "empty";
    search = document.getElementById('searchInput').value;
    if (search !== '') { // Check if input is not empty
        await searchArtists(search);
    } else {
        alert('Please enter a search query.');
    }
});

async function searchArtists(search) {
    let resultList = [];
    let results = [];
    try {
        // console.log("search", " text => ", search);
        const querySnapshot = await getDocs(collection(db, "artists"));
        querySnapshot.forEach((doc) => {
            // Push each document's data into the resultList array
            resultList.push(doc.data());
            // console.log("name", " => ", doc.data().fName);
        });

        console.log("============ search results  ==================");
        resultList.forEach((element) => {
            if (element.genre === search) {
                results.push(element);
            }
        });
        renderArtistResults(results);
        // console.log("All documents:", resultList); // Logging all documents in the array
    } catch (error) {
        console.log('Error while getting search results:', error);
    }
}

function renderArtistResults(artistResults) {
    const template = document.getElementById('artist-result-template');
    const container = document.getElementById('searchResults');

    // Clear the container
    container.innerHTML = '';

    // Create document fragment to minimize reflows
    const fragment = document.createDocumentFragment();
    try {
        artistResults.forEach(artist => {
            const clone = template.content.cloneNode(true);
            // 
            const artistItem = clone.querySelector('.artist-item');
            artistItem.setAttribute('data-uid', artist.uid);
            // 
            clone.querySelector('.artist-name').textContent = artist.fName + " " + artist.lName;
            clone.querySelector('.artist-phone').textContent = artist.phone;
            clone.querySelector('.stage-name').textContent = artist.stageName;
            // 
            fragment.appendChild(clone);
        });
    } catch (error) {
        console.log("error while adding data in template: " + error);
    }
    //
    container.appendChild(fragment);
}

loadTemplates();


// function displayResults(results) {
//     let array = results;
//     var results = document.getElementById('searchResults');
//     results.innerHTML = '';
//     array.forEach((doc) => {
//         var data = doc;
//         results.innerHTML += `<div class="homepage-result-user">
//         <h3>Name: ${data.fName} + ${data.lName}</h3>
//         <span>phone: ${data.phone}</span>
//         </div>`;
//     });
// }
