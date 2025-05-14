chrome.storage.local.get('selectedUA', function(data) {
    if (data.selectedUA && data.selectedUA !== 'default') {
        const userAgents = {
            windows: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            linux: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            mac: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        };

        const script = document.createElement('script');
        script.textContent = `
            Object.defineProperty(navigator, 'userAgent', {
                get: function() { return '${userAgents[data.selectedUA]}' }
            });
            Object.defineProperty(navigator, 'appVersion', {
                get: function() { return '${userAgents[data.selectedUA]}' }
            });
            Object.defineProperty(navigator, 'platform', {
                get: function() { return '${data.selectedUA === 'windows' ? 'Win32' : 
                                        data.selectedUA === 'mac' ? 'MacIntel' : 'Linux x86_64'}' }
            });
        `;
        document.documentElement.appendChild(script);
        script.remove();
    }
});

// Listen for messages from background script
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.action === 'uaChanged') {
        location.reload(); // Reload to apply new UA
    }
});
