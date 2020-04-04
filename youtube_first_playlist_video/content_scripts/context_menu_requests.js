$( document ).ready(function() {
	
	// MouseOver, HoverIn and focusIn events: send message to background script to add the context menu options
	var addMenuOptions = function () {
		
		if (!$(this).data("handler")) {
			$(this).data('handler', 'true');
			
			chrome.runtime.sendMessage(
				{action: "addContextMenuOptions", url: window.origin + $(this).attr('href').substring(0,$(this).attr('href').indexOf("&list"))},
				function () {
					return true;
				}
			);
			
		}
		
	};
	
	// MouseOut, HoverOut and focusOut events: send message to background script to remove the added context menu options
	var removeMenuOptions = function () {
		if ($(this).data("handler")) {
			$(this).removeData('handler');
			
			chrome.runtime.sendMessage(
				{action: "removeContextMenuOptions"},
				function () {
					return true;
				}
			);
			
		};
		
	};

	// MutationObserver instantiation
	var mutationObs = new MutationObserver(function (mutations) { 
		addOrRemoveOptionsOnMouseInteraction();
	});
		
	// Observe initialization
	mutationObs.observe(document.body, { childList: true, subtree: true });

	function addOrRemoveOptionsOnMouseInteraction () {
		// Rambo programming 💣🔫
        $("a[href*='&list']") 
		.hover(addMenuOptions, removeMenuOptions)
		.mouseover(addMenuOptions)
		.mouseout(removeMenuOptions)
		.focusin(addMenuOptions)
		.focusout(removeMenuOptions)
	}
	
});





