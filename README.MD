# User Agent Manager

A Chromium based extension that allows you to easily switch between different User Agent strings. Modify both HTTP headers and JavaScript-based User Agent detection.

## Features

- 🔄 Dynamic User Agent switching (Windows, Linux, Mac)
- 🌓 Dark/Light theme support
- 🚀 Real-time browser version detection
- 🛡️ Handles both HTTP headers and JavaScript detection
- 💾 Persistent settings
- 🎯 Compatible with Brave (Manifest 2)

## Installation

### From Source
1. Clone this repository:
```bash
git clone https://github.com/yourusername/UserAgentManager.git
```

2. Open Brave and navigate to:
- `brave://extensions/`

3. Enable "Developer mode"

4. Click "Load unpacked" and select the extension directory

## Usage

1. Click the extension icon in your browser toolbar
2. Select your desired User Agent:
   - Default (Disabled)
   - Windows
   - Linux
   - Mac
3. The page will automatically reload with the new User Agent

## Development

### Project Structure
```
UserAgentManager/
├── manifest.json        # Extension configuration
├── background.js       # Background script for header modification
├── content.js         # Content script for JavaScript injection
└── popup/            # UI components
    ├── popup.html
    ├── popup.css
    └── popup.js
```

### Building
```bash
zip -r UserAgentManager.zip manifest.json background.js content.js popup/
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

## Privacy

This extension:
- Does not collect any user data
- Does not make any network requests
- Only modifies User Agent strings as specified by the user
