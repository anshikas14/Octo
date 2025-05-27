# Octo: Accessibility Chrome Extension

## Overview
Octo is a Chrome extension designed to enhance web accessibility for users with dyslexia and color blindness. It provides a suite of tools to customize the appearance and behavior of web pages, making them more readable and navigable.

## Purpose
The primary goal of Octo is to make the web more accessible by allowing users to adjust visual and auditory elements of web pages. This includes changing font sizes, styles, colors, and enabling text-to-speech functionality.

## Features

### Visual Customization
- **Font Size**: Users can adjust the font size of web pages to improve readability.
- **Font Style**: A variety of font styles are available, including dyslexia-friendly options like OpenDyslexic.
- **Color Adjustments**: Users can change the background and font colors to suit their preferences, which is particularly useful for those with color blindness.
- **Dark/Light Mode**: Toggle between dark and light modes to reduce eye strain.

### Text-to-Speech
- **Speak**: Read out the entire web page.
- **Speak Selected**: Read out selected text, allowing users to focus on specific content.

### Image Management
- **Remove Images**: Hide images on the page to reduce visual clutter.
- **Add Images**: Restore images if needed.
- **Read Out Images**: Hover over images to hear their alt text read aloud.

### Link Highlighting
- **Highlight Links**: Make links more visible by changing their background color and font size.
- **Show Borders**: Add borders to links for better visibility.
- **Remove Highlights**: Revert link styles to their original state.

### Paragraph Highlighting
- **Highlight Paragraphs**: Add borders or background colors to paragraphs to improve readability.
- **Remove Highlights**: Revert paragraph styles to their original state.

### Translation
- **Translate Text**: A built-in translation feature allows users to translate text into various languages, enhancing accessibility for non-native speakers.

### Additional Tools
- **Magnifier**: Zoom in on specific parts of the page.
- **Auto-Scrolling**: Automatically scroll through the page at different speeds.
- **Remove Emphasis**: Remove italics and underscores to simplify text.
- **Case Converter**: Convert text to uppercase or lowercase.

## Architecture
- **Manifest.json**: Defines the extension's metadata, permissions, and content scripts.
- **Background Script (background.js)**: Handles user interactions and sends messages to content scripts.
- **Content Script (content.js)**: Modifies the web page based on user preferences.
- **Popup (popup.html)**: Provides a user interface for accessing the extension's features.
- **CSS (styles.css)**: Styles the popup and content scripts for a consistent look and feel.

## User Experience
Octo is designed to be user-friendly, with a simple and intuitive interface. Users can easily access and customize features through the popup, and their preferences can be saved for future use.

## Conclusion
Octo aims to make the web a more inclusive space by providing tools that cater to the needs of users with dyslexia and color blindness. By allowing users to customize their web experience, Octo helps to break down barriers to accessibility. 