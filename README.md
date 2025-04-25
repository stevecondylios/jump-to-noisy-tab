
# Jump to Noisy Tab

A Chrome extension that allows you to quickly jump to tabs that have active audio playing.

# Usage

- Shift + alt/opt + j to jump to noisy tab (shift + alt/opt + j again to cycle through them)
- Shift + alt/opt + b to jump back to the last tab you were on before jumping to the noisy tab
- Shift + alt/opt + m to mute(/unmute) all tabs other than the current one

Reminder: it's good idea to set this chrome flag on: chrome://flags/#enable-tab-audio-muting. This allows you to click on the little speaker icon on the tab to um/mute it

## Features

- Jump to tabs with active audio by clicking the extension icon
- Use keyboard shortcut Alt+Shift+J (Option+Shift+J on macOS) to jump to noisy tabs
- Pressing the shortcut repeatedly cycles through all tabs with active audio
- Works across all Chrome windows
- Minimal permissions required

## Installation

1. Download or clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" (toggle in the top-right corner)
4. Click "Load unpacked" and select the extension directory

## Permissions

This extension only requires the `tabs` and `windows` permissions to access tab information and detect which tabs are playing audio.

## Note

Made with claude code (2 prompts, $0.26c, 10 minutes). Logo made with ChatGPT 4o (2 prompts).
