# Frost Child Theme

A modern WordPress child theme built on top of the Frost parent theme, featuring custom blocks and interactive components for service-based businesses.

## Features

- **Dropdown Menu Block**: A customizable dropdown menu with multiple columns, location filtering, and popular services
- **Slide Image Block**: Carousel/slider component for displaying images
- **Custom Styling**: Modern design with smooth animations and transitions
- **Responsive Design**: Mobile-friendly layout that adapts to all screen sizes
- **Header & Footer Parts**: Customizable template parts for consistent branding

## Project Structure

```
Frost-Child/
├── assets/                 # Theme assets folder
├── blocks/                 # Custom Gutenberg blocks
│   ├── dropdown-menu/     # Dropdown menu button block
│   │   ├── block.json
│   │   ├── dropdown.js
│   │   ├── edit.js
│   │   ├── editor.css
│   │   ├── render.php
│   │   └── style.css
│   └── slide-image/       # Image carousel/slider block
│       ├── block.json
│       ├── carousel.js
│       ├── edit.js
│       ├── editor.css
│       └── style.css
├── parts/                  # Template parts
│   ├── footer.html
│   └── header.html
├── functions.php          # Theme functions
├── style.css              # Main theme styles
├── theme.json             # Theme configuration
└── README.md              # This file
```

## Custom Blocks

### Dropdown Menu Block
A feature-rich dropdown menu component with:
- Customizable button text
- Multi-column layout for menu items
- Location filtering buttons
- Popular services section
- "Read more" action buttons
- Smooth animations and hover effects

**Styling:**
- Background: `#2c474d`
- Font Size: `20px`
- Font Weight: `700` (Bold)
- Hover Color: `#5b797c`

### Slide Image Block
An image carousel/slider for showcasing multiple images in a rotating display.

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
- `render.php` - Frontend rendering
- `style.css` - Block-specific styles
- `block.json` - Block configuration

## Files Overview

- **functions.php**: PHP functions and theme setup
- **style.css**: Global theme styles and reviews slider
- **theme.json**: Block editor configuration and template parts

## Support

For issues or questions, refer to the WordPress block documentation or the parent Frost theme documentation.

---

**Theme Version:** 1.0.0  
**Last Updated:** January 28, 2026
