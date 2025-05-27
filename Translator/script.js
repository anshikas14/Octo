const fromText = document.querySelector(".from-text"),
toText = document.querySelector(".to-text"),
exchageIcon = document.querySelector(".exchange"),
selectTag = document.querySelectorAll("select"),
icons = document.querySelectorAll(".row i");
translateBtn = document.querySelector("button"),
errorMessage = document.createElement("div");
errorMessage.className = "error-message";
document.querySelector(".container").appendChild(errorMessage);

function initializeLanguageOptions() {
    const languages = [
        { code: 'en', name: 'English' },
        { code: 'es', name: 'Spanish' },
        { code: 'fr', name: 'French' },
        { code: 'de', name: 'German' },
        { code: 'it', name: 'Italian' },
        { code: 'pt', name: 'Portuguese' },
        { code: 'ru', name: 'Russian' },
        { code: 'ja', name: 'Japanese' },
        { code: 'ko', name: 'Korean' },
        { code: 'zh', name: 'Chinese' }
    ];

    const fromSelect = document.getElementById('from-language');
    const toSelect = document.getElementById('to-language');

    // Clear existing options
    fromSelect.innerHTML = '';
    toSelect.innerHTML = '';

    // Add options to both selects
    languages.forEach(lang => {
        const fromOption = document.createElement('option');
        fromOption.value = lang.code;
        fromOption.textContent = lang.name;
        fromSelect.appendChild(fromOption);

        const toOption = document.createElement('option');
        toOption.value = lang.code;
        toOption.textContent = lang.name;
        toSelect.appendChild(toOption);
    });

    // Set default values
    fromSelect.value = 'en';
    toSelect.value = 'es';
}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = "block";
    setTimeout(() => {
        errorMessage.style.display = "none";
    }, 3000);
}

exchageIcon.addEventListener("click", () => {
    try {
        let tempText = fromText.value,
        tempLang = selectTag[0].value;
        fromText.value = toText.value;
        toText.value = tempText;
        selectTag[0].value = selectTag[1].value;
        selectTag[1].value = tempLang;
    } catch (error) {
        console.error("Error exchanging languages:", error);
        showError("Failed to exchange languages. Please try again.");
    }
});

fromText.addEventListener("keyup", () => {
    if(!fromText.value) {
        toText.value = "";
        toText.setAttribute("placeholder", "Translation");
    }
});

async function translateText() {
    const fromLang = document.getElementById('from-language').value;
    const toLang = document.getElementById('to-language').value;
    const inputText = document.getElementById('input-text').value;
    const outputText = document.getElementById('output-text');
    const errorMessage = document.getElementById('error-message');

    if (!inputText.trim()) {
        errorMessage.textContent = 'Please enter text to translate';
        errorMessage.style.display = 'block';
        return;
    }

    try {
        errorMessage.style.display = 'none';
        outputText.value = 'Translating...';

        const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(inputText)}&langpair=${fromLang}|${toLang}`);
        const data = await response.json();

        if (data.responseStatus === 200) {
            outputText.value = data.responseData.translatedText;
        } else {
            throw new Error('Translation failed');
        }
    } catch (error) {
        errorMessage.textContent = 'Translation failed. Please try again.';
        errorMessage.style.display = 'block';
        outputText.value = '';
    }
}

translateBtn.addEventListener("click", translateText);

icons.forEach(icon => {
    icon.addEventListener("click", async ({target}) => {
        if(!fromText.value || !toText.value) {
            showError("Please enter text to copy or speak");
            return;
        }
        try {
            if(target.classList.contains("fa-copy")) {
                if(target.id == "from") {
                    await navigator.clipboard.writeText(fromText.value);
                } else {
                    await navigator.clipboard.writeText(toText.value);
                }
                showError("Text copied to clipboard!");
            } else {
                let utterance;
                if(target.id == "from") {
                    utterance = new SpeechSynthesisUtterance(fromText.value);
                    utterance.lang = selectTag[0].value;
                } else {
                    utterance = new SpeechSynthesisUtterance(toText.value);
                    utterance.lang = selectTag[1].value;
                }
                speechSynthesis.speak(utterance);
            }
        } catch (error) {
            console.error("Error handling icon click:", error);
            showError("Operation failed. Please try again.");
        }
    });
});

initializeLanguageOptions();