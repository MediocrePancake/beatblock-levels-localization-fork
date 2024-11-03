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

    // Recorre cada tarjeta y filtra por coincidencias
    for (let level of levels) {
        const levelName = level.querySelector('.level-name').textContent.toLowerCase();

        // Si el nombre contiene el texto de búsqueda, se muestra; si no, se oculta
        if (levelName.includes(searchInput)) {
            level.style.display = 'block';
            found = true;
        } else {
            level.style.display = 'none';
        }
    }

    // Mostrar mensaje de "404" si no hay coincidencias
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


// Cerrar el modal si se hace clic fuera de él
window.onclick = function(event) {
    if (event.target == document.getElementById("downloadModal")) {
        closeModal();
    }
}
