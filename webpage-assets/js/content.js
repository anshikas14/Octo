const synth = window.speechSynthesis;
let backColor = "";
let fontColor = "";
let originalLineHeight = 1;
let scrollerID = null;
let originalLinkStyles = new Map();
let originalParagraphStyles = new Map();
let italicElements = [];
let underscoreElements = [];

// Utility function to safely get elements
function getElements(tagName) {
  try {
    return document.getElementsByTagName(tagName);
  } catch (error) {
    console.error(`Error getting ${tagName} elements:`, error);
    return [];
  }
}

// Utility function to safely set style properties
function setStyleProperty(element, property, value) {
  try {
    element.style.setProperty(property, value);
  } catch (error) {
    console.error(`Error setting ${property}:`, error);
  }
}

// Scroll handling
function startScroll(interval) {
  if (scrollerID) {
    stopScroll();
  }
  
  scrollerID = setInterval(() => {
    try {
      window.scrollBy(0, 2);
      if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
        stopScroll();
      }
    } catch (error) {
      console.error('Error during scrolling:', error);
      stopScroll();
    }
  }, interval);
}

function stopScroll() {
  if (scrollerID) {
    clearInterval(scrollerID);
    scrollerID = null;
  }
}

// Auto scroll functionality with speed control
function startAutoScroll(speed) {
  // Clear any existing scroll interval
  if (scrollerID) {
    stopScroll();
  }

  // Set scroll parameters based on speed
  let interval, scrollAmount;
  
  switch(speed) {
    case 'slow':
      interval = 50;
      scrollAmount = 1;
      break;
    case 'medium':
      interval = 30;
      scrollAmount = 2;
      break;
    case 'fast':
      interval = 10;
      scrollAmount = 4;
      break;
    default:
      interval = 30;
      scrollAmount = 2;
  }

  // Log for debugging
  console.log(`Starting autoscroll with speed: ${speed}, interval: ${interval}ms, amount: ${scrollAmount}px`);
  
  // Set up the interval for scrolling
  scrollerID = setInterval(() => {
    window.scrollBy(0, scrollAmount);
    
    // Stop scrolling when reaching the bottom
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 10) {
      console.log("Reached bottom of page, stopping autoscroll");
      stopScroll();
    }
  }, interval);
}

// Paragraph highlighting functionality
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
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      // Skip script and style elements
      if (node.tagName !== 'SCRIPT' && node.tagName !== 'STYLE') {
        for (let i = 0; i < node.childNodes.length; i++) {
          getTextNodes(node.childNodes[i]);
        }
      }
    }
  }
  
  // Start from body to get all text nodes
  getTextNodes(document.body);
  
  // Apply the case transformation to each text node
  textNodes.forEach(textNode => {
    if (textNode.nodeValue && textNode.nodeValue.trim() !== '') {
      if (caseType === 'uppercase') {
        textNode.nodeValue = textNode.nodeValue.toUpperCase();
      } else if (caseType === 'lowercase') {
        textNode.nodeValue = textNode.nodeValue.toLowerCase();
      }
    }
  });
  
  // Log completion for debugging
  console.log(`Case conversion to ${caseType} applied to ${textNodes.length} text nodes`);
}

// Read images functionality
function readImages() {
  const images = document.querySelectorAll('img[alt]');
  let altTexts = [];
  
  images.forEach(img => {
    if (img.alt && img.alt.trim() !== '') {
      altTexts.push(img.alt);
    }
  });
  
  if (altTexts.length > 0) {
    const msg = new SpeechSynthesisUtterance("Image descriptions: " + altTexts.join(". Next image: "));
    synth.speak(msg);
  } else {
    const msg = new SpeechSynthesisUtterance("No image descriptions found on this page");
    synth.speak(msg);
  }
}

// Function to inject global CSS styles
function injectGlobalCSS(cssRules) {
  try {
    // Remove any previous style element with our ID
    const existingStyle = document.getElementById('octo-injected-styles');
    if (existingStyle) {
      existingStyle.remove();
    }
    
    // Create a new style element
    const style = document.createElement('style');
    style.id = 'octo-injected-styles';
    style.textContent = cssRules;
    document.head.appendChild(style);
  } catch (error) {
    console.error('Error injecting global CSS:', error);
  }
}

// Set global font size for the page
function setGlobalFontSize(fontSize) {
  const css = `
    html, body, p, h1, h2, h3, h4, h5, h6, span, div, a, li, td, th, button, input, select, textarea {
      font-size: ${fontSize} !important;
    }
  `;
  injectGlobalCSS(css);
}

// Set global font family for the page
function setGlobalFontFamily(fontFamily) {
  const css = `
    html, body, p, h1, h2, h3, h4, h5, h6, span, div, a, li, td, th, button, input, select, textarea {
      font-family: ${fontFamily} !important;
    }
  `;
  injectGlobalCSS(css);
}

// Message handling
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  try {
    const action = request.action;
    
    switch (action) {
      case "fontSize":
        // Set global font size using CSS injection
        setGlobalFontSize(request.fontSize);
        break;

      case "fontStyle":
        // Set global font family using CSS injection
        if (request.fontFamily) {
          setGlobalFontFamily(request.fontFamily);
        }
        break;

      case "image":
        const images = getElements("img");
        for (const img of images) {
          setStyleProperty(img, "display", "none");
        }
        break;

      case "imageAdd":
        const imagesToShow = getElements("img");
        for (const img of imagesToShow) {
          setStyleProperty(img, "display", "block");
        }
        break;

      case "text-to-speech":
        if (synth.speaking) {
          synth.cancel();
        }
        const text = document.body?.innerText || "";
        const msg = new SpeechSynthesisUtterance(text);
        msg.rate = parseFloat(request.rate) || 1.0;
        synth.speak(msg);
        break;

      case "text-to-speech-selected":
        if (synth.speaking) {
          synth.cancel();
        }
        const selection = window.getSelection()?.toString() || "";
        if (selection) {
          const msg = new SpeechSynthesisUtterance(selection);
          msg.rate = parseFloat(request.rate) || 1.0;
          synth.speak(msg);
        }
        break;

      case "stop-speech":
        if (synth.speaking) {
          synth.cancel();
        }
        break;

      case "link-highlight":
        const links = getElements("a");
        for (const link of links) {
          // Save original styles if not already saved
          if (!originalLinkStyles.has(link)) {
            originalLinkStyles.set(link, {
              backgroundColor: link.style.backgroundColor,
              fontSize: link.style.fontSize,
              border: link.style.border,
              color: link.style.color
            });
          }
          setStyleProperty(link, "background-color", "yellow");
          setStyleProperty(link, "color", "black");
        }
        break;

      case "link-border-highlight":
        const borderedLinks = getElements("a");
        for (const link of borderedLinks) {
          // Save original styles if not already saved
          if (!originalLinkStyles.has(link)) {
            originalLinkStyles.set(link, {
              backgroundColor: link.style.backgroundColor,
              fontSize: link.style.fontSize,
              border: link.style.border,
              color: link.style.color
            });
          }
          setStyleProperty(link, "border", "2px solid red");
        }
        break;

      case "link-highlight-remove":
        const linksToReset = getElements("a");
        for (const link of linksToReset) {
          // Restore original styles
          const originalStyle = originalLinkStyles.get(link);
          if (originalStyle) {
            setStyleProperty(link, "background-color", originalStyle.backgroundColor);
            setStyleProperty(link, "font-size", originalStyle.fontSize);
            setStyleProperty(link, "border", originalStyle.border);
            setStyleProperty(link, "color", originalStyle.color);
          } else {
            setStyleProperty(link, "background-color", "transparent");
            setStyleProperty(link, "font-size", "");
            setStyleProperty(link, "border", "none");
            setStyleProperty(link, "color", "");
          }
        }
        break;

      case "image-reader":
        readImages();
        break;

      case "light-on-darkmode":
        const darkModeHtml = document.querySelector("html");
        const media = document.querySelectorAll("img, picture, video");
        
        if (request.modevalue === "dark") {
          setStyleProperty(darkModeHtml, "filter", "invert(1) hue-rotate(180deg)");
          media.forEach(item => {
            setStyleProperty(item, "filter", "invert(1) hue-rotate(180deg)");
          });
        } else if (request.modevalue === "light") {
          setStyleProperty(darkModeHtml, "filter", "invert(0) hue-rotate(0deg)");
          media.forEach(item => {
            setStyleProperty(item, "filter", "invert(0) hue-rotate(0deg)");
          });
        } else if (request.modevalue === "sepia") {
          setStyleProperty(document.body, "background-color", "#f4ecd8");
          setStyleProperty(document.body, "color", "#5b4636");
        }
        break;

      case "backgroundColor":
        const bgColorBody = document.querySelector("body");
        if (bgColorBody) {
          if (!backColor) {
            backColor = bgColorBody.style.backgroundColor;
          }
          setStyleProperty(bgColorBody, "background-color", request.backgroundColor);
        }
        break;

      case "revert-background-color":
        const bodyToRevert = document.querySelector("body");
        if (bodyToRevert) {
          setStyleProperty(bodyToRevert, "background-color", backColor);
        }
        break;

      case "fontColor":
        const allElements = getElements("*");
        if (!fontColor && allElements.length > 0) {
          fontColor = allElements[0].style.color;
        }
        for (const element of allElements) {
          setStyleProperty(element, "color", request.fontColor);
        }
        break;

      case "revert-Font-color":
        const firstElement = document.querySelector("*");
        if (firstElement) {
          setStyleProperty(firstElement, "color", fontColor);
        }
        break;

      case "autoscroll":
        console.log("Received autoscroll request with speed:", request.speed);
        if (request.speed === "stop") {
          console.log("Stopping autoscroll");
          stopScroll();
        } else {
          console.log("Starting autoscroll with speed:", request.speed);
          startAutoScroll(request.speed);
        }
        break;

      case "slowautoscroll":
      case "mediumautoscroll":
      case "fastautoscroll":
        startScroll(request.interval);
        break;

      case "para-highlighter":
        highlightParagraphs("highlight");
        break;

      case "para-highlighter-background":
        highlightParagraphs("background");
        break;

      case "para-highlighter-remove":
        highlightParagraphs("remove");
        break;

      case "para-highlighter-background-remove":
        highlightParagraphs("background-remove");
        break;

      case "zoomPage":
        zoomPage(request.zoomValue);
        break;

      case "italics-remove":
        removeItalics();
        break;

      case "underscore-remove":
        removeUnderscore();
        break;

      case "reset_italics_underscore":
        resetItalicsUnderscore();
        break;

      case "convertCase":
        convertCase(request.caseType);
        break;

      case "select-text":
        const textSelection = window.getSelection();
        if (textSelection && textSelection.toString().trim() !== "") {
          sendResponse({ data: textSelection.toString() });
        } else {
          sendResponse({ data: null });
        }
        return true; // Needed for async response

      default:
        console.warn(`Unknown action: ${action}`);
    }

    // Always send a response
    sendResponse({ success: true });
  } catch (error) {
    console.error('Error handling message:', error);
    sendResponse({ success: false, error: error.message });
  }
  
  // Return true to indicate we will send a response asynchronously
  return true;
});
