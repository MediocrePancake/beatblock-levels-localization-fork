const spanishText = {
    "download-btn" : "Descargar"
}

const englishText = {
    "download-btn": "Download"
}

let lang = "spanish";

function setLanguage(language) {
    if (language == "spanish") {
        for (const ui of Object.keys(spanishText)) {
            document.getElementById(ui).innerHTML = spanishText[ui];
        }
    }
    else if (language == "english") {
        for (const ui of Object.keys(englishText)) {
            document.getElementById(ui).innerHTML = englishText[ui];
        }
    }
}

function toggleLanguage() {
    if (lang == "spanish") lang = "english";
    else lang = "spanish";

    setLanguage(lang);
}