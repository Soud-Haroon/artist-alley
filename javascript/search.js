import { db } from "../app.js";
import { collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";
// search.js

document.getElementById('searchButton').addEventListener('click', async function () {
    var searchQuery = document.getElementById('searchInput').value;
    await searchArtists(searchQuery);
});

async function searchArtists(searchQuery) {
    const artistsRef = collection(db, 'artists');
    const q = query(artistsRef, where("fName", ">=", searchQuery), where("fName", "<=", searchQuery + '\uf8ff'));

    try {
        const querySnapshot = await getDocs(q);
        var results = document.getElementById('searchResults');
        results.innerHTML = '';
        querySnapshot.forEach((doc) => {
            var data = doc.data();
            results.innerHTML += `<div>${data.fName}</div>`;
        });
    } catch (error) {
        console.error("Error searching artists: ", error);
    }
}



