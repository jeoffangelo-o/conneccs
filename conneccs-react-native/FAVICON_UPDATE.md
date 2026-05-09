# Favicon Update - CCS Logo ✅

## Changes Made

Updated the system favicon to use the CCS logo that appears in the sidebar drawer.

### 1. **app.json Configuration**
Added favicon configuration to use the CCS logo:
```json
{
  "expo": {
    "icon": "./assets/logo.png",
    "web": {
      "bundler": "metro",
      "favicon": "./assets/logo.png"
    }
  }
}
```

### 2. **web/index.html Update**
Updated the HTML head to reference the logo:
```html
<link rel="icon" type="image/png" sizes="32x32" href="/assets/logo.png" />
<link rel="apple-touch-icon" sizes="180x180" href="/assets/logo.png" />
```

## Logo Location
The CCS logo is located at:
- `assets/logo.png`

This is the same logo used in:
- Sidebar drawer header
- Login screen
- App icon

## How to See Changes

### Method 1: Restart Development Server
```bash
# Stop the current server (Ctrl+C)
# Clear cache and restart
npx expo start --clear
```

### Method 2: Hard Refresh Browser
After the server restarts:
1. Open the web app in browser
2. Press `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac)
3. This forces a hard refresh and clears cache

### Method 3: Clear Browser Cache
1. Open browser DevTools (F12)
2. Right-click the refresh button
3. Select "Empty Cache and Hard Reload"

## What You'll See

### Browser Tab
- The CCS logo will appear in the browser tab
- Shows next to the page title "ConneCCS - Target Monitoring & Management System"

### Bookmarks
- When you bookmark the page, the CCS logo will be the bookmark icon

### Mobile Home Screen
- If you add the web app to your mobile home screen
- The CCS logo will be the app icon (Apple Touch Icon)

## Technical Details

### Favicon Formats
- **PNG format**: Modern browsers support PNG favicons
- **32x32 pixels**: Standard favicon size
- **180x180 pixels**: Apple Touch Icon size (for iOS home screen)

### Expo Web Handling
Expo automatically processes the favicon from `app.json`:
- Copies the icon to the web build
- Generates multiple sizes if needed
- Handles caching and serving

### Browser Caching
Favicons are heavily cached by browsers. If you don't see changes:
1. Clear browser cache
2. Hard refresh (Ctrl+Shift+R)
3. Try incognito/private mode
4. Restart the development server

## Files Modified
1. `app.json` - Added icon and web.favicon configuration
2. `web/index.html` - Updated favicon link references

## Files Used
- `assets/logo.png` - The CCS logo (source file)

## Verification Checklist
- [ ] Restart development server with `--clear` flag
- [ ] Hard refresh browser (Ctrl+Shift+R)
- [ ] Check browser tab shows CCS logo
- [ ] Check bookmark icon shows CCS logo
- [ ] Test on different browsers (Chrome, Firefox, Safari, Edge)
- [ ] Test on mobile devices

## Troubleshooting

### Logo Not Showing
1. **Clear cache**: Hard refresh browser
2. **Restart server**: Stop and start with `--clear` flag
3. **Check console**: Look for 404 errors for logo.png
4. **Verify file exists**: Check `assets/logo.png` exists

### Wrong Icon Showing
1. **Old cache**: Browser is showing cached old icon
2. **Solution**: Clear all browser data for localhost
3. **Alternative**: Test in incognito mode

### Icon Blurry
1. **Size issue**: Logo might need to be resized
2. **Solution**: Create optimized favicon sizes (16x16, 32x32, 180x180)
3. **Tool**: Use online favicon generator

## Future Enhancements

### Multiple Sizes
Create optimized favicon sizes:
```
assets/
  favicon-16x16.png
  favicon-32x32.png
  favicon-180x180.png (Apple Touch Icon)
  favicon-192x192.png (Android)
  favicon-512x512.png (Android)
```

### Favicon.ico
For older browser support:
```html
<link rel="icon" type="image/x-icon" href="/favicon.ico" />
```

### Web Manifest
For PWA support:
```json
{
  "name": "ConneCCS",
  "short_name": "ConneCCS",
  "icons": [
    {
      "src": "/assets/logo.png",
      "sizes": "192x192",
      "type": "image/png"
    }
  ]
}
```

## Notes
- The CCS logo is already in the correct location (`assets/logo.png`)
- Expo handles the favicon automatically from `app.json`
- Browser caching may delay seeing changes
- Always hard refresh after favicon changes
