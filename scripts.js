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

// Funciones de autenticación
function register(event) {
    event.preventDefault();
    const username = document.getElementById("registerUsername").value;
    const email = document.getElementById("registerEmail").value;
    const password = document.getElementById("registerPassword").value;

    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Guardar información adicional del usuario
            return db.collection("users").doc(userCredential.user.uid).set({
                username: username,
                email: email
            });
        })
        .then(() => {
            alert("Registro exitoso. Por favor, inicia sesión.");
            showLoginForm();
        })
        .catch((error) => {
            alert("Error en el registro: " + error.message);
        });
}

function login(event) {
    event.preventDefault();
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    auth.signInWithEmailAndPassword(email, password)
        .then(() => {
            closeAuthModal();
        })
        .catch((error) => {
            alert("Error en el inicio de sesión: " + error.message);
        });
}

function logout() {
    auth.signOut().then(() => {
        updateUserInterface(null);
    }).catch((error) => {
        console.error("Error al cerrar sesión:", error);
    });
}

// Listener para cambios en el estado de autenticación
auth.onAuthStateChanged((user) => {
    if (user) {
        db.collection("users").doc(user.uid).get().then((doc) => {
            if (doc.exists) {
                updateUserInterface({
                    username: doc.data().username,
                    email: user.email
                });
            }
        });
    } else {
        updateUserInterface(null);
    }
});

function updateUserInterface(userData) {
    const loginBtn = document.getElementById("loginBtn");
    const userInfo = document.getElementById("userInfo");
    const userName = document.getElementById("userName");

    if (userData) {
        loginBtn.style.display = "none";
        userInfo.style.display = "flex";
        userName.textContent = userData.username;
    } else {
        loginBtn.style.display = "block";
        userInfo.style.display = "none";
        userName.textContent = "";
    }
}

// Funciones para cargar y mostrar niveles
function loadLevels() {
    db.collection("levels").get().then((querySnapshot) => {
        const levelsGrid = document.getElementById("levelsGrid");
        levelsGrid.innerHTML = ""; // Limpiar niveles existentes

        querySnapshot.forEach((doc) => {
            const level = doc.data();
            const levelCard = createLevelCard(level);
            levelsGrid.appendChild(levelCard);
        });
    });
}

function createLevelCard(level) {
    const card = document.createElement("div");
    card.className = "level-card";
    card.innerHTML = `
        <img src="${level.image}" alt="Portada del nivel" class="level-image">
        <div class="level-info">
            <div class="level-name">${level.name}</div>
            <div class="level-artist">${level.artist}</div>
        </div>
    `;
    return card;
}

// Funciones para manejar los modales
function openAuthModal() {
    document.getElementById("authModal").style.display = "block";
}

function closeAuthModal() {
    document.getElementById("authModal").style.display = "none";
}

function showLoginForm() {
    document.getElementById("loginForm").style.display = "block";
    document.getElementById("registerForm").style.display = "none";
}

function showRegisterForm() {
    document.getElementById("loginForm").style.display = "none";
    document.getElementById("registerForm").style.display = "block";
}

function openModal() {
    document.getElementById("downloadModal").style.display = "block";
}

function closeModal() {
    document.getElementById("downloadModal").style.display = "none";
}

function filterLevels() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase().trim();
    const levelsGrid = document.getElementById('levelsGrid');
    const levels = levelsGrid.getElementsByClassName('level-card');
    let found = false;

    for (let level of levels) {
        const levelName = level.querySelector('.level-name').textContent.toLowerCase();

        if (levelName.includes(searchInput)) {
            level.style.display = 'block';
            found = true;
        } else {
            level.style.display = 'none';
        }
    }

    if (!found) {
        if (!document.getElementById('notFoundMessage')) {
            const notFoundMessage = document.createElement('div');
            notFoundMessage.id = 'notFoundMessage';
            notFoundMessage.className = 'not-found';
            notFoundMessage.innerHTML = '<h2>404<br>Busco busco pero no hay nada :/</h2>';
            levelsGrid.appendChild(notFoundMessage);
        }
    } else {
        const notFoundMessage = document.getElementById('notFoundMessage');
        if (notFoundMessage) {
            notFoundMessage.remove();
        }
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    loadLevels();
    document.getElementById("loginBtn").addEventListener('click', openAuthModal);
    document.getElementById("loginForm").addEventListener('submit', login);
    document.getElementById("registerForm").addEventListener('submit', register);
});

// Cerrar los modales si se hace clic fuera de ellos
window.onclick = function(event) {
    if (event.target == document.getElementById("downloadModal")) {
        closeModal();
    }
    if (event.target == document.getElementById("authModal")) {
        closeAuthModal();
    }
}