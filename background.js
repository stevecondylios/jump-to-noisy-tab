// Keep track of the current noisy tab index
let currentNoisyTabIndex = -1;
let lastNoisyTabs = [];
// Track the last active tab without audio
let lastNonAudioTabId = null;
let lastNonAudioWindowId = null;

// Function to find and jump to a tab with audio playing
async function jumpToNoisyTab() {
  // Get all Chrome windows
  const windows = await chrome.windows.getAll({ populate: true });
  let noisyTabs = [];
  
  // Get the current active tab to potentially update last non-audio tab
  const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  // Update lastNonAudioTabId if current tab has no audio
  if (activeTab && !activeTab.audible) {
    lastNonAudioTabId = activeTab.id;
    lastNonAudioWindowId = activeTab.windowId;
  }
  
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

// Function to jump back to the last non-audio tab
async function jumpBackToLastNonAudioTab() {
  if (lastNonAudioTabId && lastNonAudioWindowId) {
    try {
      // Check if the tab still exists
      const tab = await chrome.tabs.get(lastNonAudioTabId);
      if (tab) {
        // Focus the window and tab
        await chrome.windows.update(lastNonAudioWindowId, { focused: true });
        await chrome.tabs.update(lastNonAudioTabId, { active: true });
        return true;
      }
    } catch (error) {
      // Tab doesn't exist anymore, reset the stored IDs
      lastNonAudioTabId = null;
      lastNonAudioWindowId = null;
    }
  }
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

// Function to mute all tabs except the current one
async function muteAllExceptCurrent() {
  // Get the current active tab
  const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  if (!activeTab) return false;
  
  // Get all tabs across all windows
  const allWindows = await chrome.windows.getAll({ populate: true });
  let allTabs = [];
  
  for (const window of allWindows) {
    if (window.tabs) {
      allTabs = allTabs.concat(window.tabs);
    }
  }
  
  // Mute all tabs except the active one
  for (const tab of allTabs) {
    if (tab.id !== activeTab.id) {
      await chrome.tabs.update(tab.id, { muted: true });
    } else {
      // Make sure current tab is not muted
      await chrome.tabs.update(tab.id, { muted: false });
    }
  }
  
  return true;
}

// Listen for keyboard shortcuts
chrome.commands.onCommand.addListener((command) => {
  if (command === 'jump-to-noisy-tab') {
    jumpToNoisyTab();
  } else if (command === 'jump-back-to-last-tab') {
    jumpBackToLastNonAudioTab();
  } else if (command === 'mute-all-except-current') {
    muteAllExceptCurrent();
  }
});

// Track active tab changes to update lastNonAudioTabId
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  try {
    const tab = await chrome.tabs.get(activeInfo.tabId);
    if (!tab.audible) {
      lastNonAudioTabId = tab.id;
      lastNonAudioWindowId = tab.windowId;
    }
  } catch (error) {
    console.error("Error getting tab info:", error);
  }
});

// Reset the tab index when tabs change
chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.audible !== undefined) {
    // Reset the index when audio state changes
    currentNoisyTabIndex = -1;
  }
});