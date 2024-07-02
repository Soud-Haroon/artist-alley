// var fireLink = "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import { firebase, db } from "../app.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


document.getElementById('searchButton').addEventListener('click', async function () {
    var search = "empty";
    search = document.getElementById('searchInput').value;
    searchArtists(search);
});

async function searchArtists(search) {
    let resultList = [];
    let results = [];
    try {
        console.log("search", " text => ", search);
        const querySnapshot = await getDocs(collection(db, "artists"));
        querySnapshot.forEach((doc) => {
            // Push each document's data into the resultList array
            resultList.push(doc.data());
            console.log("name", " => ", doc.data().fName);
        });

        console.log("============ search results  ==================");
        resultList.forEach((element) => {
            if (element.fName === search) {
                results.push(element);
            }
        });
        console.log("===========> ", results);
        displayResults(results);
        // console.log("All documents:", resultList); // Logging all documents in the array
    } catch (error) {
        console.log('Error while getting search results:', error);
    }
}

function displayResults(results) {
    let array = results;
    var results = document.getElementById('searchResults');
    results.innerHTML = '';
    array.forEach((doc) => {
        var data = doc;
        results.innerHTML += `<div>${data.fName}</div>`;
    });
}


// document.getElementById('searchButton').addEventListener('click', async function () {
//     var searchQuery = document.getElementById('searchInput').value;
//     await searchArtists(searchQuery);
// });

// async function searchArtists(searchQuery) {
//     const artistsRef = collection(db, 'artists');
//     const q = query(artistsRef, where("fName", ">=", searchQuery), where("fName", "<=", searchQuery + '\uf8ff'));

//     try {
//         const querySnapshot = await getDocs(q);
//         var results = document.getElementById('searchResults');
//         results.innerHTML = '';
//         querySnapshot.forEach((doc) => {
//             var data = doc.data();
//             results.innerHTML += `<div>${data.fName}</div>`;
//         });
//     } catch (error) {
//         console.error("Error searching artists: ", error);
//     }
// }



