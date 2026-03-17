# Emoji to SVG Icon Replacement Guide

## Status: ✅ COMPLETED

All emojis across the web application have been successfully replaced with SVG icons.

## Implementation Approach

Icons are now globally available through `app.locals.icons` in `app.js`, making them accessible in all EJS templates without needing to include a partial.

### Usage in Templates

Simply use: `<%- icons.iconName %>`

Example:
```ejs
<div class="stat-icon"><%- icons.clipboard %></div>
```

## Available Icons

The following 18 SVG icons are available globally:

1. `icons.clipboard` - Reports, documents
2. `icons.check` - Completed, approved, success
3. `icons.alert` - Warnings, errors, overdue
4. `icons.chart` - Analytics, IPCR, statistics
5. `icons.user` - Single user, profile
6. `icons.star` - Ratings, favorites
7. `icons.search` - Search, review
8. `icons.edit` - Edit, modify
9. `icons.folder` - Folders, directories
10. `icons.file` - Files, documents
11. `icons.clock` - Time, pending
12. `icons.calendar` - Dates, schedules
13. `icons.pin` - Pinned items
14. `icons.zap` - Overload, urgent
15. `icons.lock` - Private, secured
16. `icons.globe` - Public, global
17. `icons.database` - Data, storage
18. `icons.users` - Multiple users, groups
19. `icons.scale` - Balance, workload

## Pages Updated

All pages have been updated to use the new icon system:

- ✅ dashboard.ejs
- ✅ documents.ejs
- ✅ folder-detail.ejs
- ✅ ipcr.ejs
- ✅ ipcr-form.ejs
- ✅ ipcr-detail.ejs
- ✅ workload.ejs
- ✅ announcements.ejs
- ✅ announcement-form.ejs
- ✅ reports.ejs
- ✅ faculty-detail.ejs
- ✅ error.ejs (uses inline SVG)
- ✅ 404.ejs (no icons needed)

## Technical Details

### Icon Definition Location
`app.js` - Icons are defined in `app.locals.icons` object

### Icon Styling
All icons have the `icon-svg` class and inherit color from their parent element using `stroke="currentColor"`.

CSS styling in `public/css/style.css`:
```css
.icon-svg {
  display: inline-block;
  vertical-align: middle;
  flex-shrink: 0;
}
```

## Benefits

1. **Consistency** - All icons use the same stroke width and styling
2. **Scalability** - SVG icons scale perfectly at any size
3. **Themeable** - Icons inherit color from parent, working with light/dark modes
4. **Performance** - No external icon library needed
5. **Global Access** - Available in all templates without imports

## Maintenance

To add new icons:
1. Add SVG definition to `app.locals.icons` object in `app.js`
2. Include the `icon-svg` class in the SVG element
3. Use consistent 20x20 viewBox and 2px stroke weight
4. Test in both light and dark modes
