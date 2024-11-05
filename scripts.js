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


// Inicializar Firebase
firebase.initializeApp(firebaseConfig);

// Referencias a servicios de Firebase
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

// Funciones de autenticación
function login(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    auth.signInWithEmailAndPassword(email, password)
        .then(() => {
            closeAuthModal();
        })
        .catch((error) => {
            alert('Error de inicio de sesión: ' + error.message);
        });
}

function register(e) {
    e.preventDefault();
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const username = document.getElementById('registerUsername').value;
    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            return db.collection('users').doc(userCredential.user.uid).set({
                username: username,
                email: email
            });
        })
        .then(() => {
            closeAuthModal();
        })
        .catch((error) => {
            alert('Error de registro: ' + error.message);
        });
}

function logout() {
    auth.signOut().then(() => {
        updateUserInterface(null);
    }).catch((error) => {
        console.error('Error al cerrar sesión:', error);
    });
}

// Funciones para manejar la interfaz de usuario
function updateUserInterface(userData) {
    const loginBtn = document.getElementById("loginBtn");
    const userInfo = document.getElementById("userInfo");
    const userName = document.getElementById("userName");
    const userAvatar = document.getElementById("userAvatar");
    const uploadLevelBtn = document.getElementById("uploadLevelBtn");

    if (userData) {
        loginBtn.style.display = "none";
        userInfo.style.display = "flex";
        userName.textContent = userData.username;
        if (userData.profilePicture) {
            userAvatar.src = userData.profilePicture;
        }
        uploadLevelBtn.style.display = "block";
    } else {
        loginBtn.style.display = "block";
        userInfo.style.display = "none";
        userName.textContent = "";
        userAvatar.src = "img/default-avatar.png";
        uploadLevelBtn.style.display = "none";
    }
}

// Función para cambiar la foto de perfil
function changeProfilePicture() {
    document.getElementById("profilePictureInput").click();
}

document.getElementById("profilePictureInput").addEventListener("change", function(event) {
    const file = event.target.files[0];
    if (file) {
        const user = auth.currentUser;
        const storageRef = storage.ref(`profilePictures/${user.uid}`);
        
        showLoadingScreen();
        
        storageRef.put(file).then(() => {
            return storageRef.getDownloadURL();
        }).then((url) => {
            return db.collection("users").doc(user.uid).update({
                profilePicture: url
            });
        }).then(() => {
            document.getElementById("userAvatar").src = url;
            hideLoadingScreen();
        }).catch((error) => {
            console.error("Error uploading profile picture:", error);
            hideLoadingScreen();
        });
    }
});

// Funciones para cargar y mostrar niveles
function loadLevels() {
    db.collection("levels").orderBy("createdAt", "desc").get().then((querySnapshot) => {
        const levelsGrid = document.getElementById("levelsGrid");
        levelsGrid.innerHTML = ""; // Limpiar niveles existentes

        querySnapshot.forEach((doc) => {
            const level = doc.data();
            const levelCard = createLevelCard(level, doc.id);
            levelsGrid.appendChild(levelCard);
        });
    });
}

function createLevelCard(level, levelId) {
    const card = document.createElement("div");
    card.className = "level-card";
    card.onclick = () => location.href = `level.html?id=${levelId}`;
    card.innerHTML = `
        <img src="${level.coverImage}" alt="Portada del nivel" class="level-image">
        <div class="level-info">
            <div class="level-name">${level.title}</div>
            <div class="level-artist">${level.composer}</div>
        </div>
    `;
    return card;
}

// Función para subir un nivel
function uploadLevel(event) {
    event.preventDefault();
    const user = auth.currentUser;
    if (!user) {
        alert("Please log in to upload a level.");
        return;
    }

    showLoadingScreen();

    const levelData = {
        title: document.getElementById("levelTitle").value,
        composer: document.getElementById("composer").value,
        charter: document.getElementById("charter").value,
        programmer: document.getElementById("programmer").value,
        description: document.getElementById("description").value,
        descriptionCreatedBy: document.getElementById("descriptionCreatedBy").value,
        uploadedBy: user.uid,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    };

    const coverImage = document.getElementById("coverImage").files[0];
    const sampleAudio = document.getElementById("sampleAudio").files[0];
    const levelZip = document.getElementById("levelZip").files[0];

    // Subir archivos y obtener URLs
    Promise.all([
        uploadFile(coverImage, "coverImages"),
        uploadFile(sampleAudio, "sampleAudios"),
        uploadFile(levelZip, "levelZips")
    ]).then(([coverImageUrl, sampleAudioUrl, levelZipUrl]) => {
        levelData.coverImage = coverImageUrl;
        levelData.sampleAudio = sampleAudioUrl;
        levelData.levelZip = levelZipUrl;

        // Guardar datos del nivel en Firestore
        return db.collection("levels").add(levelData);
    }).then(() => {
        alert("Level uploaded successfully!");
        document.getElementById("uploadLevelForm").reset();
        closeUploadPanel();
        loadLevels(); // Recargar los niveles para mostrar el nuevo
        hideLoadingScreen();
    }).catch((error) => {
        console.error("Error uploading level:", error);
        alert("Error uploading level. Please try again.");
        hideLoadingScreen();
    });
}

function uploadFile(file, folder) {
    return new Promise((resolve, reject) => {
        const storageRef = storage.ref(`${folder}/${file.name}`);
        storageRef.put(file).then(() => {
            return storageRef.getDownloadURL();
        }).then((url) => {
            resolve(url);
        }).catch(reject);
    });
}

// Funciones para manejar el panel de subida de nivel
function openUploadPanel() {
    document.getElementById("uploadLevelPanel").classList.add("open");
}

function closeUploadPanel() {
    document.getElementById("uploadLevelPanel").classList.remove("open");
}

// Funciones para manejar la pantalla de carga
function showLoadingScreen() {
    document.getElementById("loadingScreen").style.display = "flex";
}

function hideLoadingScreen() {
    document.getElementById("loadingScreen").style.display = "none";
}

// Funciones para manejar modales
function openModal() {
    document.getElementById("downloadModal").style.display = "block";
}

function closeModal() {
    document.getElementById("downloadModal").style.display = "none";
}

function openAuthModal() {
    document.getElementById("authModal").style.display = "block";
}

function closeAuthModal() {
    document.getElementById("authModal").style.display = "none";
}

// Función para filtrar niveles
function filterLevels() {
    const searchTerm = document.getElementById("searchInput").value.toLowerCase();
    const levelCards = document.querySelectorAll(".level-card");

    levelCards.forEach(card => {
        const levelName = card.querySelector(".level-name").textContent.toLowerCase();
        const levelArtist = card.querySelector(".level-artist").textContent.toLowerCase();
        if (levelName.includes(searchTerm) || levelArtist.includes(searchTerm)) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }
    });
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    loadLevels();
    document.getElementById("loginForm").addEventListener('submit', login);
    document.getElementById("registerForm").addEventListener('submit', register);
    document.getElementById("uploadLevelBtn").addEventListener('click', openUploadPanel);
    document.getElementById("uploadLevelForm").addEventListener('submit', uploadLevel);
});

// Listener para cambios en el estado de autenticación
auth.onAuthStateChanged((user) => {
    if (user) {
        db.collection("users").doc(user.uid).get().then((doc) => {
            if (doc.exists) {
                updateUserInterface({
                    username: doc.data().username,
                    email: user.email,
                    profilePicture: doc.data().profilePicture
                });
            }
        });
    } else {
        updateUserInterface(null);
    }
});

// Cerrar los modales si se hace clic fuera de ellos
window.onclick = function(event) {
    if (event.target == document.getElementById("downloadModal")) {
        closeModal();
    }
    if (event.target == document.getElementById("authModal")) {
        closeAuthModal();
    }
    if (event.target == document.getElementById("uploadLevelPanel")) {
        closeUploadPanel();
    }
}