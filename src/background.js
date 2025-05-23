function getCurrentVersions() {
    const ua = navigator.userAgent;
    return {
        chromeVersion: ua.match(/Chrome\/([0-9.]+)/)[1],
        webkitVersion: ua.match(/AppleWebKit\/([0-9.]+)/)[1],
    };
}

function getUserAgents() {
    const versions = getCurrentVersions();
    return {
        windows: `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/${versions.webkitVersion} (KHTML, like Gecko) Chrome/${versions.chromeVersion} Safari/${versions.webkitVersion}`,
        linux: `Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/${versions.webkitVersion} (KHTML, like Gecko) Chrome/${versions.chromeVersion} Safari/${versions.webkitVersion}`,
        mac: `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/${versions.webkitVersion} (KHTML, like Gecko) Chrome/${versions.chromeVersion} Safari/${versions.webkitVersion}`
    };
}

let currentUA = 'default';
let userAgents = getUserAgents();

// Update userAgents every hour
setInterval(() => {
    userAgents = getUserAgents();
}, 3600000);


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