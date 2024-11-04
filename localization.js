// Dictionaries of text used
let localizedText = {};
const spanishText = {
    download:"Descargar"
};
const englishText = {
    download: "Download"
};

localizedText = englishText; //Test

function SetLanguage(language) {
    if (language == "spanish") localizedText = spanishText;
    else if (language == "english") localizedText = englishText;
}