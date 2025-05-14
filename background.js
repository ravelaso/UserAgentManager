const userAgents = {
    windows: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    linux: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    mac: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
};

let currentUA = 'default';

// Initialize the UA from storage when extension loads
chrome.storage.local.get('selectedUA', function(data) {
    if (data.selectedUA) {
        currentUA = data.selectedUA;
    }
});

chrome.webRequest.onBeforeSendHeaders.addListener(
    function(details) {
        if (currentUA !== 'default') {
            for (let header of details.requestHeaders) {
                if (header.name.toLowerCase() === 'user-agent') {
                    header.value = userAgents[currentUA];
                    break;
                }
            }
        }
        return { requestHeaders: details.requestHeaders };
    },
    { urls: ['<all_urls>'] },
    ['blocking', 'requestHeaders']
);

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.action === 'updateUA') {
            currentUA = request.value;
            // Notify all tabs about the UA change
            chrome.tabs.query({}, function(tabs) {
                tabs.forEach(function(tab) {
                    chrome.tabs.sendMessage(tab.id, {
                        action: 'uaChanged',
                        value: currentUA
                    });
                });
            });
        }
    }
);