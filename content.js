// Utility function for setting style properties
function setStyleProperty(element, property, value) {
  if (element && element.style) {
    element.style.setProperty(property, value, 'important');
  }
}

// Auto scroll functionality
let scrollInterval = null;

function startAutoScroll(speed) {
  if (scrollInterval) {
    clearInterval(scrollInterval);
  }

  const interval = speed === 'slow' ? 15 : speed === 'medium' ? 10 : 5;
  const scrollAmount = speed === 'slow' ? 1 : speed === 'medium' ? 2 : 3;

  scrollInterval = setInterval(() => {
    window.scrollBy(0, scrollAmount);
    
    // Stop scrolling when reaching the bottom
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
      clearInterval(scrollInterval);
    }
  }, interval);
}

function stopAutoScroll() {
  if (scrollInterval) {
    clearInterval(scrollInterval);
    scrollInterval = null;
  }
}

// Text-to-speech functionality
let speechUtterance = null;

function speakText(text, rate = 1.0) {
  if (window.speechSynthesis) {
    // Stop any current speech
    window.speechSynthesis.cancel();
    
    speechUtterance = new SpeechSynthesisUtterance(text);
    speechUtterance.rate = rate;
    window.speechSynthesis.speak(speechUtterance);
  }
}

function speakPageContent(rate) {
  const pageText = document.body.innerText;
  speakText(pageText, rate);
}

function speakSelectedText(rate, repeat = 1) {
  const selection = window.getSelection();
  if (selection && selection.toString().trim() !== '') {
    speakText(selection.toString(), rate);
  }
}

function stopSpeech() {
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
}

// Font size functionality
function changeFontSize(size) {
  const sizeValue = size === 'Default' ? '16px' : size;
  document.body.style.fontSize = sizeValue;
}

// Font style functionality
function changeFontStyle(fontFamily) {
  if (fontFamily) {
    document.body.style.fontFamily = fontFamily;
  } else {
    document.body.style.removeProperty('font-family');
  }
}

// Image functionality
function toggleImages(show) {
  const images = document.querySelectorAll('img');
  images.forEach(img => {
    img.style.display = show ? 'inline' : 'none';
  });
}

// Link highlighting functionality
let originalLinkStyles = new Map();

function highlightLinks(type) {
  const links = document.querySelectorAll('a');
  
  // Save original styles if not already saved
  if (originalLinkStyles.size === 0) {
    links.forEach(link => {
      originalLinkStyles.set(link, {
        backgroundColor: link.style.backgroundColor,
        border: link.style.border,
        color: link.style.color
      });
    });
  }
  
  links.forEach(link => {
    if (type === 'highlight') {
      link.style.backgroundColor = 'yellow';
      link.style.color = 'black';
    } else if (type === 'border') {
      link.style.border = '2px solid red';
    } else if (type === 'remove') {
      // Restore original styles
      const originalStyle = originalLinkStyles.get(link);
      if (originalStyle) {
        link.style.backgroundColor = originalStyle.backgroundColor;
        link.style.border = originalStyle.border;
        link.style.color = originalStyle.color;
      } else {
        link.style.removeProperty('background-color');
        link.style.removeProperty('border');
        link.style.removeProperty('color');
      }
    }
  });
}

// Background color functionality
let originalBackgroundColor = null;

function changeBackgroundColor(color) {
  if (!originalBackgroundColor) {
    originalBackgroundColor = document.body.style.backgroundColor || getComputedStyle(document.body).backgroundColor;
  }
  
  if (color === 'initial' || color === 'revert') {
    document.body.style.backgroundColor = originalBackgroundColor || '';
  } else if (color) {
    document.body.style.backgroundColor = color;
  }
}

// Font color functionality
let originalFontColor = null;

function changeFontColor(color) {
  if (!originalFontColor) {
    originalFontColor = document.body.style.color || getComputedStyle(document.body).color;
  }
  
  if (color === 'initial' || color === 'revert') {
    document.body.style.color = originalFontColor || '';
  } else if (color) {
    document.body.style.color = color;
  }
}

// Dark mode functionality
let originalBodyStyles = null;

function toggleDarkMode(mode, reset = false) {
  // Save original styles if not already saved
  if (!originalBodyStyles) {
    originalBodyStyles = {
      backgroundColor: document.body.style.backgroundColor || getComputedStyle(document.body).backgroundColor,
      color: document.body.style.color || getComputedStyle(document.body).color
    };
  }
  
  if (reset) {
    // Reset to original styles
    document.body.style.backgroundColor = originalBodyStyles.backgroundColor;
    document.body.style.color = originalBodyStyles.color;
    return;
  }
  
  if (mode === 'dark') {
    document.body.style.backgroundColor = '#121212';
    document.body.style.color = '#ffffff';
  } else if (mode === 'light') {
    document.body.style.backgroundColor = '#ffffff';
    document.body.style.color = '#000000';
  }
}

// Image reader functionality
function readImages() {
  const images = document.querySelectorAll('img[alt]');
  let altTexts = [];
  
  images.forEach(img => {
    if (img.alt && img.alt.trim() !== '') {
      altTexts.push(img.alt);
    }
  });
  
  if (altTexts.length > 0) {
    speakText("Image descriptions: " + altTexts.join(". Next image: "));
  } else {
    speakText("No image descriptions found on this page");
  }
}

// Paragraph highlighting functionality
let originalParagraphStyles = new Map();

function highlightParagraphs(type) {
  const paragraphs = document.querySelectorAll('p');
  
  // Save original styles if not already saved
  if (originalParagraphStyles.size === 0) {
    paragraphs.forEach(p => {
      originalParagraphStyles.set(p, {
        backgroundColor: p.style.backgroundColor,
        color: p.style.color
      });
    });
  }
  
  paragraphs.forEach(p => {
    if (type === 'highlight') {
      p.style.color = 'black';
      p.style.backgroundColor = 'yellow';
    } else if (type === 'background') {
      p.style.backgroundColor = 'lightblue';
    } else if (type === 'remove') {
      const originalStyle = originalParagraphStyles.get(p);
      if (originalStyle) {
        p.style.color = originalStyle.color;
        p.style.removeProperty('background-color');
      } else {
        p.style.removeProperty('color');
        p.style.removeProperty('background-color');
      }
    } else if (type === 'background-remove') {
      const originalStyle = originalParagraphStyles.get(p);
      if (originalStyle) {
        p.style.backgroundColor = originalStyle.backgroundColor;
      } else {
        p.style.removeProperty('background-color');
      }
    }
  });
}

// Zoom page functionality
function zoomPage(zoomValue) {
  document.body.style.zoom = zoomValue;
}

// Remove italics functionality
let italicElements = [];

function removeItalics() {
  const elements = document.querySelectorAll('i, em, *[style*="italic"]');
  
  elements.forEach(el => {
    if (el.style.fontStyle === 'italic') {
      italicElements.push({
        element: el,
        originalStyle: el.style.fontStyle
      });
      el.style.fontStyle = 'normal';
    } else if (el.tagName.toLowerCase() === 'i' || el.tagName.toLowerCase() === 'em') {
      italicElements.push({
        element: el,
        originalHtml: el.outerHTML
      });
      el.outerHTML = el.innerHTML;
    }
  });
}

// Remove underscore functionality
let underscoreElements = [];

function removeUnderscore() {
  const elements = document.querySelectorAll('u, *[style*="underline"]');
  
  elements.forEach(el => {
    if (el.style.textDecoration === 'underline') {
      underscoreElements.push({
        element: el,
        originalStyle: el.style.textDecoration
      });
      el.style.textDecoration = 'none';
    } else if (el.tagName.toLowerCase() === 'u') {
      underscoreElements.push({
        element: el,
        originalHtml: el.outerHTML
      });
      el.outerHTML = el.innerHTML;
    }
  });
}

// Reset italics and underscore functionality
function resetItalicsUnderscore() {
  // This is a simplified version as we cannot really restore the original elements
  // But we can reload the page to reset everything
  window.location.reload();
}

// Convert case functionality
function convertCase(caseType) {
  const textNodes = [];
  
  function getTextNodes(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      textNodes.push(node);
    } else {
      for (let i = 0; i < node.childNodes.length; i++) {
        getTextNodes(node.childNodes[i]);
      }
    }
  }
  
  getTextNodes(document.body);
  
  textNodes.forEach(textNode => {
    if (textNode.nodeValue && textNode.nodeValue.trim() !== '') {
      if (caseType === 'uppercase') {
        textNode.nodeValue = textNode.nodeValue.toUpperCase();
      } else if (caseType === 'lowercase') {
        textNode.nodeValue = textNode.nodeValue.toLowerCase();
      }
    }
  });
}

// Select text functionality
function getSelectedText(sendResponse) {
  const selection = window.getSelection();
  if (selection && selection.toString().trim() !== '') {
    sendResponse({ data: selection.toString() });
  } else {
    sendResponse({ data: null });
  }
}

// Message listener for all functionalities
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // Auto-scroll handler
  if (request.action === 'autoscroll') {
    if (request.speed === 'stop') {
      stopAutoScroll();
    } else {
      startAutoScroll(request.speed);
    }
  }
  
  // Font size handler
  else if (request.action === 'fontSize') {
    const fontSizeHtml = document.querySelector("html");
    if (fontSizeHtml) {
      setStyleProperty(fontSizeHtml, "font-size", request.fontSize);
      // Also apply to body to increase specificity
      const body = document.querySelector("body");
      if (body) {
        setStyleProperty(body, "font-size", request.fontSize);
      }
      // Apply to all text elements for better coverage
      const textElements = document.querySelectorAll("p, h1, h2, h3, h4, h5, h6, span, div, a, li");
      for (const element of textElements) {
        setStyleProperty(element, "font-size", request.fontSize);
      }
    }
  }
  
  // Font style handler
  else if (request.action === 'fontStyle') {
    const body = document.querySelector("body");
    if (body && request.fontFamily) {
      setStyleProperty(body, "font-family", request.fontFamily);
      // Apply to all text elements for better coverage
      const textElements = document.querySelectorAll("p, h1, h2, h3, h4, h5, h6, span, div, a, li");
      for (const element of textElements) {
        setStyleProperty(element, "font-family", request.fontFamily);
      }
    }
  }
  
  // Image handlers
  else if (request.action === 'image') {
    toggleImages(false);
  }
  else if (request.action === 'imageAdd') {
    toggleImages(true);
  }
  
  // Text-to-speech handlers
  else if (request.action === 'text-to-speech') {
    speakPageContent(request.rate);
  }
  else if (request.action === 'text-to-speech-selected') {
    speakSelectedText(request.rate, request.repeat);
  }
  else if (request.action === 'stop-speech') {
    stopSpeech();
  }
  
  // Link highlight handlers
  else if (request.action === 'link-highlight') {
    highlightLinks('highlight');
  }
  else if (request.action === 'link-border-highlight') {
    highlightLinks('border');
  }
  else if (request.action === 'link-highlight-remove') {
    highlightLinks('remove');
  }
  
  // Background color handler
  else if (request.action === 'backgroundColor') {
    changeBackgroundColor(request.backgroundColor);
  }
  
  // Font color handler
  else if (request.action === 'fontColor') {
    changeFontColor(request.fontColor);
  }
  
  // Image reader handler
  else if (request.action === 'image-reader') {
    readImages();
  }
  
  // Stop image reader handler
  else if (request.action === 'stop-image-reader') {
    stopSpeech();
  }
  
  // Paragraph highlighter handlers
  else if (request.action === 'para-highlighter') {
    highlightParagraphs('highlight');
  }
  else if (request.action === 'para-highlighter-background') {
    highlightParagraphs('background');
  }
  else if (request.action === 'para-highlighter-remove') {
    highlightParagraphs('remove');
  }
  else if (request.action === 'para-highlighter-background-remove') {
    highlightParagraphs('background-remove');
  }
  
  // Zoom page handler
  else if (request.action === 'zoomPage') {
    zoomPage(request.zoomValue);
  }
  
  // Italics remove handler
  else if (request.action === 'italics-remove') {
    removeItalics();
  }
  
  // Underscore remove handler
  else if (request.action === 'underscore-remove') {
    removeUnderscore();
  }
  
  // Reset italics and underscore handler
  else if (request.action === 'reset_italics_underscore') {
    resetItalicsUnderscore();
  }
  
  // Convert case handler
  else if (request.action === 'convertCase') {
    convertCase(request.caseType);
  }
  
  // Select text handler
  else if (request.action === 'select-text') {
    getSelectedText(sendResponse);
    return true; // Needed for async response
  }
  
  // Return true if using sendResponse asynchronously
  if (request.action === 'select-text') {
    return true;
  }
}); 