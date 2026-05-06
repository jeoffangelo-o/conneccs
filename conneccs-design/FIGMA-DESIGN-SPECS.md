# ConneCCS Figma Design Specifications
## 100% Accurate Recreation Guide

---

## 🎨 COLOR PALETTE

### Dark Theme (Default)
```
Background Colors:
--bg:       #0f0e0d  (Main background)
--bg2:      #1a1816  (Sidebar, panels)
--bg3:      #252220  (Cards, inputs)

Border Colors:
--border:   #3a3530  (Primary borders)
--border2:  #4a4238  (Hover borders)

Text Colors:
--text:     #f0ebe0  (Primary text)
--text2:    #c4b8a0  (Secondary text)
--text3:    #7a7060  (Tertiary text)

Accent Colors:
--accent:   #f4d03f  (Primary accent - Yellow)
--accent2:  #f1c40f  (Secondary accent)
--green:    #8fb569  (Success)
--red:      #d97171  (Error/Alert)
--orange:   #d4944a  (Warning)
--yellow:   #f4d03f  (Info)
--teal:     #6aad92  (Accent 3)
```

### Light Theme
```
Background Colors:
--bg:       #faf8f3
--bg2:      #f5f2ea
--bg3:      #ebe6db

Border Colors:
--border:   #d9d0bf
--border2:  #c9bfae

Text Colors:
--text:     #2a2520
--text2:    #5a5045
--text3:    #8a7d6f

Accent Colors: (Same as dark theme)
```

---

## 📐 LAYOUT DIMENSIONS

### Sidebar
- Width: 260px
- Fixed position (left side)
- Full height (100vh)

### Main Content
- Margin-left: 260px (to account for sidebar)
- Full remaining width

### Topbar
- Height: 60px
- Sticky position (top: 0)
- Padding: 0 28px

### Page Body
- Padding: 20px 24px

---

## 🔤 TYPOGRAPHY

### Fonts
- **Display Font**: 'Syne' (Google Fonts)
  - Weights: 400, 500, 600, 700, 800
- **Body Font**: 'DM Sans' (Google Fonts)
  - Weights: 300, 400, 500, 600

### Font Sizes
```
Page Title:        1.8rem (27px)
Section Title:     1.05rem (15.75px)
Stat Value:        1.9rem (28.5px)
Body Text:         0.875rem (13.125px)
Small Text:        0.75rem (11.25px)
Tiny Text:         0.65rem (9.75px)
```

### Font Weights
- Display headings: 800 (Extra Bold)
- Section titles: 700 (Bold)
- Body text: 400-500 (Regular-Medium)
- Labels: 600 (Semi-Bold)

---

## 📦 COMPONENT SPECIFICATIONS

### 1. SIDEBAR

**Dimensions:**
- Width: 260px
- Height: 100vh
- Background: #1a1816
- Border-right: 1px solid #3a3530

**Sidebar Brand:**
- Padding: 24px 20px 20px
- Logo size: 34x34px
- Logo border-radius: 4px
- Title font: Syne, 1.25rem, weight 800
- Tagline: 0.7rem, color #7a7060

**Nav Items:**
- Padding: 9px 12px
- Border-radius: 8px
- Font-size: 0.875rem
- Icon size: 16x16px
- Gap between icon and text: 10px
- Active state: background rgba(79,124,255,0.12), color #f4d03f
- Active indicator: 3px wide, left side, color #f4d03f

**Nav Badge:**
- Background: #d97171
- Color: white
- Font-size: 0.65rem
- Padding: 1px 6px
- Border-radius: 99px

**User Panel (Bottom):**
- Padding: 14px 16px
- Border-top: 1px solid #3a3530
- Avatar: 34x34px circle
- Theme toggle button: 32x32px

---

### 2. TOPBAR

**Dimensions:**
- Height: 60px
- Padding: 0 28px
- Background: #1a1816
- Border-bottom: 1px solid #3a3530

**Title:**
- Font: Syne, 1.05rem, weight 700
- Color: #f0ebe0

**Breadcrumb:**
- Font-size: 0.7rem
- Color: #7a7060

**Buttons:**
- Primary button: background #f4d03f, color white
- Secondary button: background #252220, border 1px solid #3a3530
- Notification button: 34x34px, border-radius 8px

**Notification Badge:**
- Size: 18x18px minimum
- Background: #d97171
- Color: white
- Font-size: 0.65rem
- Position: top-right (-4px, -4px)
- Border: 2px solid #1a1816

---

### 3. STAT CARDS

**Dimensions:**
- Min-width: 170px
- Padding: 16px
- Border-radius: 12px
- Background: #1a1816
- Border: 1px solid #3a3530

**Icon:**
- Size: 32x32px
- Border-radius: 8px
- Position: absolute, top-right (18px, 18px)
- Background: rgba with 15% opacity
- Font-size: 0.9rem

**Label:**
- Font-size: 0.68rem
- Weight: 600
- Color: #7a7060
- Text-transform: uppercase
- Letter-spacing: 0.06em

**Value:**
- Font: Syne
- Font-size: 1.9rem
- Weight: 800
- Color: #f0ebe0
- Letter-spacing: -0.04em

**Sub-text:**
- Font-size: 0.68rem
- Color: #7a7060

**Color Variants:**
- Blue: accent color #f4d03f
- Green: #8fb569
- Red: #d97171
- Purple: #f1c40f
- Teal: #6aad92

---

### 4. PANELS

**Dimensions:**
- Border-radius: 12px
- Background: #1a1816
- Border: 1px solid #3a3530
- Margin-bottom: 24px

**Panel Header:**
- Padding: 16px 20px
- Border-bottom: 1px solid #3a3530

**Panel Title:**
- Font: Syne, 0.95rem, weight 700
- Color: #f0ebe0
- Dot indicator: 8x8px circle, color #f4d03f

**Panel Body:**
- Padding: 20px

---

### 5. TABLES

**Table Header:**
- Font-size: 0.68rem
- Weight: 600
- Color: #7a7060
- Text-transform: uppercase
- Letter-spacing: 0.06em
- Padding: 10px
- Background: #252220
- Border-bottom: 1px solid #3a3530

**Table Cells:**
- Padding: 12px 10px
- Font-size: 0.82rem
- Color: #c4b8a0
- Border-bottom: 1px solid #3a3530

**Row Hover:**
- Background: rgba(255,255,255,0.02)

---

### 6. BADGES

**Dimensions:**
- Padding: 3px 9px
- Border-radius: 99px
- Font-size: 0.7rem
- Weight: 600

**Color Variants:**
```
Green:  background rgba(34,197,94,0.12),  color #8fb569
Red:    background rgba(244,63,94,0.12),  color #d97171
Orange: background rgba(249,115,22,0.12), color #d4944a
Blue:   background rgba(79,124,255,0.12), color #f4d03f
Yellow: background rgba(234,179,8,0.12),  color #f4d03f
Gray:   background rgba(255,255,255,0.06), color #7a7060
```

---

### 7. BUTTONS

**Primary Button:**
- Background: #f4d03f
- Color: white
- Padding: 8px 16px
- Border-radius: 8px
- Font-size: 0.82rem
- Weight: 500
- Hover: background #3d6bef

**Secondary Button:**
- Background: #252220
- Color: #c4b8a0
- Border: 1px solid #3a3530
- Padding: 8px 16px
- Border-radius: 8px
- Hover: background #4a4238

**Small Button:**
- Padding: 5px 11px
- Font-size: 0.75rem

---

### 8. AVATARS

**Sizes:**
- Small: 26x26px, font-size 0.6rem
- Regular: 32x32px, font-size 0.7rem
- Large: 48x48px, font-size 1rem
- Extra Large: 64x64px, font-size 1.3rem

**Style:**
- Border-radius: 50%
- Background: linear-gradient(135deg, #f4d03f, #f1c40f)
- Color: white
- Weight: 700

---

### 9. FORMS

**Input Fields:**
- Width: 100%
- Background: #252220
- Border: 1px solid #3a3530
- Color: #f0ebe0
- Padding: 9px 12px
- Border-radius: 8px
- Font-size: 0.875rem
- Focus: border-color #f4d03f

**Labels:**
- Font-size: 0.78rem
- Weight: 600
- Color: #c4b8a0
- Margin-bottom: 6px

**Placeholder:**
- Color: #7a7060

---

### 10. FACULTY CARDS

**Dimensions:**
- Min-width: 280px
- Padding: 20px
- Border-radius: 12px
- Background: #1a1816
- Border: 1px solid #3a3530

**Avatar:**
- Size: 48x48px
- Border-radius: 12px

**Workload Bar:**
- Height: 5px
- Border-radius: 99px
- Gap: 1px between segments
- Colors: Teaching (#f4d03f), Research (#6aad92), Extension (#f1c40f)

**Stats:**
- Value font: Syne, 1.3rem, weight 800
- Label font-size: 0.65rem, uppercase

**Hover Effect:**
- Border-color: #f4d03f
- Transform: translateY(-2px)
- Box-shadow: 0 8px 32px rgba(79,124,255,0.1)

---

### 11. ANNOUNCEMENT CARDS

**Dimensions:**
- Padding: 16px 18px
- Border-radius: 12px
- Background: #252220
- Border: 1px solid #3a3530
- Margin-bottom: 12px

**Pinned Style:**
- Border-left: 3px solid #f4d03f

**Title:**
- Font-weight: 700
- Font-size: 0.9rem
- Color: #f0ebe0

**Meta:**
- Font-size: 0.72rem
- Color: #7a7060
- Gap: 10px

**Body:**
- Font-size: 0.82rem
- Color: #c4b8a0
- Line-height: 1.6

---

## 🎭 ANIMATIONS

### Fade In
```
@keyframes fadeIn {
  from: opacity 0, translateY(8px)
  to: opacity 1, translateY(0)
}
Duration: 0.4s
Easing: ease
```

### Delays
- delay-1: 0.05s
- delay-2: 0.1s
- delay-3: 0.15s
- delay-4: 0.2s
- delay-5: 0.25s

### Transitions
- Default: 0.2s ease
- All interactive elements use this

---

## 📱 RESPONSIVE BREAKPOINTS

### Desktop (Default)
- Sidebar: 260px

### Tablet (≤1400px)
- Sidebar: 240px
- Page padding: 16px 20px

### Mobile (≤900px)
- Sidebar: Hidden (transform: translateX(-100%))
- Main content: margin-left 0
- Stat grid: 2 columns

---

## 🔧 SPECIAL EFFECTS

### Box Shadows
- Default: 0 4px 24px rgba(0,0,0,0.5) (dark)
- Default: 0 4px 24px rgba(0,0,0,0.08) (light)

### Border Radius
- Large: 12px (panels, cards)
- Small: 8px (buttons, inputs)
- Pills: 99px (badges)

### Scrollbar
- Width: 5px
- Track: transparent
- Thumb: #4a4238, border-radius 99px

---

## 📄 PAGE-SPECIFIC LAYOUTS

### Login Page
- Centered card: max-width 450px
- Card padding: varies by section
- Demo buttons: 3 columns on desktop

### Dashboard
- Grid: main content (1fr) + sidebar (320px)
- Stat grid: 5 columns (auto-fit, min 170px)

### Faculty Page
- Cards grid: auto-fill, min 280px

### Reports/IPCR
- Full-width table with horizontal scroll

---

## 🎯 FIGMA TIPS

1. **Create Color Styles** for all colors
2. **Create Text Styles** for all typography
3. **Use Auto Layout** for all components
4. **Create Components** for:
   - Sidebar
   - Topbar
   - Stat cards
   - Badges
   - Buttons
   - Avatars
   - Form inputs
   - Table rows
5. **Use Variants** for:
   - Button states (primary, secondary, small)
   - Badge colors
   - Card types
6. **Create Frames** for each page (1920x1080)
7. **Use Constraints** for responsive behavior
8. **Add Prototyping** for navigation between pages

---

## 📦 ASSETS NEEDED

### Images
- logo.png (34x34px)
- he.png (header image)

### Icons
All icons are SVG stroke icons (24x24px base, scaled to 16x16px in nav)
- Use Feather Icons or similar icon set
- Stroke width: 2px
- Color: currentColor (inherits from parent)

---

## ✅ QUALITY CHECKLIST

- [ ] All colors match exactly
- [ ] All fonts and sizes correct
- [ ] All spacing/padding accurate
- [ ] All border-radius values correct
- [ ] Hover states implemented
- [ ] Active states implemented
- [ ] Shadows applied correctly
- [ ] Components created and reusable
- [ ] Auto-layout used throughout
- [ ] Responsive constraints set
- [ ] Prototype navigation works
- [ ] Both light and dark themes created

---

## 🚀 EXPORT SETTINGS

### For Development
- Format: SVG for icons
- Format: PNG @2x for images
- Include: CSS code snippets

### For Presentation
- Format: PDF or PNG
- Resolution: @2x or @3x
- Include: Interactive prototype link

---

This specification ensures 100% accuracy when recreating the design in Figma.
