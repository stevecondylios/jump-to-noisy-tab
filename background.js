// Keep track of the current noisy tab index
let currentNoisyTabIndex = -1;
let lastNoisyTabs = [];

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
  
  // If there are noisy tabs, focus the next one
  if (noisyTabs.length > 0) {
    // Determine if the list of noisy tabs has changed
    const tabsChanged = !arraysEqual(
      noisyTabs.map(tab => tab.id), 
      lastNoisyTabs.map(tab => tab.id)
    );
    
    // Reset the index if tabs changed or we're at the end of the list
    if (tabsChanged || currentNoisyTabIndex >= noisyTabs.length - 1) {
      currentNoisyTabIndex = 0;
    } else {
      // Increment to go to the next tab in the list
      currentNoisyTabIndex++;
    }
    
    // Update the last seen noisy tabs
    lastNoisyTabs = noisyTabs;
    
    // Get the target tab based on the current index
    const targetTab = noisyTabs[currentNoisyTabIndex];
    
    // Focus the window and tab
    await chrome.windows.update(targetTab.windowId, { focused: true });
    await chrome.tabs.update(targetTab.id, { active: true });
    return true;
  }
  
  // Reset if no noisy tabs are found
  currentNoisyTabIndex = -1;
  lastNoisyTabs = [];
  return false;
}

// Helper function to compare arrays for equality
function arraysEqual(a, b) {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
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

// Reset the tab index when tabs change
chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.audible !== undefined) {
    // Reset the index when audio state changes
    currentNoisyTabIndex = -1;
  }
});