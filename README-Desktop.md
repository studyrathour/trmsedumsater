# EduMaster Desktop Application

This guide explains how to convert the EduMaster web application into a desktop application using Nativefier.

## Prerequisites

1. Node.js (v16 or higher)
2. npm or yarn
3. Nativefier installed globally

## Installation

### Install Nativefier

```bash
npm install -g nativefier
```

## Building Desktop Application

### Method 1: Using Nativefier (Recommended)

1. **Build the web application first:**
   ```bash
   npm run build
   ```

2. **Deploy your application to a web server** (Netlify, Vercel, etc.)

3. **Create desktop app using Nativefier:**
   ```bash
   nativefier "https://your-deployed-site-url.com" \
     --name "EduMaster" \
     --platform "all" \
     --arch "x64" \
     --electron-version "22.0.0" \
     --overwrite \
     --single-instance \
     --width 1200 \
     --height 800 \
     --min-width 800 \
     --min-height 600 \
     --resizable \
     --maximizable \
     --web-security false \
     --ignore-certificate \
     --ignore-gpu-blacklist \
     --enable-es3-apis \
     --insecure \
     --internal-urls ".*\.netlify\.app.*,.*\.vercel\.app.*,.*\.firebase\.app.*,.*\.firebaseapp\.com.*,.*\.googleapis\.com.*,.*\.google\.com.*,.*t\.me.*,.*telegram.*" \
     --user-agent "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 EduMaster/1.0.0" \
     --inject desktop-fixes.css \
     --inject desktop-fixes.js
   ```

### Method 2: Using Configuration File

1. **Use the provided configuration:**
   ```bash
   nativefier --config nativefier-config.json
   ```

2. **Update the targetUrl in nativefier-config.json** with your deployed site URL.

## Configuration Options Explained

- `--web-security false`: Allows loading external resources (iframes, APIs)
- `--ignore-certificate`: Ignores SSL certificate errors
- `--insecure`: Allows insecure content
- `--internal-urls`: Defines which URLs should open within the app
- `--inject`: Injects custom CSS and JS files for desktop-specific fixes
- `--user-agent`: Custom user agent to identify desktop app

## Desktop-Specific Fixes

The application includes several fixes for desktop compatibility:

### 1. Telegram Popup Fix
- Detects desktop environment
- Removes overlay timeout issues
- Prevents popup from showing in desktop app

### 2. White Screen Fix
- Forces DOM reflow on startup
- Ensures proper rendering
- Adds desktop-specific CSS classes

### 3. External Link Handling
- Opens external links in system browser
- Handles Telegram links properly
- Maintains app navigation

### 4. Iframe Optimization
- Improves iframe loading
- Handles loading errors
- Adds proper sandbox attributes

### 5. Firebase Connection
- Adds CORS headers for desktop
- Improves API connectivity
- Handles authentication properly

## Troubleshooting

### White Screen Issue
If you see a white screen:

1. **Check the console** for JavaScript errors
2. **Verify the target URL** is accessible
3. **Try with --web-security false** flag
4. **Use the provided desktop-fixes.js** injection

### Iframe Loading Issues
If iframes don't load:

1. **Add iframe domains** to internal-urls
2. **Use --insecure flag**
3. **Check network connectivity**
4. **Verify iframe sources** are accessible

### External Links Not Working
If external links don't open:

1. **Check user agent** configuration
2. **Verify external URL patterns**
3. **Test with --ignore-certificate**

## Building for Different Platforms

### Windows
```bash
nativefier "https://your-site.com" --platform "windows" --arch "x64"
```

### macOS
```bash
nativefier "https://your-site.com" --platform "osx" --arch "x64"
```

### Linux
```bash
nativefier "https://your-site.com" --platform "linux" --arch "x64"
```

## Advanced Configuration

### Custom Icon
```bash
nativefier "https://your-site.com" --icon "path/to/icon.png"
```

### App Store Ready (macOS)
```bash
nativefier "https://your-site.com" --platform "osx" --app-copyright "Your Copyright" --app-version "1.0.0"
```

### Portable App
```bash
nativefier "https://your-site.com" --portable
```

## Performance Optimization

1. **Use latest Electron version** for better performance
2. **Enable hardware acceleration** with --ignore-gpu-blacklist
3. **Optimize web app** before building desktop version
4. **Use proper caching** strategies

## Security Considerations

The desktop app uses relaxed security settings for compatibility:
- Web security is disabled
- Certificate errors are ignored
- Insecure content is allowed

For production use, consider:
- Using HTTPS for all resources
- Implementing proper certificate validation
- Restricting internal URLs to trusted domains

## Distribution

After building, you'll find the desktop app in:
- Windows: `EduMaster-win32-x64/`
- macOS: `EduMaster-darwin-x64/`
- Linux: `EduMaster-linux-x64/`

You can distribute these folders or create installers using tools like:
- **Windows**: NSIS, Inno Setup
- **macOS**: create-dmg, electron-builder
- **Linux**: AppImage, Snap, Flatpak

## Support

If you encounter issues:

1. Check the Nativefier documentation
2. Verify your web app works in a regular browser
3. Test with different Electron versions
4. Check the desktop-fixes.js console logs