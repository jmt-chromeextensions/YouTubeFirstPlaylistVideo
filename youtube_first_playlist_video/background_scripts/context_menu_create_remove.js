// Inbox 📫
chrome.runtime.onMessage.addListener(
	function (request) {

		if (request.action === "addContextMenuOptions") {
			// Parent: 'Open video in a...'
			chrome.contextMenus.create(
				{
					"title": "Open first video in...",
					"id": 'ynl_context_menu_parent',
					"contexts": ["link"],
					"documentUrlPatterns": ["https://*.youtube.com/*"]
				});

			// New tab (no switch)
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

		}

		else if (request.action === "removeContextMenuOptions")
			chrome.contextMenus.remove('ynl_context_menu_parent');

	}
);

function openVideo(openMode, url) {

	// 'Open video in new tab' option clicked 
	if (openMode === 'openVideoNewTab') {
		chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
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

