$( document ).ready(function() {
	
	// MouseOver, HoverIn and focusIn events: send message to background script to add the context menu options
	var addMenuOptions = function () {
		
		if (!$(this).data("yfpv-handler")) {
			$(this).data('yfpv-handler', 'true');
			
			chrome.runtime.sendMessage(
				{action: "addContextMenuOptions", url: window.origin + $(this).attr('href').substring(0,$(this).attr('href').indexOf("&list"))}
			);
		
			}
		
	};
	
	// MouseOut, HoverOut and focusOut events: send message to background script to remove the added context menu options
	var removeMenuOptions = function () {
		
		if ($(this).data("yfpv-handler")) {
			$(this).removeData('yfpv-handler');
			
			chrome.runtime.sendMessage(
				{action: "removeContextMenuOptions"}
			);
			
		};
		
	};

	// Initial handlers assignment
	$("a[href*='&list']").each(function () {
		addOrRemoveOptionsOnMouseInteraction($(this));
	});

	// MutationObserver instantiation
	var mutationObs = new MutationObserver(function () {
		$("a[href*='&list']:not(.playlist-context-menu)").each(function () {
			addOrRemoveOptionsOnMouseInteraction($(this));
		});
	});
	
	// Observe initialization
	mutationObs.observe(document.body, { childList: true, subtree: true });

	function addOrRemoveOptionsOnMouseInteraction (e) {
        e
		.mouseover(addMenuOptions)
		.mouseout(removeMenuOptions)
		.addClass('playlist-context-menu')
	}
	
});





