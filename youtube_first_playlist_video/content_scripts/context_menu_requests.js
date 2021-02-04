var inOut = 0;

// MouseOver, HoverIn and focusIn events: send message to background script to add the context menu options
function addMenuOptions (e) {
	inOut++;

	let href = $(this).attr("href") ? $(this).attr("href") : $(this).find("a[href*='list']").attr("href"); // Div containing anchor | Anchor
	let hrefNoList = href.includes("&list") ? 
	href.substring(0, href.indexOf("&list")) : // href="/watch?v=uSG4tG40Wb8&list=PLp3-KQ922RELlU_q8bmxEMtweK_b8jo0j&index=122"
	`/watch?v=${href.substring(href.indexOf("v=") + 2)}` ; // href="https://www.youtube.com/watch?list=PLp3-KQ922RELlU_q8bmxEMtweK_b8jo0j&v=_Df15XQgyq4"
		
	chrome.runtime.sendMessage({ action: "addContextMenuOptions", url: window.origin + hrefNoList });
};

// MouseOut, HoverOut and focusOut events: send message to background script to remove the added context menu options
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
	$("a[href*='&list'], a[href*='watch?list']").each(function () {

		// Playlist div
		let contentDiv = $(this).closest("#content.ytd-playlist-video-renderer").not(".playlist-context-menu");
		if (contentDiv.length > 0)
			addOrRemoveOptionsOnMouseInteraction(contentDiv);

		addOrRemoveOptionsOnMouseInteraction($(this));

	});

	// MutationObserver instantiation
	var mutationObs = new MutationObserver(function () {
		$("a[href*='&list'], a[href*='watch?list']").not(".playlist-context-menu").each(function () {

			// Playlist div
			let contentDiv = $(this).closest("#content.ytd-playlist-video-renderer").not(".playlist-context-menu");
			if (contentDiv.length > 0)
				addOrRemoveOptionsOnMouseInteraction(contentDiv);

			addOrRemoveOptionsOnMouseInteraction($(this));
		});
	});
	
	// Observe initialization
	mutationObs.observe(document.body, { childList: true, subtree: true });
	
});





