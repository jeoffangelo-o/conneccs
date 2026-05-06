# ConneCCS Figma Page Layouts
## Exact Measurements for Each Page

---

## 🖼️ CANVAS SETUP

**Frame Size:** 1920 x 1080px (Desktop)
**Background:** #0f0e0d (Dark theme)

---

## 📄 PAGE 1: LOGIN PAGE

### Layout Structure
```
┌─────────────────────────────────────────┐
│                                         │
│              [Centered Card]            │
│                                         │
│         ┌─────────────────┐            │
│         │   Logo + Title   │            │
│         │                  │            │
│         │   Welcome Back   │            │
│         │                  │            │
│         │   [Email Input]  │            │
│         │   [Pass Input]   │            │
│         │                  │            │
│         │   [Sign In Btn]  │            │
│         │                  │            │
│         │   Demo Accounts  │            │
│         └─────────────────┘            │
│                                         │
└─────────────────────────────────────────┘
```

### Measurements
- **Card Width:** 450px
- **Card Padding:** 32px
- **Logo Size:** 48x48px
- **Title (ConneCCS):** Syne, 1.5rem, weight 800
- **Subtitle:** 0.875rem, color #7a7060
- **Welcome Back:** Syne, 1.75rem, weight 700
- **Input Height:** 44px
- **Button Height:** 44px
- **Gap between elements:** 16px
- **Demo buttons:** 3 columns, gap 12px

---

## 📄 PAGE 2: DASHBOARD

### Layout Structure
```
┌──────┬────────────────────────────────────────┐
│      │ Topbar (60px height)                   │
│      ├────────────────────────────────────────┤
│ Side │ ┌──────────────────────────────────┐  │
│ bar  │ │ Stat Cards (5 columns)           │  │
│      │ └──────────────────────────────────┘  │
│ 260px│                                        │
│      │ ┌─────────────────┬────────────────┐  │
│      │ │ Recent Reports  │ Submission     │  │
│      │ │                 │ Overview       │  │
│      │ │ [Table]         │                │  │
│      │ │                 │ Pinned         │  │
│      │ │ IPCR Summary    │ Announcements  │  │
│      │ │ [Table]         │                │  │
│      │ └─────────────────┴────────────────┘  │
└──────┴────────────────────────────────────────┘
```

### Measurements
- **Sidebar:** 260px width, full height
- **Topbar:** 60px height, padding 0 28px
- **Page Body:** padding 20px 24px
- **Stat Grid:** 5 columns, gap 14px, margin-bottom 28px
- **Main Grid:** 1fr (main) + 320px (sidebar), gap 20px
- **Panel margin-bottom:** 24px
- **Panel padding:** 20px
- **Table cell padding:** 12px 10px

---

## 📄 PAGE 3: FACULTY

### Layout Structure
```
┌──────┬────────────────────────────────────────┐
│      │ Topbar (60px height)                   │
│      ├────────────────────────────────────────┤
│ Side │ ┌──────────────────────────────────┐  │
│ bar  │ │ Filter Buttons                   │  │
│      │ └──────────────────────────────────┘  │
│ 260px│                                        │
│      │ ┌────┬────┬────┬────┐                 │
│      │ │Card│Card│Card│Card│                 │
│      │ │    │    │    │    │                 │
│      │ ├────┼────┼────┼────┤                 │
│      │ │Card│Card│    │    │                 │
│      │ │    │    │    │    │                 │
│      │ └────┴────┴────┴────┘                 │
└──────┴────────────────────────────────────────┘
```

### Measurements
- **Filter buttons:** height 32px, gap 8px, margin-bottom 20px
- **Faculty cards grid:** auto-fill, min 280px, gap 16px
- **Card padding:** 20px
- **Card border-radius:** 12px
- **Avatar size:** 48x48px, border-radius 12px
- **Workload bar height:** 5px
- **Stats section:** padding-top 14px, border-top 1px

---

## 📄 PAGE 4: ANNOUNCEMENTS

### Layout Structure
```
┌──────┬────────────────────────────────────────┐
│      │ Topbar (60px height)                   │
│      ├────────────────────────────────────────┤
│ Side │ ┌──────────────────────────────────┐  │
│ bar  │ │ Announcement Card (Pinned)       │  │
│      │ │ [Title, Meta, Body, Badges]      │  │
│ 260px│ └──────────────────────────────────┘  │
│      │ ┌──────────────────────────────────┐  │
│      │ │ Announcement Card                │  │
│      │ └──────────────────────────────────┘  │
│      │ ┌──────────────────────────────────┐  │
│      │ │ Announcement Card                │  │
│      │ └──────────────────────────────────┘  │
└──────┴────────────────────────────────────────┘
```

### Measurements
- **Card padding:** 16px 18px
- **Card margin-bottom:** 12px
- **Pinned border-left:** 3px solid #f4d03f
- **Title font-size:** 0.9rem, weight 700
- **Meta font-size:** 0.72rem, gap 10px
- **Body font-size:** 0.82rem, line-height 1.6
- **Badge position:** top-right

---

## 📄 PAGE 5: REPORTS

### Layout Structure
```
┌──────┬────────────────────────────────────────┐
│      │ Topbar (60px height)                   │
│      ├────────────────────────────────────────┤
│ Side │ ┌──────────────────────────────────┐  │
│ bar  │ │ Panel                            │  │
│      │ │ ┌──────────────────────────────┐ │  │
│ 260px│ │ │ Filters Bar                  │ │  │
│      │ │ └──────────────────────────────┘ │  │
│      │ │ ┌──────────────────────────────┐ │  │
│      │ │ │ Table (8 columns)            │ │  │
│      │ │ │ [Scrollable horizontally]    │ │  │
│      │ │ └──────────────────────────────┘ │  │
│      │ └──────────────────────────────────┘  │
└──────┴────────────────────────────────────────┘
```

### Measurements
- **Filters bar:** padding 14px 20px, background #252220
- **Filter select:** padding 6px 10px, border-radius 8px
- **Table min-width:** 600px (allows horizontal scroll)
- **Header padding:** 10px
- **Cell padding:** 12px 10px
- **Row hover:** background rgba(255,255,255,0.02)

---

## 📄 PAGE 6: IPCR

### Layout Structure
```
┌──────┬────────────────────────────────────────┐
│      │ Topbar (60px height)                   │
│      ├────────────────────────────────────────┤
│ Side │ ┌──────────────────────────────────┐  │
│ bar  │ │ Stat Cards (4 columns)           │  │
│      │ └──────────────────────────────────┘  │
│ 260px│                                        │
│      │ ┌──────────────────────────────────┐  │
│      │ │ Panel: IPCR Records              │  │
│      │ │ ┌──────────────────────────────┐ │  │
│      │ │ │ Table (10 columns)           │ │  │
│      │ │ │ [Score bars, badges]         │ │  │
│      │ │ └──────────────────────────────┘ │  │
│      │ └──────────────────────────────────┘  │
└──────┴────────────────────────────────────────┘
```

### Measurements
- **Stat grid:** 4 columns, gap 14px
- **Score display:** 56px min-width, padding 6px 10px
- **Score value:** Syne, 1.1rem, weight 800
- **Progress bar:** width 60px, height 5px
- **Score text:** 0.85rem, weight 600

---

## 📄 PAGE 7: DOCUMENTS

### Layout Structure
```
┌──────┬────────────────────────────────────────┐
│      │ Topbar (60px height)                   │
│      ├────────────────────────────────────────┤
│ Side │ ┌──────────────────────────────────┐  │
│ bar  │ │ Stat Cards (4 columns)           │  │
│      │ └──────────────────────────────────┘  │
│ 260px│                                        │
│      │ ┌──────────────────────────────────┐  │
│      │ │ Panel: Document Folders          │  │
│      │ │ ┌────┬────┬────┐                 │  │
│      │ │ │Fldr│Fldr│Fldr│                 │  │
│      │ │ │Card│Card│Card│                 │  │
│      │ │ └────┴────┴────┘                 │  │
│      │ └──────────────────────────────────┘  │
└──────┴────────────────────────────────────────┘
```

### Measurements
- **Folder cards grid:** auto-fill, min 280px, gap 16px
- **Folder card padding:** 18px
- **Folder icon:** 40x40px, border-radius 8px
- **Icon background:** rgba with 15% opacity
- **Meta gap:** 8px
- **Badge at bottom**

---

## 🎨 COMPONENT LIBRARY STRUCTURE

### Create These Master Components:

1. **Sidebar Component**
   - Variants: Collapsed, Expanded
   - Auto-layout: Vertical
   - Fixed width: 260px

2. **Topbar Component**
   - Auto-layout: Horizontal, space-between
   - Height: 60px
   - Padding: 0 28px

3. **Stat Card Component**
   - Variants: Blue, Green, Red, Purple, Teal
   - Auto-layout: Vertical
   - Min-width: 170px
   - Padding: 16px

4. **Panel Component**
   - Auto-layout: Vertical
   - Border-radius: 12px
   - Nested: Header, Body

5. **Badge Component**
   - Variants: Green, Red, Orange, Blue, Yellow, Gray
   - Auto-layout: Horizontal
   - Padding: 3px 9px
   - Border-radius: 99px

6. **Button Component**
   - Variants: Primary, Secondary, Small
   - States: Default, Hover, Active
   - Auto-layout: Horizontal
   - Padding: 8px 16px

7. **Avatar Component**
   - Variants: Small (26px), Regular (32px), Large (48px), XL (64px)
   - Circle shape
   - Gradient fill

8. **Input Component**
   - States: Default, Focus, Error
   - Auto-layout: Vertical (includes label)
   - Height: 44px

9. **Table Row Component**
   - Auto-layout: Horizontal
   - States: Default, Hover
   - Cell padding: 12px 10px

10. **Faculty Card Component**
    - Auto-layout: Vertical
    - Min-width: 280px
    - Padding: 20px

11. **Announcement Card Component**
    - Variants: Regular, Pinned
    - Auto-layout: Vertical
    - Padding: 16px 18px

---

## 🔗 PROTOTYPING CONNECTIONS

### Navigation Flow:
```
Login → Dashboard
Dashboard → All pages via sidebar
All pages ↔ All pages via sidebar
Topbar buttons → Respective pages
```

### Interactions:
- Click: Navigate to page
- Hover: Show hover states
- Toggle: Theme switch (dark ↔ light)

---

## 📐 GRID SYSTEM

### Desktop Grid
- Columns: 12
- Gutter: 24px
- Margin: 28px

### Tablet Grid
- Columns: 8
- Gutter: 20px
- Margin: 20px

### Mobile Grid
- Columns: 4
- Gutter: 16px
- Margin: 16px

---

## ✨ FINAL TOUCHES

### Shadows
- Cards: 0 4px 24px rgba(0,0,0,0.5)
- Hover: 0 8px 32px rgba(79,124,255,0.1)

### Transitions
- Duration: 200ms
- Easing: ease

### Animations
- Fade in: 400ms ease
- Stagger delay: 50ms per item

---

This guide provides exact measurements for recreating every page in Figma with 100% accuracy.
