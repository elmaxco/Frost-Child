# Frost Child Theme

WordPress child theme for Frost with custom Gutenberg blocks and vanilla JS/CSS (no build step).

## What’s New (Feb 13, 2026)

- Added a new Image Carousel block: `frost-child/image-carousel`
- Image Carousel now supports multi-image add from Media Library and URL-based image add
- Image Carousel frontend logic was simplified to a stable carousel pattern (same behavior model as review carousel)
- Production hardening for Image Carousel:
  - frontend script registered as view script (avoids duplicate enqueue patterns)
  - save wrapper keeps core block classes via `useBlockProps.save(...)`
- Arrow style unified between Review Carousel and Image Carousel
- Dot indicators for Image Carousel updated to simple filled dots (inactive gray, active dark)
- Image Carousel arrows moved outside image area while keeping card width intact

## Features

- Dropdown Menu (Mega Menu) block
- Simple Dropdown block
- Flexible Navigation block
- Flexible Nav Link block
- Customer Reviews carousel block
- Image Carousel block (new)
- Alphabet Filter block + REST endpoint
- Responsive behavior across blocks
- Template parts (header/footer)
- No build pipeline required

## Project Structure

```
Frost-Child/
├── assets/
├── blocks/
│   ├── alphabet-filter/
│   ├── dropdown-menu/
│   ├── flexible-nav-link/
│   ├── flexible-navigation/
│   ├── image-carousel/      # New image carousel block
│   ├── review-carousel/
│   ├── simple-dropdown/
│   └── slide-image/         # Legacy carousel block
├── parts/
│   ├── footer.html
│   └── header.html
├── functions.php
├── style.css
├── theme.json
└── README.md
```

## Blocks

### Dropdown Menu
- Block: `frost-child/dropdown-menu`
- Server-rendered via `render.php`
- Frontend behavior in `dropdown.js`

### Simple Dropdown
- Block: `frost-child/simple-dropdown`
- Uses shared backdrop with mega menu

### Flexible Navigation
- Block: `frost-child/flexible-navigation`
- Off-canvas behavior on mobile

### Flexible Nav Link
- Block: `frost-child/flexible-nav-link`
- Link/button block intended for Flexible Navigation

### Customer Reviews (Review Carousel)
- Block: `frost-child/customer-reviews`
- Features: review cards, rating, date, arrows, dots, autoplay, swipe, responsive behavior

### Image Carousel (New)
- Block: `frost-child/image-carousel`
- Add images from:
  - Media Library (single or multiple selection)
  - Image URL input
- Per-image content:
  - alt text
  - caption or overlay text
- Carousel settings:
  - visible slides (desktop)
  - autoplay + speed
  - transition speed
  - pause on hover
  - infinite loop
  - image height, fit, gap, border radius
  - show/hide arrows and dots
- Responsive behavior:
  - mobile always shows 1 slide
- UI consistency:
  - arrows now match Review Carousel visual style
  - arrows positioned outside image cards
  - dot style matches current design system used in carousels

### Alphabet Filter
- Block: `frost-child/alphabet-filter`
- REST endpoint: `frost-child/v1/alphabet-filter`

## Registration & Loading

- Theme setup and block registration are in `functions.php`
- Most blocks use `register_block_type()` with block.json metadata
- Image Carousel is explicitly registered with:
  - editor script/style
  - frontend style
  - view script for frontend behavior

## Installation

1. Install and activate Frost parent theme
2. Put this theme in `/wp-content/themes/`
3. Activate Frost Child in wp-admin

## Dependencies

- WordPress 5.9+
- Frost parent theme

## Notes

- This project intentionally avoids bundlers/build tools
- JS and CSS are committed and loaded directly
- After deploying carousel changes, clear site/plugin/CDN caches

---

Theme Version: 1.0.0  
Last Updated: February 13, 2026
