// Initialize UI elements
document.addEventListener('DOMContentLoaded', () => {
  // Font size buttons
  const fontBtns = document.getElementsByClassName("fontSize");
  for (const btn of fontBtns) {
    btn.addEventListener("click", () => {
      if (btn.classList.contains('reset-font-size')) return;
      
      // Remove selected class from all buttons
      Array.from(fontBtns).forEach(b => b.classList.remove('selected'));
      // Add selected class to clicked button
      btn.classList.add('selected');
      
      const size = btn.innerText === 'Default' ? '16px' : btn.innerText;
      chrome.runtime.sendMessage({
        action: 'fontSize',
        fontSize: size
      });
    });
  }

  // Reset font size button
  const resetFontSize = document.querySelector(".reset-font-size");
  if (resetFontSize) {
    resetFontSize.addEventListener("click", () => {
      // Remove selected class from all buttons
      Array.from(fontBtns).forEach(b => b.classList.remove('selected'));
      // Find and click the default button
      const defaultBtn = Array.from(fontBtns).find(b => b.innerText === 'Default');
      if (defaultBtn) {
        defaultBtn.click();
      } else {
        chrome.runtime.sendMessage({
          action: 'fontSize',
          fontSize: '16px'
        });
      }
    });
  }

  // Font style dropdown
  const fontChange = document.querySelector("#fontChange select");
  if (fontChange) {
    fontChange.addEventListener("change", (e) => {
      const selectedFont = e.target.value;
      const fontMap = {
        "Default": "",
        "Trebuchet MS": "Castellar, Trebuchet MS, sans-serif",
        "Arial": "Arial, sans-serif",
        "Baskerville": "Baskerville, serif",
        "Calibri": "Calibri, sans-serif",
        "Garamond": "Garamond, serif",
        "Verdana": "Verdana, sans-serif",
        "Georgia": "Georgia, serif",
        "Times New Roman": "Times New Roman, serif",
        "Helvetica": "Helvetica, sans-serif",
        "Monaco": "Monaco, Monospace",
        "OpenSans": "OpenSans-Regular, sans-serif",
        "Tahoma": "Tahoma, sans-serif"
      };

      chrome.runtime.sendMessage({
        action: 'fontStyle',
        fontStyle: selectedFont,
        fontFamily: fontMap[selectedFont] || ""
      });
    });
  }

  // Font style buttons
  const fontStyleBtns = document.getElementsByClassName("fontStyle");
  for (const btn of fontStyleBtns) {
    btn.addEventListener("click", () => {
      if (btn.classList.contains('reset-font-style')) return;
      
      // Remove selected class from all buttons
      Array.from(fontStyleBtns).forEach(b => b.classList.remove('selected'));
      // Add selected class to clicked button
      btn.classList.add('selected');
      
      const selectedFont = btn.innerText;
      const fontMap = {
        "Default": "",
        "Trebuchet MS": "Castellar, Trebuchet MS, sans-serif",
        "Arial": "Arial, sans-serif",
        "Baskerville": "Baskerville, serif",
        "Calibri": "Calibri, sans-serif",
        "Garamond": "Garamond, serif",
        "Verdana": "Verdana, sans-serif",
        "Georgia": "Georgia, serif",
        "Times New Roman": "Times New Roman, serif",
        "Helvetica": "Helvetica, sans-serif",
        "Monaco": "Monaco, Monospace",
        "OpenSans": "OpenSans-Regular, sans-serif",
        "Tahoma": "Tahoma, sans-serif"
      };

      chrome.runtime.sendMessage({
        action: 'fontStyle',
        fontStyle: selectedFont,
        fontFamily: fontMap[selectedFont] || ""
      });
    });
  }

  // Reset font style button
  const resetFontStyle = document.querySelector(".reset-font-style");
  if (resetFontStyle) {
    resetFontStyle.addEventListener("click", () => {
      // Remove selected class from all buttons
      Array.from(fontStyleBtns).forEach(b => b.classList.remove('selected'));
      
      // Reset font to default
      chrome.runtime.sendMessage({
        action: 'fontStyle',
        fontStyle: "Default",
        fontFamily: ""
      });
      
      // Reset dropdown if exists
      if (fontChange) {
        fontChange.value = "Default";
      }
    });
  }

  // Image buttons
  const imgRemover = document.querySelector(".img-remmover");
  if (imgRemover) {
    imgRemover.addEventListener("click", () => {
      imgRemover.classList.add('selected');
      imgAdd.classList.remove('selected');
      chrome.runtime.sendMessage({ action: 'image', show: false });
    });
  }

  const imgAdd = document.querySelector(".img-add");
  if (imgAdd) {
    imgAdd.addEventListener("click", () => {
      imgAdd.classList.add('selected');
      imgRemover.classList.remove('selected');
      chrome.runtime.sendMessage({ action: 'image', show: true });
    });
  }

  const imgRead = document.querySelector(".img-read");
  if (imgRead) {
    imgRead.addEventListener("click", () => {
      imgRead.classList.add('selected');
      setTimeout(() => imgRead.classList.remove('selected'), 1000);
      chrome.runtime.sendMessage({ action: 'imageReader' });
    });
  }

  const imgStopRead = document.querySelector(".img-stop-read");
  if (imgStopRead) {
    imgStopRead.addEventListener("click", () => {
      imgRead.classList.remove('selected');
      chrome.runtime.sendMessage({ action: 'stopImageReader' });
    });
  }

  // Reset images button
  const resetImages = document.querySelector(".reset-images");
  if (resetImages) {
    resetImages.addEventListener("click", () => {
      imgRemover.classList.remove('selected');
      imgAdd.classList.remove('selected');
      imgRead.classList.remove('selected');
      chrome.runtime.sendMessage({ action: 'image', show: true });
    });
  }

  // Text to speech
  const textToSpeech = document.querySelector(".text-to-speech");
  if (textToSpeech) {
    textToSpeech.addEventListener("click", () => {
      textToSpeech.classList.add('selected');
      textToSpeechSelected.classList.remove('selected');
      
      const rate = document.querySelector("#rate")?.value || 1.0;
      chrome.runtime.sendMessage({
        action: 'textToSpeech',
        rate: parseFloat(rate)
      });
    });
  }

  const textToSpeechSelected = document.querySelector(".text-to-speech-selected");
  if (textToSpeechSelected) {
    textToSpeechSelected.addEventListener("click", () => {
      textToSpeechSelected.classList.add('selected');
      textToSpeech.classList.remove('selected');
      
      const rate = document.querySelector("#rate")?.value || 1.0;
      chrome.runtime.sendMessage({
        action: 'textToSpeechSelected',
        rate: parseFloat(rate),
        repeat: 2
      });
    });
  }

  const stopSpeech = document.querySelector(".stop-speech");
  if (stopSpeech) {
    stopSpeech.addEventListener("click", () => {
      textToSpeech.classList.remove('selected');
      textToSpeechSelected.classList.remove('selected');
      chrome.runtime.sendMessage({ action: 'stopSpeech' });
    });
  }
  
  // Reset speech button
  const resetSpeech = document.querySelector(".reset-speech");
  if (resetSpeech) {
    resetSpeech.addEventListener("click", () => {
      textToSpeech.classList.remove('selected');
      textToSpeechSelected.classList.remove('selected');
      
      // Reset rate to default
      const rateControl = document.querySelector("#rate");
      if (rateControl) rateControl.value = 1.0;
      
      chrome.runtime.sendMessage({ action: 'stopSpeech' });
    });
  }

  // Link highlighting
  const linkHighlight = document.querySelector(".link");
  if (linkHighlight) {
    linkHighlight.addEventListener("click", () => {
      linkHighlight.classList.add('selected');
      linkBorder.classList.remove('selected');
      removeLinkHighlight.classList.remove('selected');
      chrome.runtime.sendMessage({ action: 'linkHighlight', type: 'highlight' });
    });
  }

  const linkBorder = document.querySelector(".border");
  if (linkBorder) {
    linkBorder.addEventListener("click", () => {
      linkBorder.classList.add('selected');
      linkHighlight.classList.remove('selected');
      removeLinkHighlight.classList.remove('selected');
      chrome.runtime.sendMessage({ action: 'linkHighlight', type: 'border' });
    });
  }

  const removeLinkHighlight = document.querySelector(".remove-link-hg");
  if (removeLinkHighlight) {
    removeLinkHighlight.addEventListener("click", () => {
      removeLinkHighlight.classList.add('selected');
      linkHighlight.classList.remove('selected');
      linkBorder.classList.remove('selected');
      chrome.runtime.sendMessage({ action: 'linkHighlight', type: 'remove' });
    });
  }

  // Reset links button
  const resetLinks = document.querySelector(".reset-links");
  if (resetLinks) {
    resetLinks.addEventListener("click", () => {
      linkHighlight.classList.remove('selected');
      linkBorder.classList.remove('selected');
      removeLinkHighlight.classList.remove('selected');
      chrome.runtime.sendMessage({ action: 'linkHighlight', type: 'remove' });
    });
  }

  // Dark mode
  const modeButtons = document.getElementsByClassName("modes");
  for (const btn of modeButtons) {
    btn.addEventListener("click", () => {
      // Remove selected class from all mode buttons
      Array.from(modeButtons).forEach(b => b.classList.remove('selected'));
      // Add selected class to clicked button
      btn.classList.add('selected');
      
      chrome.runtime.sendMessage({
        action: 'darkMode',
        mode: btn.value
      });
    });
  }
  
  // Reset mode button
  const resetMode = document.querySelector(".reset-mode");
  if (resetMode) {
    resetMode.addEventListener("click", () => {
      // Remove selected class from all mode buttons
      Array.from(modeButtons).forEach(b => b.classList.remove('selected'));
      
      // Reset to light mode and clear any custom styles
      chrome.runtime.sendMessage({
        action: 'darkMode',
        mode: 'light',
        reset: true
      });
    });
  }

  // Paragraph highlighting
  const paraHighlighter = document.querySelector(".para-highlighter");
  if (paraHighlighter) {
    paraHighlighter.addEventListener("click", () => {
      paraHighlighter.classList.add('selected');
      paraHighlighterRemove.classList.remove('selected');
      paraHighlighterBackground.classList.remove('selected');
      paraHighlighterBackgroundRemove.classList.remove('selected');
      chrome.runtime.sendMessage({ 
        action: 'paraHighlighter', 
        type: 'highlight',
        style: 'border: 2px solid #ff0000;'
      });
    });
  }

  const paraHighlighterRemove = document.querySelector(".para-highlighter-remove");
  if (paraHighlighterRemove) {
    paraHighlighterRemove.addEventListener("click", () => {
      paraHighlighterRemove.classList.add('selected');
      paraHighlighter.classList.remove('selected');
      paraHighlighterBackground.classList.remove('selected');
      paraHighlighterBackgroundRemove.classList.remove('selected');
      chrome.runtime.sendMessage({ 
        action: 'paraHighlighter', 
        type: 'remove',
        style: 'none'
      });
    });
  }

  const paraHighlighterBackground = document.querySelector(".para-highlighter-background");
  if (paraHighlighterBackground) {
    paraHighlighterBackground.addEventListener("click", () => {
      paraHighlighterBackground.classList.add('selected');
      paraHighlighter.classList.remove('selected');
      paraHighlighterRemove.classList.remove('selected');
      paraHighlighterBackgroundRemove.classList.remove('selected');
      chrome.runtime.sendMessage({ action: 'paraHighlighter', type: 'background' });
    });
  }

  const paraHighlighterBackgroundRemove = document.querySelector(".para-highlighter-background-remove");
  if (paraHighlighterBackgroundRemove) {
    paraHighlighterBackgroundRemove.addEventListener("click", () => {
      paraHighlighterBackgroundRemove.classList.add('selected');
      paraHighlighter.classList.remove('selected');
      paraHighlighterRemove.classList.remove('selected');
      paraHighlighterBackground.classList.remove('selected');
      chrome.runtime.sendMessage({ action: 'paraHighlighter', type: 'background-remove' });
    });
  }
  
  // Reset paragraphs button
  const resetParagraphs = document.querySelector(".reset-paragraphs");
  if (resetParagraphs) {
    resetParagraphs.addEventListener("click", () => {
      paraHighlighter.classList.remove('selected');
      paraHighlighterRemove.classList.remove('selected');
      paraHighlighterBackground.classList.remove('selected');
      paraHighlighterBackgroundRemove.classList.remove('selected');
      chrome.runtime.sendMessage({ action: 'paraHighlighter', type: 'remove' });
    });
  }

  // Auto scroll
  const autoScrollButtons = document.getElementsByClassName("autoscroll");
  for (const btn of autoScrollButtons) {
    btn.addEventListener("click", () => {
      // Remove selected class from all buttons
      Array.from(autoScrollButtons).forEach(b => b.classList.remove('selected'));
      
      if (btn.id !== 'stop_btn') {
        // Add selected class to clicked button
        btn.classList.add('selected');
      }
      
      const speed = btn.id.replace('_btn', '');
      chrome.runtime.sendMessage({
        action: 'autoScroll',
        speed: speed
      });
    });
  }
  
  // Reset autoscroll button
  const resetAutoScroll = document.querySelector(".reset-autoscroll");
  if (resetAutoScroll) {
    resetAutoScroll.addEventListener("click", () => {
      Array.from(autoScrollButtons).forEach(b => b.classList.remove('selected'));
      chrome.runtime.sendMessage({
        action: 'autoScroll',
        speed: 'stop'
      });
    });
  }

  // Case conversion
  const upperCaseBtn = document.getElementById("upper-case-btn");
  if (upperCaseBtn) {
    upperCaseBtn.addEventListener("click", () => {
      upperCaseBtn.classList.add('selected');
      lowerCaseBtn.classList.remove('selected');
      chrome.runtime.sendMessage({ action: 'convertCase', caseType: 'uppercase' });
    });
  }

  const lowerCaseBtn = document.getElementById("lower-case-btn");
  if (lowerCaseBtn) {
    lowerCaseBtn.addEventListener("click", () => {
      lowerCaseBtn.classList.add('selected');
      upperCaseBtn.classList.remove('selected');
      chrome.runtime.sendMessage({ action: 'convertCase', caseType: 'lowercase' });
    });
  }
  
  // Reset case button
  const resetCase = document.querySelector(".reset-case");
  if (resetCase) {
    resetCase.addEventListener("click", () => {
      upperCaseBtn.classList.remove('selected');
      lowerCaseBtn.classList.remove('selected');
      // No specific reset action needed as the text only changes temporarily
    });
  }

  // Dictionary
  const selectText = document.querySelector(".select-text");
  if (selectText) {
    selectText.addEventListener("click", () => {
      const updateDefinition = document.querySelector(".select-text-definition");
      chrome.runtime.sendMessage({ action: 'selectText' }, function(response) {
        if (response && response.data) {
          const word = response.data.trim();
          const api = "https://api.dictionaryapi.dev/api/v2/entries/en/";
          fetch(api + word)
            .then(result => result.json())
            .then(json => {
              if (json && json[0] && json[0].meanings && json[0].meanings[0] && json[0].meanings[0].definitions) {
                updateDefinition.innerHTML = `<strong>${word}</strong>: ${json[0].meanings[0].definitions[0].definition}`;
              } else {
                updateDefinition.innerHTML = "Word not found!";
              }
            })
            .catch(error => {
              updateDefinition.innerHTML = "Error fetching definition!";
              console.error('Dictionary API error:', error);
            });
        } else {
          updateDefinition.innerHTML = "Please select a word to get its definition!";
        }
      });
    });
  }

  // Preferences
  const savePreferenceBtn = document.getElementById("savePreferenceBtn");
  if (savePreferenceBtn) {
    savePreferenceBtn.addEventListener("click", () => {
      const preferences = {
        fontSize: document.querySelector(".fontSize.selected")?.innerText,
        fontStyle: document.querySelector("#fontChange select")?.value,
        backgroundColor: document.querySelector("#backgroundColorChanger input")?.value,
        fontColor: document.querySelector("#fontColorChanger input")?.value,
        zoomVal: document.getElementById("magni")?.value + "%"
      };
      chrome.runtime.sendMessage({
        action: 'savePreferences',
        preferences: preferences
      });
    });
  }

  const clearPreferenceBtn = document.getElementById("clearPreferenceBtn");
  if (clearPreferenceBtn) {
    clearPreferenceBtn.addEventListener("click", () => {
      chrome.runtime.sendMessage({ action: 'clearPreferences' });
    });
  }

  // Load saved preferences
  chrome.runtime.sendMessage({ action: 'getPreferences' }, (preferences) => {
    if (preferences) {
      // Apply saved preferences
      if (preferences.fontSize) {
        document.querySelector(`.fontSize[innerText="${preferences.fontSize}"]`)?.click();
      }
      if (preferences.fontStyle) {
        document.querySelector("#fontChange select").value = preferences.fontStyle;
      }
      if (preferences.backgroundColor) {
        document.querySelector("#backgroundColorChanger input").value = preferences.backgroundColor;
      }
      if (preferences.fontColor) {
        document.querySelector("#fontColorChanger input").value = preferences.fontColor;
      }
      if (preferences.zoomVal) {
        const zoomValue = document.getElementById("magni");
        const showZoomValue = document.getElementsByClassName("show-zoom-value");
        if (zoomValue && showZoomValue[0]) {
          zoomValue.value = parseInt(preferences.zoomVal);
          showZoomValue[0].innerText = preferences.zoomVal;
        }
      }
    }
  });

  // Theme toggle
  const checkbox = document.getElementById("checkbox");
  if (checkbox) {
    checkbox.addEventListener("click", () => {
      document.body.classList.toggle("dark-mode");
    });
  }

  // Magnifier functionality
  const magniInput = document.getElementById("magni");
  const showZoomValue = document.querySelector(".show-zoom-value");
  const magniInc = document.getElementById("magni-inc");
  const magniDec = document.getElementById("magni-dec");
  const resetZoom = document.getElementById("resetZoom");

  // Update zoom value display and send message to content script
  function updateZoomValue() {
    const zoomValue = magniInput.value;
    showZoomValue.innerText = zoomValue + "%";
    chrome.runtime.sendMessage({ 
      action: 'zoomPage', 
      zoomValue: zoomValue / 100 
    });
  }

  if (magniInput) {
    magniInput.addEventListener("input", updateZoomValue);
  }

  if (magniInc) {
    magniInc.addEventListener("click", () => {
      const currentValue = parseInt(magniInput.value);
      if (currentValue < 250) {
        magniInput.value = currentValue + 10;
        updateZoomValue();
      }
    });
  }

  if (magniDec) {
    magniDec.addEventListener("click", () => {
      const currentValue = parseInt(magniInput.value);
      if (currentValue > 30) {
        magniInput.value = currentValue - 10;
        updateZoomValue();
      }
    });
  }

  if (resetZoom) {
    resetZoom.addEventListener("click", () => {
      magniInput.value = 100;
      updateZoomValue();
    });
  }

  // Speaker helper
  const speakerHelper = document.getElementsByClassName("speaker");
  const wordArray = [
    "TOGGLE THEME",
    "Octo is an extension developed to make the web more accessible to people with dyslexia and color blindness. Octo allows you to change colors, add and remove images, read out pages etc.",
    "PREFERENCES",
    "FONT SIZE",
    "FONT STYLE",
    "IMAGES",
    "LISTEN TO WEB PAGE",
    "PARAGRAPHS",
    "LINKS",
    "COLORS",
    "DICTIONARY",
    "TRANSLATE",
    "MAGNIFIER",
    "REMOVE EMPHASIS",
    "CASE CONVERTER"
  ];

  for (let i = 0; i < speakerHelper.length; i++) {
    speakerHelper[i].addEventListener("click", () => {
      const utter = new SpeechSynthesisUtterance(wordArray[i]);
      utter.lang = "en-US";
      utter.volume = 0.5;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utter);
    });
  }

  // Color changers
  const backgroundColorChanger = document.getElementById("backgroundColorChanger");
  if (backgroundColorChanger) {
    backgroundColorChanger.addEventListener("submit", (e) => {
      e.preventDefault();
      const color = backgroundColorChanger.querySelector("input[name='color']").value;
      chrome.runtime.sendMessage({
        action: 'backgroundColor',
        color: color
      });
    });
  }

  const fontColorChanger = document.getElementById("fontColorChanger");
  if (fontColorChanger) {
    fontColorChanger.addEventListener("submit", (e) => {
      e.preventDefault();
      const color = fontColorChanger.querySelector("input[name='color']").value;
      chrome.runtime.sendMessage({
        action: 'fontColor',
        color: color
      });
    });
  }

  const revertBackgroundColor = document.querySelector(".revert-background-color");
  if (revertBackgroundColor) {
    revertBackgroundColor.addEventListener("click", () => {
      chrome.runtime.sendMessage({
        action: 'backgroundColor',
        color: 'initial'
      });
    });
  }

  const revertFontColor = document.querySelector(".revert-Font-color");
  if (revertFontColor) {
    revertFontColor.addEventListener("click", () => {
      chrome.runtime.sendMessage({
        action: 'fontColor',
        color: 'initial'
      });
    });
  }

  // Remove emphasis buttons
  const removeItalics = document.querySelector(".remove-italics");
  if (removeItalics) {
    removeItalics.addEventListener("click", () => {
      removeItalics.classList.add('selected');
      setTimeout(() => removeItalics.classList.remove('selected'), 1000);
      chrome.runtime.sendMessage({ action: 'italicsRemove' });
    });
  }

  const removeUnderscore = document.querySelector(".remove-underscore");
  if (removeUnderscore) {
    removeUnderscore.addEventListener("click", () => {
      removeUnderscore.classList.add('selected');
      setTimeout(() => removeUnderscore.classList.remove('selected'), 1000);
      chrome.runtime.sendMessage({ action: 'underscoreRemove' });
    });
  }

  const resetItalicsUnderscore = document.querySelector(".reset-italics-and-underscore");
  if (resetItalicsUnderscore) {
    resetItalicsUnderscore.addEventListener("click", () => {
      removeItalics.classList.remove('selected');
      removeUnderscore.classList.remove('selected');
      chrome.runtime.sendMessage({ action: 'resetItalicsUnderscore' });
    });
  }

  // Translation language selection
  const sourceLanguage = document.getElementById("sourceLanguage");
  const targetLanguage = document.getElementById("targetLanguage");
  
  if (sourceLanguage && targetLanguage) {
    sourceLanguage.addEventListener("change", () => {
      chrome.storage.local.set({ sourceLanguage: sourceLanguage.value });
    });
    
    targetLanguage.addEventListener("change", () => {
      chrome.storage.local.set({ targetLanguage: targetLanguage.value });
    });
    
    // Load saved language preferences
    chrome.storage.local.get(['sourceLanguage', 'targetLanguage'], (result) => {
      if (result.sourceLanguage) {
        sourceLanguage.value = result.sourceLanguage;
      }
      if (result.targetLanguage) {
        targetLanguage.value = result.targetLanguage;
      }
    });
  }
}); 