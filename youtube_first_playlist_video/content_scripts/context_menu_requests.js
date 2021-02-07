const PARTIAL_HREF_LIST_FIRST_PARAM = "watch?list";
const PARTIAL_HREF_LIST_SUBSEQUENT_PARAM = "&list";
const PLAYLIST_CONTENT_DIV = "#content.ytd-playlist-video-renderer";

/* In playlists' context, handlers are assigned to anchors contained in divs that are also are assigned the handlers. 
Therefore, the context menu options addition message could be sent twice before any 'mouseleave' handler is triggered. (inOut = 2).
In this situation, we want to avoid the removal message to be sent until the 'mouseleave' event has been triggered twice. (inOut = 0) */
var inOut = 0;

// MouseEnter event: send message to background script to add the context menu options
function addMenuOptions (e) {
	inOut++;

	/* This href processing is done here because YouTube reuses its HTML elements when the user navigates from one page to another.
	Elements may have a specific href in one moment and a different one in another moment. */

	let href = $(this).attr("href") ? $(this).attr("href") : $(this).find("a[href*='list']").attr("href"); // Div containing anchor | Anchor
	let hrefNoList = href.includes(PARTIAL_HREF_LIST_SUBSEQUENT_PARAM) ? 
	href.substring(0, href.indexOf(PARTIAL_HREF_LIST_SUBSEQUENT_PARAM)) : // href="/watch?v=uSG4tG40Wb8&list=PLp3-KQ922RELlU_q8bmxEMtweK_b8jo0j&index=122"
	`/watch?v=${href.substring(href.indexOf("v=") + 2)}` ; // href="https://www.youtube.com/watch?list=PLp3-KQ922RELlU_q8bmxEMtweK_b8jo0j&v=_Df15XQgyq4"
		
	chrome.runtime.sendMessage({ action: "addContextMenuOptions", url: window.origin + hrefNoList });
};

// MouseLeave event: send message to background script to remove the added context menu options
function removeMenuOptions () {
	inOut--;

	if (inOut == 0) 
		chrome.runtime.sendMessage({ action: "removeContextMenuOptions" });
};

function addOrRemoveOptionsOnMouseInteraction (e) {
	e
	.mouseenter(addMenuOptions)
	.mouseleave(removeMenuOptions)
	.addClass('playlist-context-menu')
}

$(document).ready(function() {
	
	// Initial handlers assignment
	$(`a[href*='${PARTIAL_HREF_LIST_SUBSEQUENT_PARAM}'], a[href*='${PARTIAL_HREF_LIST_FIRST_PARAM}']`).each(function () {

		// Playlist div
		let contentDiv = $(this).closest(PLAYLIST_CONTENT_DIV).not(".playlist-context-menu");
		if (contentDiv.length > 0)
			addOrRemoveOptionsOnMouseInteraction(contentDiv);

		addOrRemoveOptionsOnMouseInteraction($(this));

	});

	// MutationObserver instantiation
	var mutationObs = new MutationObserver(function () {
		$(`a[href*='${PARTIAL_HREF_LIST_SUBSEQUENT_PARAM}'], a[href*='${PARTIAL_HREF_LIST_FIRST_PARAM}']`).not(".playlist-context-menu").each(function () {

			// Playlist div
			let contentDiv = $(this).closest(PLAYLIST_CONTENT_DIV).not(".playlist-context-menu");
			if (contentDiv.length > 0)
				addOrRemoveOptionsOnMouseInteraction(contentDiv);

			addOrRemoveOptionsOnMouseInteraction($(this));
		});
	});
	
	// Observe initialization
	mutationObs.observe(document.body, { childList: true, subtree: true });
	
});





