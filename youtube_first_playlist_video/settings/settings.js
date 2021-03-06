$(document).ready(function() {

    // Load settings
	chrome.storage.sync.get('optionsChoice', function(result) {
        // Check if some value is stored
        if (result.optionsChoice)
            setTimeout(() => {
                $("#" + result.optionsChoice).prop('checked', true);
            }, 150); // A little timeout to let the user appreciate the beatiful animation
        else
            $("#0").prop('checked', true)
	});
    
    // When any option is selected, the new choice (represented by an integer) is saved and a message is sent to the background script.
    $("input").change(function() { 
        chrome.storage.sync.set({'optionsChoice': parseFloat(this.value)}, function() {});
        chrome.runtime.sendMessage({action: "modifyUserOptionsChoice", choice:parseFloat(this.value)});
    }); 

});