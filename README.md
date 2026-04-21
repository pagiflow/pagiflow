# Pagiflow — The High-Performance Vanilla JS Slider Library

<!-- 
Meta Description: Pagiflow is a 40KB zero-dependency vanilla JavaScript slider and carousel library. 
Designed for high-performance web apps, it supports responsive layouts, touch/swipe, grid modes, 
and fade transitions with hardware acceleration.
Keywords: vanilla js slider, javascript carousel, lightweight slider library, responsive carousel, no-dependency slider, touch-enabled slider, high-performance slider.
-->

**Pagiflow** is a high-performance, lightweight, and extremely versatile vanilla JavaScript slider library. It is engineered for modern web applications that prioritize speed, responsiveness, and advanced UI features without the overhead of external dependencies like jQuery.

<p align="center">
  <img src="assets/images/og-image.png" alt="Pagiflow Banner" width="100%">
</p>

<p align="center">
  <a href="https://github.com/pagiflow/pagiflow/stargazers"><img src="https://img.shields.io/github/stars/pagiflow/pagiflow" alt="GitHub Stars"></a>
  <img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License: MIT">
  <img src="https://img.shields.io/badge/Size-40KB%20min-green" alt="Size">
  <img src="https://img.shields.io/badge/Version-1.0.0-orange" alt="Version">
  <img src="https://img.shields.io/badge/Dependencies-Zero-brightgreen" alt="Dependencies">
</p>

---

## 📑 Table of Contents
- [Why Pagiflow?](#-why-pagiflow)
- [Key Features](#-key-features)
- [Installation](#-installation)
- [Quick Start](#-quick-start)
- [Developer Guide](#-developer-guide)
- [Browser Support](#-browser-support)
- [Useful Links](#-useful-links)
- [Contributing](#-contributing)
- [License](#-license)

---

## 💡 Why Pagiflow?
In an era where web performance is critical for SEO and user experience, Pagiflow stands out by being **dependency-free**. While libraries like Swiper are powerful, they can be overkill for performance-sensitive projects. Pagiflow provides:
- **SEO Benefits**: Fast load times improve Core Web Vitals.
- **AI-Ready Documentation**: Structured for easy parsing by AI search engines.
- **Modern Tech**: Built with ES6+ classes and hardware-accelerated CSS.

## 🚀 Key Features

- **✅ Dependency-Free**: Pure vanilla JS. No jQuery or extra libraries required.
- **✅ Ultra Lightweight**: Small footprint (~40KB minified) for lightning-fast load times.
- **✅ Fully Responsive**: Granular control over behavior at every breakpoint.
- **✅ Advanced Layouts**: Supports horizontal, vertical, grid, and fade modes.
- **✅ Rich Interaction**: Touch/swipe support, keyboard navigation, and synced thumbnails.
- **✅ Lazy Loading**: Intelligent asset loading for optimized performance.

## 📦 Installation

### 1. Via CDN (Quickest for Production)

Add these directly to your HTML's `<head>` and before `</body>`:

```html
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/gh/pagiflow/pagiflow@main/dist/css/pagiflow.min.css"
/>
<script src="https://cdn.jsdelivr.net/gh/pagiflow/pagiflow@main/dist/js/pagiflow.min.js"></script>
```

### 2. Local Setup

Download the optimized files from the `dist/` folder:

```html
<link rel="stylesheet" href="dist/css/pagiflow.min.css" />
<script src="dist/js/pagiflow.min.js"></script>
```

## 🛠 Quick Start

### HTML Structure
Minimum required HTML for a basic slider:

```html
<div id="mySlider">
  <div>Slide 1</div>
  <div>Slide 2</div>
  <div>Slide 3</div>
</div>
```

### Initialization
Initialize with just a few lines of code:

```javascript
Pagiflow("#mySlider", {
  itemsPerSlide: 1,
  nav: true,
  autoplay: true,
  autoplayDelay: 4000,
  loop: true
});
```

---

## 🏗 Developer Guide

### Architecture Overview
Pagiflow is built with a modular class-based approach, ensuring it is easy to extend and debug:
- **Factory Function (`Pagiflow`)**: Entry point for easy initialization.
- **Responsive System**: Dynamically merges settings on window resize using a debounced listener.

### Performance Optimization
- **Hardware Acceleration**: Uses `transform: translate3d` to offload rendering to the GPU.
- **Memory Efficient**: Optimized DOM manipulation only clones necessary nodes.
- **Fluid Animation**: Uses `requestAnimationFrame` for high-frequency updates.

---

## 🌐 Browser Support

| <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" width="24px" alt="Chrome"> Chrome | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" width="24px" alt="Edge"> Edge | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" width="24px" alt="Firefox"> Firefox | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" width="24px" alt="Safari"> Safari | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/opera/opera_48x48.png" width="24px" alt="Opera"> Opera |
| :---: | :---: | :---: | :---: | :---: |
| Latest ✔ | Latest ✔ | Latest ✔ | Latest ✔ | Latest ✔ |

---

## 📖 Useful Links

- 📘 [**Full Documentation**](https://www.pagiflow.com/docs)
- 🎨 [**Live Demos**](https://www.pagiflow.com/pagiflow-demos)
- ⚖️ [**Comparison: Pagiflow vs Swiper**](https://www.pagiflow.com/pagiflow-vs-swiper)

## 🤝 Contributing
We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details on how to get involved.

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---
<p align="center">Made with ❤️ for the performance-first web.</p>
