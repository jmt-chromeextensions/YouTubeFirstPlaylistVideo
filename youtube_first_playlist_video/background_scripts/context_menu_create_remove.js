// These values correspond to the choice of the options the user has specified they want the
// context menu to contain in the settings page.
const ALL_OPTIONS = 0
const ONLY_THIS_TAB = 1
const ONLY_NEW_TAB = 2
const ONLY_NEW_TAB_SWITCH = 3
const ONLY_NEW_WINDOW = 4
const ONLY_NEW_INCOGNITO_WINDOW = 5

var options_choice;

// Options choice initialization
chrome.storage.sync.get('optionsChoice', function(result) {
	// Check if some value is stored
	if (result.optionsChoice)
		options_choice = result.optionsChoice;
	else
		options_choice = 0;
});

// Extension's icon clicked -> Open settings page
chrome.browserAction.onClicked.addListener(() => {
	chrome.tabs.create({ url: 'settings/settings.html' });
});

// Inbox 📫
chrome.runtime.onMessage.addListener(
	function (request) {

		if (request.action === "addContextMenuOptions") {

			// Depending on the user's choice, the context menu contains one parent item with the
			// four children options, or a single item that can be only one the options.
			switch (options_choice) {

				case ALL_OPTIONS:

					// Parent: 'Open video in a...'
					chrome.contextMenus.create(
						{
							"title": "Open first video in...",
							"id": 'ynl_context_menu_parent',
							"contexts": ["link"],
							"documentUrlPatterns": ["https://*.youtube.com/*"]
						});

					// This tab
					chrome.contextMenus.create(
						{
							"title": "this tab",
							"parentId": "ynl_context_menu_parent",
							"id": 'ynl_context_menu_this_tab',
							"contexts": ["link"],
							"documentUrlPatterns": ["https://*.youtube.com/*"],
							"onclick": () => openVideo("openVideoThisTab", request.url)
						});

					// New tab
					chrome.contextMenus.create(
						{
							"title": "new tab",
							"parentId": "ynl_context_menu_parent",
							"id": 'ynl_context_menu_tab',
							"contexts": ["link"],
							"documentUrlPatterns": ["https://*.youtube.com/*"],
							"onclick": () => openVideo("openVideoNewTab", request.url)
						});

					// New tab (switch)
					chrome.contextMenus.create(
						{
							"title": "new tab (switch)",
							"parentId": "ynl_context_menu_parent",
							"id": 'ynl_context_menu_tab_switch',
							"contexts": ["link"],
							"documentUrlPatterns": ["https://*.youtube.com/*"],
							"onclick": () => openVideo("openVideoNewTabSwitch", request.url)
						});

					// New window
					chrome.contextMenus.create(
						{
							"title": "new window",
							"parentId": "ynl_context_menu_parent",
							"id": 'ynl_context_menu_window',
							"contexts": ["link"],
							"documentUrlPatterns": ["https://*.youtube.com/*"],
							"onclick": () => openVideo("openVideoNewWindow", request.url)
						});

					// New incognito window
					chrome.contextMenus.create(
						{
							"title": "incognito window",
							"parentId": "ynl_context_menu_parent",
							"id": 'ynl_context_menu_incognito',
							"contexts": ["link"],
							"documentUrlPatterns": ["https://*.youtube.com/*"],
							"onclick": () => openVideo("openVideoIncognitoWindow", request.url)
						});

					break;

				// Individual options

				case ONLY_THIS_TAB:

					chrome.contextMenus.create(
						{
							"title": "Open first video in this tab",
							"id": "ynl_context_menu_parent",
							"contexts": ["link"],
							"documentUrlPatterns": ["https://*.youtube.com/*"],
							"onclick": () => openVideo("openVideoThisTab", request.url)
						});
					
					break;

				case ONLY_NEW_TAB:

					chrome.contextMenus.create(
						{
							"title": "Open first video in a new tab",
							"id": "ynl_context_menu_parent",
							"contexts": ["link"],
							"documentUrlPatterns": ["https://*.youtube.com/*"],
							"onclick": () => openVideo("openVideoNewTab", request.url)
						});
					
					break;
					
				case ONLY_NEW_TAB_SWITCH:

					chrome.contextMenus.create(
						{
							"title": "Open first video in a new tab (switch)",
							"id": "ynl_context_menu_parent",
							"contexts": ["link"],
							"documentUrlPatterns": ["https://*.youtube.com/*"],
							"onclick": () => openVideo("openVideoNewTabSwitch", request.url)
						});
					
					break;

				case ONLY_NEW_WINDOW:

					chrome.contextMenus.create(
						{
							"title": "Open first video in a new window",
							"id": "ynl_context_menu_parent",
							"contexts": ["link"],
							"documentUrlPatterns": ["https://*.youtube.com/*"],
							"onclick": () => openVideo("openVideoNewWindow", request.url)
						});
					
					break;

				case ONLY_NEW_INCOGNITO_WINDOW:

					chrome.contextMenus.create(
						{
							"title": "Open first video in a new incognito window",
							"id": "ynl_context_menu_parent",
							"contexts": ["link"],
							"documentUrlPatterns": ["https://*.youtube.com/*"],
							"onclick": () => openVideo("openVideoIncognitoWindow", request.url)
						});
					
					break;

			}

		}

		else if (request.action === "removeContextMenuOptions")
			chrome.contextMenus.remove('ynl_context_menu_parent');

		else if (request.action === "modifyUserOptionsChoice")
			options_choice = request.choice;

	}
);

function openVideo(openMode, url) {

	// 'Open video in this tab' option clicked 
	if (openMode === 'openVideoThisTab') {
		// The id of the tab where the request has been made is necessary
		chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
			chrome.tabs.update(tabs[0].id, {url: url});
		});

	}

	// 'Open video in new tab' option clicked 
	else if (openMode === 'openVideoNewTab') {
		chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
			// Open new tab with the video to the right of the current one
			chrome.tabs.create({ url: url, active: false, index: (tabs[0].index + 1) }); 
		});
	}

	// 'Open video in new tab and switch to it' option clicked
	else if (openMode === 'openVideoNewTabSwitch') {
		window.open(url);
	}

	// 'Open video in new window' option clicked
	else if (openMode === 'openVideoNewWindow') {
		chrome.windows.create({ "url": url, "state": "maximized" });
	}

	// 'Open video in incognito window'
	else if (openMode === 'openVideoIncognitoWindow') {
		chrome.windows.create({ "url": url, "incognito": true, "state": "maximized" });
	}

}

