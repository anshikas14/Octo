// Initialize preferences object
let Preference = {};

// Service worker installation
self.addEventListener('install', (event) => {
  console.log('Service Worker installed');
});

// Service worker activation
self.addEventListener('activate', (event) => {
  console.log('Service Worker activated');
  // Load saved preferences when service worker starts
  chrome.storage.local.get(['octoPreferences'], function(result) {
    if (result.octoPreferences) {
      Preference = result.octoPreferences;
    }
  });
});

// Error handling wrapper for chrome.tabs.query
async function queryActiveTab() {
  try {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    return tabs[0];
  } catch (error) {
    console.error('Error querying active tab:', error);
    return null;
  }
}

// Error handling wrapper for sending messages
async function sendMessageToTab(tabId, message) {
  if (!tabId) {
    console.warn('Cannot send message: Tab ID is missing or invalid');
    return;
  }
  
  try {
    // Check if the tab exists first
    const tab = await chrome.tabs.get(tabId).catch(() => null);
    if (!tab) {
      console.warn(`Tab with ID ${tabId} no longer exists`);
      return;
    }
    
    // Check if we can send message to this tab (it must be a supported URL)
    if (!tab.url || !/^(http|https):\/\//.test(tab.url)) {
      console.warn(`Cannot send message to tab with URL: ${tab.url}`);
      return;
    }
    
    // Try to send the message
    await chrome.tabs.sendMessage(tabId, message).catch(error => {
      // This specific error usually means the content script is not yet loaded
      if (error.message.includes("Could not establish connection")) {
        console.warn(`Content script not ready in tab ${tabId}`);
      } else {
        throw error; // Re-throw other errors to be caught by the outer catch
      }
    });
  } catch (error) {
    console.error('Error sending message to tab:', error);
  }
}

// Handle messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.action) {
    case 'getPreferences':
      sendResponse(Preference);
      break;

    case 'fontSize':
      handleFontSize(request.fontSize);
      break;

    case 'fontStyle':
      handleFontStyle(request.fontStyle, request.fontFamily);
      break;

    case 'image':
      handleImage(request.show);
      break;

    case 'textToSpeech':
      handleTextToSpeech(request.rate);
      break;

    case 'stopSpeech':
      handleStopSpeech();
      break;

    case 'linkHighlight':
      handleLinkHighlight(request.type);
      break;

    case 'backgroundColor':
      handleBackgroundColor(request.color);
      break;

    case 'fontColor':
      handleFontColor(request.color);
      break;

    case 'darkMode':
      handleDarkMode(request.mode, request.reset);
      break;

    case 'autoScroll':
      handleAutoScroll(request.speed);
      break;

    case 'savePreferences':
      savePreference(request.preferences);
      break;

    case 'clearPreferences':
      clearPreference();
      break;

    case 'textToSpeechSelected':
      handleTextToSpeechSelected(request.rate, request.repeat);
      break;

    case 'imageReader':
      handleImageReader();
      break;

    case 'paraHighlighter':
      handleParaHighlighter(request.type);
      break;

    case 'zoomPage':
      handleZoomPage(request.zoomValue);
      break;

    case 'italicsRemove':
      handleItalicsRemove();
      break;

    case 'underscoreRemove':
      handleUnderscoreRemove();
      break;

    case 'resetItalicsUnderscore':
      handleResetItalicsUnderscore();
      break;

    case 'convertCase':
      handleConvertCase(request.caseType);
      break;

    case 'selectText':
      handleSelectText(sendResponse);
      break;

    case 'stopImageReader':
      handleStopImageReader();
      break;

    case 'italicsRemove':
      handleItalicsRemove();
      break;

    case 'underscoreRemove':
      handleUnderscoreRemove();
      break;

    case 'resetItalicsUnderscore':
      handleResetItalicsUnderscore();
      break;
  }
  return true;
});

// Font size handler
async function handleFontSize(size) {
  Preference.fontSize = size;
  const tab = await queryActiveTab();
  if (tab) {
    await sendMessageToTab(tab.id, {
      action: "fontSize",
      fontSize: size
    });
  }
}

// Font style handler
async function handleFontStyle(style, family) {
  Preference.fontStyle = style;
  const tab = await queryActiveTab();
  if (tab) {
    await sendMessageToTab(tab.id, {
      action: "fontStyle",
      fontStyle: style,
      fontFamily: family
    });
  }
}

// Image handler
async function handleImage(show) {
  Preference.image = show;
  const tab = await queryActiveTab();
  if (tab) {
    await sendMessageToTab(tab.id, {
      action: show ? "imageAdd" : "image"
    });
  }
}

// Text to speech handler
async function handleTextToSpeech(rate) {
  const tab = await queryActiveTab();
  if (tab) {
    await sendMessageToTab(tab.id, {
      action: "text-to-speech",
      rate: rate
    });
  }
}

// Text to speech selected handler
async function handleTextToSpeechSelected(rate, repeat) {
  const tab = await queryActiveTab();
  if (tab) {
    await sendMessageToTab(tab.id, {
      action: "text-to-speech-selected",
      rate: rate,
      repeat: repeat
    });
  }
}

// Stop speech handler
async function handleStopSpeech() {
  const tab = await queryActiveTab();
  if (tab) {
    await sendMessageToTab(tab.id, {
      action: "stop-speech"
    });
  }
}

// Link highlight handler
async function handleLinkHighlight(type) {
  const tab = await queryActiveTab();
  if (tab) {
    await sendMessageToTab(tab.id, {
      action: type === 'highlight' ? "link-highlight" : 
              type === 'border' ? "link-border-highlight" : 
              "link-highlight-remove",
      preserveStyles: true
    });
  }
}

// Background color handler
async function handleBackgroundColor(color) {
  Preference.backgroundColor = color;
  const tab = await queryActiveTab();
  if (tab) {
    await sendMessageToTab(tab.id, {
      action: "backgroundColor",
      backgroundColor: color
    });
  }
}

// Font color handler
async function handleFontColor(color) {
  Preference.fontColor = color;
  const tab = await queryActiveTab();
  if (tab) {
    await sendMessageToTab(tab.id, {
      action: "fontColor",
      fontColor: color
    });
  }
}

// Dark mode handler
async function handleDarkMode(mode, reset = false) {
  const tab = await queryActiveTab();
  if (tab) {
    await sendMessageToTab(tab.id, {
      action: "light-on-darkmode",
      modevalue: mode,
      reset: reset
    });
  }
}

// Auto scroll handler
async function handleAutoScroll(speed) {
  const tab = await queryActiveTab();
  if (tab) {
    await sendMessageToTab(tab.id, {
      action: "autoscroll",
      speed: speed
    });
  }
}

// Image reader handler
async function handleImageReader() {
  const tab = await queryActiveTab();
  if (tab) {
    await sendMessageToTab(tab.id, {
      action: "image-reader"
    });
  }
}

// Paragraph highlighter handler
async function handleParaHighlighter(type) {
  const tab = await queryActiveTab();
  if (tab) {
    await sendMessageToTab(tab.id, {
      action: type === 'highlight' ? "para-highlighter" :
              type === 'background' ? "para-highlighter-background" :
              type === 'remove' ? "para-highlighter-remove" :
              "para-highlighter-background-remove",
      preserveStyles: true
    });
  }
}

// Zoom page handler
async function handleZoomPage(zoomValue) {
  Preference.zoomVal = zoomValue;
  const tab = await queryActiveTab();
  if (tab) {
    await sendMessageToTab(tab.id, {
      action: "zoomPage",
      zoomValue: zoomValue
    });
  }
}

// Italics remove handler
async function handleItalicsRemove() {
  const tab = await queryActiveTab();
  if (tab) {
    await sendMessageToTab(tab.id, {
      action: "italics-remove"
    });
  }
}

// Underscore remove handler
async function handleUnderscoreRemove() {
  const tab = await queryActiveTab();
  if (tab) {
    await sendMessageToTab(tab.id, {
      action: "underscore-remove"
    });
  }
}

// Reset italics and underscore handler
async function handleResetItalicsUnderscore() {
  const tab = await queryActiveTab();
  if (tab) {
    await sendMessageToTab(tab.id, {
      action: "reset_italics_underscore"
    });
  }
}

// Convert case handler
async function handleConvertCase(caseType) {
  const tab = await queryActiveTab();
  if (tab) {
    await sendMessageToTab(tab.id, {
      action: "convertCase",
      caseType: caseType,
      preserveStyles: true
    });
  }
}

// Select text handler
async function handleSelectText(sendResponse) {
  const tab = await queryActiveTab();
  if (tab) {
    await sendMessageToTab(tab.id, {
      action: "select-text"
    }, sendResponse);
  }
}

// Stop image reader handler
async function handleStopImageReader() {
  const tab = await queryActiveTab();
  if (tab) {
    await sendMessageToTab(tab.id, {
      action: "stop-image-reader"
    });
  }
}

// Save preferences
async function savePreference(preferences) {
  try {
    Preference = { ...Preference, ...preferences };
    await chrome.storage.local.set({ 'octoPreferences': Preference });
    console.log('Preferences saved successfully');
    return true;
  } catch (error) {
    console.error('Error saving preferences:', error);
    return false;
  }
}

// Clear preferences
async function clearPreference() {
  try {
    Preference = {};
    await chrome.storage.local.remove('octoPreferences');
    console.log('Preferences cleared successfully');
    return true;
  } catch (error) {
    console.error('Error clearing preferences:', error);
    return false;
  }
}
