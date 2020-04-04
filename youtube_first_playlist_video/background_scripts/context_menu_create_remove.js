// Inbox 📫
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
		
		if (request.action === "addContextMenuOptions") {
			// Parent: 'Open video in a...'
			chrome.contextMenus.create(
			{"title": "Open first video in...",
			"id": 'ynl_context_menu_parent',
			"contexts": ["link"],
			"documentUrlPatterns":["https://*.youtube.com/*"]
			});
			
			// New tab
			chrome.contextMenus.create(
			{"title": "new tab",
			"parentId": "ynl_context_menu_parent",
			"id": 'ynl_context_menu_tab',
			"contexts": ["link"],
			"documentUrlPatterns":["https://*.youtube.com/*"],
			"onclick": () => openVideo("openVideoNewTab", request.url)
			});
			
			// New window
			chrome.contextMenus.create(
			{"title": "new window",
			"parentId": "ynl_context_menu_parent",
			"id": 'ynl_context_menu_window',
			"contexts": ["link"],
			"documentUrlPatterns":["https://*.youtube.com/*"],
			"onclick": () => openVideo("openVideoNewWindow", request.url)
			});
			
			// New incognito window
			chrome.contextMenus.create(
			{"title": "incognito window",
			"parentId": "ynl_context_menu_parent",
			"id": 'ynl_context_menu_incognito',
			"contexts": ["link"],
			"documentUrlPatterns":["https://*.youtube.com/*"],
			"onclick": () => openVideo("openVideoIncognitoWindow", request.url)
			});
			
		}
			
		else if (request.action === "removeContextMenuOptions") 
			chrome.contextMenus.remove('ynl_context_menu_parent');
		
		sendResponse("bar");
		
    }
);

function openVideo(openMode, url) {
	
	// 'Open video in new tab' option clicked 
	if (openMode === 'openVideoNewTab') {
		window.open(url);
	} 
	
	// 'Open video in new window' option clicked
	else if (openMode === 'openVideoNewWindow') {
		chrome.windows.create({"url": url, "state": "maximized"});
	} 
	
	// 'Open video in incognito window'
	else if (openMode === 'openVideoIncognitoWindow') {
		chrome.windows.create({"url": url, "incognito": true, "state": "maximized"});
	} 
	
}

