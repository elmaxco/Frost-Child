# Frost Child Theme

A modern WordPress child theme built on top of the Frost parent theme, featuring custom Gutenberg blocks and vanilla JavaScript interactions with no build step required.

## Features

- **Dropdown Menu (Mega Menu) Block**: Multi-column dropdown with location filtering, popular services, and a shared backdrop
- **Simple Dropdown Block**: Compact dropdown with two links (shares the same backdrop as the mega menu)
- **Flexible Navigation Block**: A flexible navigation container that becomes an off-canvas menu on mobile devices
- **Flexible Nav Link Block**: Styled link/button component designed to live inside Flexible Navigation
- **Customer Reviews Block**: Interactive carousel showcasing customer testimonials with ratings, names, and dates
- **Responsive Design**: Mobile-first patterns with customizable breakpoints
- **Template Parts**: Custom header and footer template parts
- **No Build Step**: All JavaScript and CSS is vanilla code with no bundler or compilation required

## Project Structure

```
Frost-Child/
├── assets/                 # Theme assets folder
├── blocks/                 # Custom Gutenberg blocks
│   ├── dropdown-menu/      # Mega dropdown menu block
│   │   ├── block.json      # Block configuration
│   │   ├── dropdown.js     # Frontend dropdown behavior
│   │   ├── edit.js         # Block editor interface
│   │   ├── editor.css      # Editor-specific styles
│   │   ├── render.php      # Server-side rendering
│   │   └── style.css       # Frontend styles
│   ├── flexible-nav-link/   # Link/button for Flexible Navigation
│   │   ├── block.json      # Block configuration
│   │   ├── edit.js         # Block editor interface
│   │   └── style.css       # Block styles
│   ├── flexible-navigation/ # Off-canvas mobile navigation container
│   │   ├── block.json      # Block configuration
│   │   ├── edit.js         # Block editor interface
│   │   ├── editor.css      # Editor-specific styles
│   │   ├── style.css       # Frontend styles
│   │   └── view.js         # Frontend mobile toggle behavior
│   ├── review-carousel/     # Customer reviews carousel block
│   │   ├── block.json      # Block configuration
│   │   ├── edit.js         # Block editor interface
│   │   ├── editor.css      # Editor-specific styles
│   │   ├── style.css       # Frontend carousel styles
│   │   └── view.js         # Frontend carousel functionality
│   ├── simple-dropdown/     # Small dropdown with two links
│   │   ├── block.json      # Block configuration
│   │   ├── edit.js         # Block editor interface
│   │   ├── editor.css      # Editor-specific styles
│   │   ├── style.css       # Frontend styles
│   │   └── view.js         # Frontend dropdown behavior
│   └── slide-image/         # Legacy carousel/slider block
│       ├── block.json      # Block configuration
│       ├── carousel.js     # Frontend carousel logic
│       ├── edit.js         # Block editor interface
│       ├── editor.css      # Editor-specific styles
│       └── style.css       # Frontend styles
├── parts/                  # Template parts
│   ├── footer.html         # Footer template
│   └── header.html         # Header template
├── functions.php           # Theme functions and block registration
├── style.css               # Main theme stylesheet
├── theme.json              # Theme configuration
└── README.md               # This file
```

## Custom Blocks

### Dropdown Menu (Mega Menu)
**Block Name:** `frost-child/dropdown-menu`  
**Category:** Widgets  
**Icon:** 📋 Menu Alt

A feature-rich mega menu component with:
- Customizable button text (default: "Tjänster")
- Multi-column layout for menu items
- Each menu item supports:
  - Title and subtitle
  - Detailed description
  - Tags/keywords
  - Custom action button with link
- Location filtering buttons (e.g., Stockholm, Göteborg, Uppsala)
- Popular services quick links section
- Optional **popular services per city** (add/remove services for each city in the editor)
- Smooth animations and hover effects
- Shared page-dimming backdrop (`.dropdown-menu-backdrop`)

**Technical Details:**
- Uses server-side rendering via `render.php` for dynamic content
- Frontend interactions powered by `dropdown.js`
- Location buttons switch the visible “Populära tjänster i …” list in the dropdown (no navigation by default)
- Per-city services are stored in the block attribute `popularServicesByCity` (object map: city name → array of services)
  - If a city has no configured list, it falls back to `popularServices` and/or legacy hardcoded defaults
- Fully responsive with mobile-optimized layout

**Styling:**
- Styling lives in `blocks/dropdown-menu/style.css` (frontend) and `blocks/dropdown-menu/editor.css` (editor).

### Simple Dropdown
**Block Name:** `frost-child/simple-dropdown`  
**Category:** Widgets

A lightweight dropdown button component with two customizable links.

**Features:**
- Compact dropdown panel with two link slots
- Shares `.dropdown-menu-backdrop` with mega menu
- Portals dropdown panel to `<body>` for proper stacking
- Smooth open/close animations
- Click-outside-to-close behavior

**Technical Details:**
- Frontend behavior managed by `view.js`
- Registered via `register_block_type()` using `block.json`
- No server-side rendering required

### Flexible Navigation
**Block Name:** `frost-child/flexible-navigation`  
**Category:** Design  
**Icon:** 📱 Menu

A versatile navigation container that transforms into an off-canvas panel on mobile devices.

**Features:**
- Accepts any inner blocks (not limited to navigation links)
- Customizable breakpoint (default: `960px`)
- Mobile off-canvas panel with:
  - Toggle button with custom aria-label
  - Close button (×)
  - Smooth slide-in/out animation
  - Background scroll prevention (`body.frost-child-flex-nav-open`)
- Desktop: Standard horizontal navigation layout
- Supports `wide` and `full` alignment

**Attributes:**
- `toggleLabel` (string): Label for mobile toggle button (default: "Meny")
- `breakpoint` (number): Pixel width where mobile mode activates (default: 960)
- `quickLinksMigrated` (boolean): Internal flag for content migration

**Technical Details:**
- Frontend mobile behavior in `view.js`
- Automatically inserts close button for older content
- Uses CSS media queries based on breakpoint attribute

### Flexible Nav Link
**Block Name:** `frost-child/flexible-nav-link`  
**Category:** Design

A companion block designed specifically for use inside Flexible Navigation.

**Features:**
- Renders as styled `<a>` with class `.frost-child-flex-nav__quick-link`
- Automatically styled as button-like element in mobile off-canvas mode
- Configurable link text and URL
- Seamless integration with parent Flexible Navigation block

### Customer Reviews (Review Carousel)
**Block Name:** `frost-child/customer-reviews`  
**Category:** Widgets  
**Icon:** ⭐ Star Filled

An interactive carousel for displaying customer testimonials with ratings.

**Features:**
- Display multiple customer reviews in a sliding carousel
- Each review includes:
  - Review text (testimonial)
  - Author name
  - Date
  - Star rating (1-5 stars)
- Configurable cards to show simultaneously (default: 3)
- Optional autoplay functionality
- Adjustable autoplay speed (default: 5000ms)
- Navigation arrows (previous/next)
- Smooth sliding animations
- Fully responsive layout

**Attributes:**
- `reviews` (array): Collection of review objects with text, author, date, and rating
- `cardsToShow` (number): How many review cards to display at once (default: 3)
- `autoplay` (boolean): Enable automatic carousel rotation (default: false)
- `autoplaySpeed` (number): Milliseconds between auto-rotations (default: 5000)

**Default Reviews:**
- Includes 3 sample Swedish reviews to demonstrate functionality
- Easily customizable in block editor

**Technical Details:**
- Frontend carousel logic in `view.js`
- Smooth CSS transitions for card movements
- Touch-friendly on mobile devices
- Accessible with keyboard navigation

### Slide Image Block (Legacy)
**Note:** This is a legacy carousel block. Consider using Customer Reviews block for new implementations.

An image carousel/slider for showcasing multiple images in a rotating display, primarily used for review cards or image galleries.

## Installation

1. Ensure the Frost parent theme is installed and activated
2. Upload this folder to `/wp-content/themes/`
3. Activate "Frost Child" in the WordPress admin panel

## Dependencies

- Parent Theme: [Frost](https://wordpress.org/)
- WordPress 5.9+

## Customization

### Colors
- Primary Background: `#2c474d`
- Accent Color: `#e8b673`
- Text Color: `#2c3e50`
- Light Background: `#f5e6d3`

### Fonts
- Font Size (Dropdown): `20px`
- Font Weight (Bold): `700`

### Modify Blocks
Each block has its own:
- `edit.js` - Backend editing interface
- `render.php` - Frontend rendering (only for blocks that need dynamic markup, e.g. dropdown-menu)
- `style.css` - Block-specific styles
- `block.json` - Block configuration

## How it’s wired

- Block registration happens in `functions.php`.
	- `dropdown-menu` and `slide-image` explicitly register/enqueue scripts/styles.
	- `flexible-navigation`, `flexible-nav-link`, `simple-dropdown`, and `review-carousel` (Customer Reviews) rely on `register_block_type()` with `block.json` file references.
- There is no build pipeline (no bundler): all JS/CSS is committed as-is.
- Each block has dedicated editor and frontend scripts/styles loaded only when needed.

## Files Overview

- **functions.php**: PHP functions and theme setup
- **style.css**: Global theme styles and reviews slider
- **theme.json**: Block editor configuration and template parts

## Support

For issues or questions, refer to the WordPress block documentation or the parent Frost theme documentation.

---

**Theme Version:** 1.0.0  
**Last Updated:** February 11, 2026
