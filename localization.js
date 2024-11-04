// Dictionaries of text used
let localizedText = {};
const spanishText = {
    descargar:"Descargar"
};
const englishText = {
    descargar: "Download"
};

localizedText = englishText; //Test

function SetLanguage(language) {
    if (language == "spanish") localizedText = spanishText;
    else if (language == "english") localizedText = englishText;
}