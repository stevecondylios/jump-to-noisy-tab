# Jump to Noisy Tab

A Chrome extension that allows you to quickly jump to tabs that have active audio playing.

## Features

- Jump to tabs with active audio by clicking the extension icon
- Use keyboard shortcut Alt+Shift+J (Option+Shift+J on macOS) to jump to noisy tabs
- Works across all Chrome windows
- Minimal permissions required

## Installation

1. Download or clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" (toggle in the top-right corner)
4. Click "Load unpacked" and select the extension directory

## Icon Creation

Before publishing to the Chrome Web Store, you'll need to create icons in the following sizes:
- 16x16 pixels
- 48x48 pixels 
- 128x128 pixels

Save these icons in the `icons` directory with the filenames:
- `icon16.png`
- `icon48.png`
- `icon128.png`

## Permissions

This extension only requires the `tabs` permission to access tab information and detect which tabs are playing audio.