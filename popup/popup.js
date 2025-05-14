document.addEventListener('DOMContentLoaded', function() {
    const select = document.getElementById('uaSelect');

    // Load saved selection
    chrome.storage.local.get('selectedUA', function(data) {
        if (data.selectedUA) {
            select.value = data.selectedUA;
        }
    });

    // Save selection when changed
    select.addEventListener('change', function() {
        chrome.storage.local.set({
            selectedUA: select.value
        });
        // Notify background script
        chrome.runtime.sendMessage({
            action: 'updateUA',
            value: select.value
        });
    });
});