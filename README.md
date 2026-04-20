# Pagiflow

**Pagiflow** is a high-performance, lightweight, and extremely versatile vanilla JavaScript slider library. Designed for modern web applications that demand speed, responsiveness, and advanced features without the bloat of external dependencies.

<p align="center">
  <img src="assets/images/og-image.png" alt="Pagiflow Banner" width="100%">
</p>

<p align="center">
  <img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License: MIT">
  <img src="https://img.shields.io/badge/Size-40KB%20min-green" alt="Size">
  <img src="https://img.shields.io/badge/Version-1.0.0-orange" alt="Version">
  <img src="https://img.shields.io/badge/Dependencies-Zero-brightgreen" alt="Dependencies">
</p>

## 🚀 Key Features

- **Dependency-Free**: Pure vanilla JS. No jQuery or extra libraries required.
- **Ultra Lightweight**: Small footprint (~40KB minified) for lightning-fast load times.
- **Fully Responsive**: Granular control over behavior at every breakpoint.
- **Advanced Layouts**: Supports horizontal, vertical, grid, and fade modes.
- **Rich Interaction**: Touch/swipe support, keyboard navigation, and synced thumbnails.

## 📦 Installation

### 1. Via CDN (Quickest)

Add these directly to your HTML:

```html
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/gh/pagiflow/pagiflow@main/dist/css/pagiflow.min.css"
/>
<script src="https://cdn.jsdelivr.net/gh/pagiflow/pagiflow@main/dist/js/pagiflow.min.js"></script>
```

### 2. Local Setup

Download the files and include them from the `dist/` folder for production:

```html
<link rel="stylesheet" href="dist/css/pagiflow.min.css" />
<script src="dist/js/pagiflow.min.js"></script>
```

## 🛠 Quick Start

### HTML Structure

```html
<div id="mySlider">
  <div>Slide 1</div>
  <div>Slide 2</div>
  <div>Slide 3</div>
</div>
```

### Initialization

```javascript
Pagiflow("#mySlider", {
  itemsPerSlide: 1,
  nav: true,
  autoplay: true,
  autoplayDelay: 4000,
});
```

---

## 🏗 Developer Guide

### Architecture Overview

Pagiflow is built with a modular class-based approach:

- **Factory Function (`Pagiflow`)**: Entry point for easy initialization.
- **Responsive System**: Dynamically merges settings on window resize.

### Performance Optimization

- **Hardware Acceleration**: Uses `transform: translate3d` for buttery smooth transitions.
- **Memory Efficient**: Clones only necessary nodes for infinite loops.
- **Zero Jitter**: Uses `requestAnimationFrame` for auto-scrolling tickers.

---

## 🌐 Browser Support

| <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" width="24px" alt="Chrome"> | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" width="24px" alt="Edge"> | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" width="24px" alt="Firefox"> | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" width="24px" alt="Safari"> | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/opera/opera_48x48.png" width="24px" alt="Opera"> |
| :----------------------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------------------------------------: |
|                                                            Latest ✔                                                            |                                                         Latest ✔                                                         |                                                             Latest ✔                                                              |                                                            Latest ✔                                                            |                                                          Latest ✔                                                           |

---

## 📖 Useful Links

- [**Full Documentation**](https://www.pagiflow.com/docs)
- [**Live Demos**](https://www.pagiflow.com/pagiflow-demos)
- [**Comparison: Pagiflow vs Swiper**](https://www.pagiflow.com/pagiflow-vs-swiper)

## 📄 License

This project is licensed under the MIT License.
