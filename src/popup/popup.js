document.addEventListener('DOMContentLoaded', function() {
    const select = document.getElementById('uaSelect');
    const themeToggle = document.getElementById('toggleTheme');
    const statusText = document.getElementById('statusText');

    // Theme management
    function setTheme(isDark) {
        document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
        themeToggle.textContent = isDark ? 'Light' : 'Dark';
        chrome.storage.local.set({ isDarkMode: isDark });
    }

    // Load theme preference
    chrome.storage.local.get('isDarkMode', function(data) {
        setTheme(data.isDarkMode);
    });

    themeToggle.addEventListener('click', function() {
        const isDark = document.documentElement.getAttribute('data-theme') !== 'dark';
        setTheme(isDark);
    });

    // UA Management
    chrome.storage.local.get('selectedUA', function(data) {
        if (data.selectedUA) {
            select.value = data.selectedUA;
            statusText.textContent = `Current: ${select.options[select.selectedIndex].text}`;
            chrome.runtime.sendMessage({
                action: 'updateUA',
                value: data.selectedUA
            });
        }
    });

    select.addEventListener('change', function() {
        const newValue = select.value;
        statusText.textContent = `Current: ${select.options[select.selectedIndex].text}`;
        
        chrome.storage.local.set({
            selectedUA: newValue
        }, function() {
            chrome.runtime.sendMessage({
                action: 'updateUA',
                value: newValue
            });
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                if (tabs[0]) {
                    chrome.tabs.reload(tabs[0].id);
                }
            });
        });
    });
});