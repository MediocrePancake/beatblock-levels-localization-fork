// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyD5p-51VBBkImEhK0leLFxss79S_zi0PR8",
    authDomain: "beatblockcommunity.firebaseapp.com",
    projectId: "beatblockcommunity",
    storageBucket: "beatblockcommunity.firebasestorage.app",
    messagingSenderId: "988637910134",
    appId: "1:988637910134:web:3a9b7e2ae5f4d14c403b57",
    measurementId: "G-M7BJVK2LVS"
};
firebase.initializeApp(firebaseConfig);

// Referencia a Firestore
const db = firebase.firestore();

document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const levelId = urlParams.get('id');

    if (levelId) {
        loadLevelDetails(levelId);
    } else {
        console.error("No level ID provided");
    }
});

function loadLevelDetails(levelId) {
    db.collection("levels").doc(levelId).get().then((doc) => {
        if (doc.exists) {
            const level = doc.data();
            displayLevelDetails(level);
        } else {
            console.log("No such document!");
        }
    }).catch((error) => {
        console.log("Error getting document:", error);
    });
}

function displayLevelDetails(level) {
    const levelDetails = document.getElementById("levelDetails");
    levelDetails.innerHTML = `
        <div class="left-column">
            <img src="${level.coverImage}" alt="Portada del Nivel" class="level-cover">
            <audio src="${level.sampleAudio}" controls class="level-audio"></audio>
        </div>
        <div class="right-column">
            <h2>${level.title}</h2>
            <ul>
                <li><strong>Composer:</strong> ${level.composer}</li>
                <li><strong>Charter:</strong> ${level.charter}</li>
                <li><strong>Programmer:</strong> ${level.programmer}</li>
            </ul>
            <h3>Description</h3>
            <p>${level.description}</p>
            <p><em>description created by: ${level.descriptionCreatedBy}</em></p>
            <a href="${level.levelZip}" download class="download-btn">Download level (.zip)</a>
        </div>
    `;
}