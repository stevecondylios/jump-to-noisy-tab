// Function to find and jump to a tab with audio playing
async function jumpToNoisyTab() {
  // Get all Chrome windows
  const windows = await chrome.windows.getAll({ populate: true });
  let noisyTabs = [];
  
  // Collect all tabs with audio across all windows
  for (const window of windows) {
    if (window.tabs) {
      const windowNoisyTabs = window.tabs.filter(tab => tab.audible);
      noisyTabs = noisyTabs.concat(windowNoisyTabs);
    }
  }
  
  // If there are noisy tabs, focus the first one
  if (noisyTabs.length > 0) {
    const targetTab = noisyTabs[0];
    await chrome.windows.update(targetTab.windowId, { focused: true });
    await chrome.tabs.update(targetTab.id, { active: true });
    return true;
  }
  
  return false;
}

// Listen for extension icon click
chrome.action.onClicked.addListener(() => {
  jumpToNoisyTab();
});

// Listen for keyboard shortcut
chrome.commands.onCommand.addListener((command) => {
  if (command === 'jump-to-noisy-tab') {
    jumpToNoisyTab();
  }
});
