chrome.storage.local.get('selectedUA', function(data) {
    if (data.selectedUA && data.selectedUA !== 'default') {
        const currentUA = navigator.userAgent;
        const browserInfo = {
            chromeVersion: currentUA.match(/Chrome\/([0-9.]+)/)[1],
            webkitVersion: currentUA.match(/AppleWebKit\/([0-9.]+)/)[1],
        };

        const userAgents = {
            windows: `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/${browserInfo.webkitVersion} (KHTML, like Gecko) Chrome/${browserInfo.chromeVersion} Safari/${browserInfo.webkitVersion}`,
            linux: `Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/${browserInfo.webkitVersion} (KHTML, like Gecko) Chrome/${browserInfo.chromeVersion} Safari/${browserInfo.webkitVersion}`,
            mac: `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/${browserInfo.webkitVersion} (KHTML, like Gecko) Chrome/${browserInfo.chromeVersion} Safari/${browserInfo.webkitVersion}`
        };

        const script = document.createElement('script');
        script.textContent = `
            Object.defineProperties(navigator, {
                userAgent: {
                    get: function() { return '${userAgents[data.selectedUA]}' }
                },
                appVersion: {
                    get: function() { return '${userAgents[data.selectedUA]}' }
                },
                platform: {
                    get: function() { return '${data.selectedUA === 'windows' ? 'Win32' : 
                                            data.selectedUA === 'mac' ? 'MacIntel' : 'Linux x86_64'}' }
                },
                vendor: {
                    get: function() { return 'Google Inc.' }
                },
                language: {
                    get: function() { return 'en-US' }
                }
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
