# Frost Child Theme

WordPress child theme for Frost with custom Gutenberg blocks and vanilla JS/CSS (no build step).

## What’s New (Feb 19, 2026)

- Added a new Service Buttons block: `frost-child/service-buttons`
- Added a new Pill Link Buttons block: `frost-child/pill-link-buttons`
- Added a new Staggered Cards block: `frost-child/staggered-cards`

## Earlier Updates (Feb 17, 2026)

- Added a new Booking Calendar block: `frost-child/booking-calendar`
- Added a new Company Google Map block: `frost-child/company-map`
- Added a new A–Ö Filter block: `frost-child/alphabet-filter`
- Added REST endpoint for alphabet filtering: `frost-child/v1/alphabet-filter`
- Verified frontend logic is domain-independent (no local domain hardcoding)

## Earlier Updates (Feb 13, 2026)

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
- FAQ Dropdown block
- Flexible Navigation block
- Flexible Nav Link block
- Service Buttons block
- Pill Link Buttons block
- Staggered Cards block
- Customer Reviews carousel block
- Image Carousel block
- Booking Calendar block
- Company Google Map block
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
│   ├── booking-calendar/
│   ├── company-map/
│   ├── dropdown-menu/
│   ├── faq-dropdown/
│   ├── flexible-nav-link/
│   ├── flexible-navigation/
│   ├── image-carousel/
│   ├── pill-link-buttons/
│   ├── review-carousel/
│   ├── service-buttons/
│   ├── simple-dropdown/
│   ├── slide-image/         # Legacy carousel block
│   └── staggered-cards/
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

### Service Buttons
- Block: `frost-child/service-buttons`
- Features: buttons with image, label, and link

### Pill Link Buttons
- Block: `frost-child/pill-link-buttons`
- Features: responsive pill-style link button row with editable items

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

### Booking Calendar
- Block: `frost-child/booking-calendar`
- Features: weekday/holiday-aware date picker, time slot selection, booking confirmation state

### Company Google Map
- Block: `frost-child/company-map`
- Features: company name/address or exact lat/lng pin, editable zoom and map height

### Alphabet Filter
- Block: `frost-child/alphabet-filter`
- REST endpoint: `frost-child/v1/alphabet-filter`
- Features: search input + letter filtering (A–Ö) against published content

### Staggered Cards
- Block: `frost-child/staggered-cards`
- Features: staggered content cards plus configurable CTA card

## Registration & Loading

- Theme setup and block registration are in `functions.php`
- Most blocks use `register_block_type()` with block.json metadata
- Booking Calendar, Company Map, Alphabet Filter, Service Buttons, Pill Link Buttons, and Staggered Cards are registered via block.json in `functions.php`
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
Last Updated: February 19, 2026
