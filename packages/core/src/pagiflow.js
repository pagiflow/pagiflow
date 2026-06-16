/**
 * Pagiflow 4.0.1
 * A high-performance, zero-dependency slider for Vanilla JS, React, Vue, Svelte, Angular, and Solid JS.
 * https://pagiflow.com
 * https://github.com/pagiflow/pagiflow
 * Copyright 2026-PRESENT
 * Released under the MIT License
 * Released on: June 17, 2026
 */

const Pagiflow = (() => {
  const t = `data:image/svg+xml;base64,${btoa(
    '<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" fill="none"></svg>'
  )}`, i = {
    direction: "horizontal",
    fade: false,
    grid: false,
    gridColumns: 2,
    gridFill: false,
    animate: true,
    itemsPerSlide: 1,
    slidesToScroll: 1,
    gap: 8,
    height: "auto",
    startIndex: 0,
    loop: false,
    speed: 400,
    swipeThreshold: 60,
    nav: false,
    navDisabledEnd: false,
    navigation: null,
    prevIcon: "\u2039",
    nextIcon: "\u203A",
    prevPosition: null,
    nextPosition: null,
    thumbnails: {
      enabled: false,
      position: "bottom",
      thumbWidth: 80,
      gap: 5,
      sidebarHeight: null
    },
    autoplay: false,
    autoplayDelay: 3e3,
    pauseOnHover: true,
    paginate: false,
    paginationPosition: null,
    autoScroll: false,
    autoScrollSpeed: 0.5,
    autoScrollDirection: "left",
    lazyLoad: false,
    keyboard: false,
    centerMode: false,
    centerPadding: 0,
    rtl: false,
    sync: null,
    responsive: {}
  };
  function e(t2 = {}, s2 = i) {
    const n2 = { ...s2 };
    for (const i2 in t2)
      null !== t2[i2] && void 0 !== t2[i2] && ("object" != typeof t2[i2] || Array.isArray(t2[i2]) || !(i2 in s2) || "object" != typeof s2[i2] || Array.isArray(s2[i2]) ? n2[i2] = t2[i2] : n2[i2] = e(t2[i2], s2[i2]));
    return n2;
  }
  function s(t2, i2) {
    if (!t2 || !i2) return;
    if (t2.classList.add("pagiflow-nav-absolute"), "string" == typeof i2)
      return void t2.classList.add(`${i2}`);
    const e2 = ["left", "right", "top", "bottom", "transform"];
    e2.forEach((i3) => t2.style[i3] = ""), Object.entries(i2).forEach(([i3, s2]) => {
      e2.includes(i3) && (t2.style[i3] = "number" == typeof s2 ? `${s2}px` : s2);
    });
  }
  function n(t2, i2) {
    if (!t2 || !i2) return;
    if (t2.classList.add("pagiflow-pagination-absolute"), "string" == typeof i2)
      return void t2.classList.add(`${i2}`);
    const e2 = ["left", "right", "top", "bottom", "transform"];
    e2.forEach((i3) => t2.style[i3] = ""), Object.entries(i2).forEach(([i3, s2]) => {
      e2.includes(i3) && (t2.style[i3] = "number" == typeof s2 ? `${s2}px` : s2);
    });
  }
  class o {
    constructor(t2, i2) {
      this.slider = t2, this.wrapper = t2.closest(".pagiflow-wrapper") || t2.parentElement, this.prevBtn = null, this.nextBtn = null, this.options = i2, this.options.navigation?.prev && this.options.navigation?.next && (this.prevBtn = document.querySelector(
        this.options.navigation.prev
      ), this.nextBtn = document.querySelector(this.options.navigation.next), this.prevBtn && this.nextBtn || console.warn(
        "Custom nav buttons not found:",
        this.options.navigation
      )), this.direction = i2.direction, this.grid = !!i2.grid, this.gridColumns = i2.gridColumns, this.gap = i2.gap, this.height = i2.height, this.speed = this.options.speed, this.thumbnailsEnabled = i2.thumbnails.enabled, this.thumbnailsPosition = i2.thumbnails.position, this.thumbnailsThumbWidth = i2.thumbnails.thumbWidth ? "number" == typeof i2.thumbnails.thumbWidth ? `${i2.thumbnails.thumbWidth}px` : i2.thumbnails.thumbWidth : null, this.thumbnailsGap = i2.thumbnails.gap ? "number" == typeof i2.thumbnails.gap ? `${i2.thumbnails.gap}px` : i2.thumbnails.gap : null, this.thumbnailsSidebarHeight = i2.thumbnails.sidebarHeight || null, this.index = this.options.startIndex || 0, this.slides = [], this._onSlideChange = null, this._lastEmittedIndex = null, this.currentPerSlide = this.thumbnailsEnabled ? 1 : i2.itemsPerSlide, this.thumbItems = [], this.originalItems = Array.from(t2.children).map(
        (t3) => t3.cloneNode(true)
      ), this.autoScrollRAF = null, this.autoScrollOffset = 0, this.autoTimer = null, this.isPaused = false, this.isDragging = false, this.isHovering = false, this.startX = 0, this.startY = 0, this.currentX = 0, this.currentY = 0, this.paginationEl = null, this.dots = [], this.destroyed = false, this._slideClickLocked = false, this.isDragLocked = false, this.dragTimestamps = [], this.autoScroll = !!this.options.autoScroll, this.autoScrollSpeed = this.options.autoScrollSpeed, this.autoScrollDirection = (this.options.autoScrollDirection || "left").trim(), this.autoplayDelay = this.options.autoplayDelay, this.navDisabledEnd = this.options.navDisabledEnd ?? false, this.loop = !!this.options.loop, this.isLoopJumping = false, this.isAnimating = false, this.lazyObserver = null, this.slidesToScroll = i2.slidesToScroll || 1, this.centerMode = i2.centerMode, this.centerPadding = void 0 !== i2.centerPadding ? i2.centerPadding : 0, this.rtl = !!this.options.rtl, this.fade = !!i2.fade, this.gridFill = !!i2.gridFill, this.animate = !!i2.animate, this.syncTarget = null, this._syncing = false, this.init(), this._bindLoopFix();
    }
    init() {
      this.rebuild(true), this._initSync(), this.bindEvents(), this.bindSlideClick(), this.isDragging || this.autoScroll || this.autoplay ? this.slider.style.willChange = "transform" : this.slider.style.willChange = "auto", this.wrapper.addEventListener("mousedown", () => {
        this.wrapper.focus();
      }), this.wrapper.addEventListener("focusin", (t2) => {
        t2.target !== this.wrapper && this.wrapper.focus();
      }), this._setupKeyboard(), this.options.autoScroll || this.bindSwipe(), this._bindNamedEvents(), this.options.autoScroll || this.startAutoplay(), this._bindResize();
    }
    bindHoverPause() {
    }
    createOrUpdateNav(t2) {
      const i2 = this.options.navigation?.prev && this.options.navigation?.next;
      if (i2)
        return void (this.prevBtn && this.nextBtn && this.updateNavState());
      let e2 = this.wrapper.querySelector(".pagiflow-nav");
      if (false === t2.nav && !i2 || this.autoScroll)
        return e2 && e2.remove(), void (this.prevBtn = this.nextBtn = null);
      e2 || (e2 = document.createElement("div"), e2.className = "pagiflow-nav", e2.innerHTML = `
        <button class="pagiflow-prev">${t2.prevIcon || "\u2039"}</button>
        <button class="pagiflow-next">${t2.nextIcon || "\u203A"}</button>
      `, this.wrapper.appendChild(e2));
      const n2 = e2.querySelector(".pagiflow-prev"), o2 = e2.querySelector(".pagiflow-next");
      n2.setAttribute("aria-label", "Previous slide"), o2.setAttribute("aria-label", "Next slide"), n2.setAttribute("title", "Previous slide"), o2.setAttribute("title", "Next slide"), t2.prevIcon && (n2.innerHTML = t2.prevIcon), t2.nextIcon && (o2.innerHTML = t2.nextIcon), s(n2, t2.prevPosition), s(o2, t2.nextPosition), this.prevBtn = n2, this.nextBtn = o2, this.updateNavState();
    }
    updateNavState() {
      if (!this.prevBtn || !this.nextBtn || this.autoScroll) return;
      const t2 = this.options.navigation?.prev && this.options.navigation?.next, i2 = this.prevBtn.closest(".pagiflow-nav");
      if (t2 || i2.classList.toggle(
        "pagiflow-nav-hidden",
        this.slides.length <= (this.grid ? 1 : this.currentPerSlide)
      ), this.loop)
        return this.prevBtn.disabled = false, this.nextBtn.disabled = false, this.prevBtn.classList.remove("disabled"), void this.nextBtn.classList.remove("disabled");
      const e2 = this.slides.length - (this.grid ? 1 : this.currentPerSlide), s2 = this.index <= 0, n2 = this.index >= e2;
      this.prevBtn.disabled = this.navDisabledEnd && s2, this.nextBtn.disabled = this.navDisabledEnd && n2, this.prevBtn.classList.toggle("disabled", this.navDisabledEnd && s2), this.nextBtn.classList.toggle("disabled", this.navDisabledEnd && n2);
    }
    rebuild(t2 = false) {
      const i2 = this.getResponsiveSettings();
      this.direction = i2.direction ?? this.direction, this.loop = !!i2.loop, this.slidesToScroll = i2.slidesToScroll ?? this.slidesToScroll ?? 1, this.autoScroll = !!i2.autoScroll, this.autoScrollSpeed = i2.autoScrollSpeed ?? this.autoScrollSpeed, this.autoScrollDirection = ((i2.autoScrollDirection ?? this.autoScrollDirection) || "left").trim(), this.centerMode = i2.centerMode ?? this.centerMode, this.centerPadding = void 0 !== i2.centerPadding ? i2.centerPadding : 0, this.rtl = i2.rtl ?? this.rtl, this.fade = i2.fade ?? this.fade, this.gridFill = i2.gridFill ?? this.gridFill, this.animate = i2.animate ?? this.animate, this.thumbnailsPosition = i2.thumbnails.position ?? this.thumbnailsPosition, this.thumbnailsThumbWidth = i2.thumbnails.thumbWidth ? "number" == typeof i2.thumbnails.thumbWidth ? `${i2.thumbnails.thumbWidth}px` : i2.thumbnails.thumbWidth : null, this.thumbnailsGap = i2.thumbnails.gap ? "number" == typeof i2.thumbnails.gap ? `${i2.thumbnails.gap}px` : i2.thumbnails.gap : null, this.thumbnailsSidebarHeight = i2.thumbnails.sidebarHeight, this.createOrUpdateNav(i2), this._navBound || (this.bindEvents(), this._navBound = true);
      const e2 = i2.thumbnails?.enabled ?? false;
      let s2 = false;
      e2 || (s2 = i2.itemsPerSlide === this.currentPerSlide), this.thumbnailsEnabled = e2, this.stopAutoplay(), this.autoScrollRAF && (cancelAnimationFrame(this.autoScrollRAF), this.autoScrollRAF = null);
      const o2 = this.wrapper.querySelector(".pagiflow-viewport"), l = this.wrapper.querySelector(".pagiflow-thumbnails-wrapper"), r = this.wrapper.querySelector(".pagiflow-viewport");
      if (o2) {
        let t3 = this.height;
        "number" == typeof t3 && (t3 += "px"), "vertical" === this.direction ? o2.style.setProperty("--pagiflow-height", t3) : this.thumbnailsEnabled && r.style.setProperty("--pagiflow-height", t3);
      }
      if (this.wrapper.classList.remove(
        "pagiflow-direction-horizontal",
        "pagiflow-direction-vertical"
      ), this.wrapper.classList.add(
        "vertical" === this.direction ? "pagiflow-direction-vertical" : "pagiflow-direction-horizontal"
      ), this.autoScrollOffset = 0, this.currentPerSlide = this.thumbnailsEnabled ? 1 : i2.itemsPerSlide ?? this.currentPerSlide, this.layout = i2.layout ?? this.layout, this.grid = i2.grid ?? this.grid, this.gridColumns = i2.gridColumns ?? this.gridColumns, this.gap = i2.gap ?? this.gap, this.autoplay = !!i2.autoplay, this.lazyLoadEnabled = !!i2.lazyLoad, this.paginate = !!i2.paginate, this.index = 0, this.buildSlides(this.currentPerSlide), this.autoScroll || (this.buildPagination(), this.paginationEl && n(this.paginationEl, i2.paginationPosition)), !this.thumbnailsEnabled || this.autoScroll || this.grid || this.buildThumbnails(), l && l.classList.remove(
        "pagiflow-has-thumbnails",
        "pagiflow-thumbnails-top",
        "pagiflow-thumbnails-bottom",
        "pagiflow-thumbnails-left",
        "pagiflow-thumbnails-right"
      ), this.thumbnailsEnabled && !this.autoScroll && !this.grid) {
        if (l.classList.add("pagiflow-has-thumbnails"), l.classList.add(`pagiflow-thumbnails-${this.thumbnailsPosition}`), "left" === this.thumbnailsPosition || "right" === this.thumbnailsPosition) {
          let t3 = this.getResponsiveThumbsHeight();
          if (!t3) {
            const i3 = this.wrapper.querySelector(".pagiflow-viewport");
            i3 && (t3 = i3.getBoundingClientRect().height + "px");
          }
          t3 && this.thumbnailsEl.style.setProperty(
            "--pagiflow-thumbnail-height",
            t3
          );
        }
        this.thumbnailsGap && this.thumbnailsEl.style.setProperty(
          "--pagiflow-thumbnail-gap",
          this.thumbnailsGap
        );
      }
      this.wrapper.classList.toggle("pagiflow-rtl", this.rtl), !this.autoScroll || this.thumbnailsEnabled || this.grid ? this.startAutoplay() : this.startAutoScroll(), this.initLazyLoad(), this.applyLayout(), this.update(this), this._initSync(), this._slideClickLocked = false, this.bindSlideClick();
    }
    getResponsiveSettings() {
      let t2 = e({}, this.options);
      Object.keys(this.options.responsive || {}).map(Number).sort((t3, i3) => t3 - i3).forEach((i3) => {
        window.innerWidth >= i3 && (t2 = e(this.options.responsive[i3], t2));
      }), t2.itemsPerSlide || (t2.itemsPerSlide = 1), void 0 === t2.height && (t2.height = "58vh");
      const i2 = t2.thumbnails?.enabled ? 1 : t2.itemsPerSlide;
      return t2.sync && i2 !== this.originalItems.length && (t2.loop = true), this.height = t2.height, t2;
    }
    getResponsiveThumbsHeight() {
      return this.thumbnailsSidebarHeight ? "number" == typeof this.thumbnailsSidebarHeight ? `${this.thumbnailsSidebarHeight}px` : this.thumbnailsSidebarHeight : null;
    }
    _disableFocusable(t2) {
      t2.querySelectorAll(
        "a, button, input, textarea, select, [tabindex]"
      ).forEach((t3) => {
        t3.setAttribute("tabindex", "-1"), t3.setAttribute("aria-hidden", "true");
      });
    }
    buildSlides(i2 = 1) {
      let e2 = this.originalItems.map((t2) => t2.cloneNode(true));
      if (this.slider.innerHTML = "", this.slides = [], !this.autoScroll || this.thumbnailsEnabled || this.grid || (e2 = [...e2, ...this.originalItems.map((t2) => t2.cloneNode(true))]), this.lazyLoadEnabled && e2.forEach((i3) => {
        i3.querySelectorAll("img").forEach((i4) => {
          i4.dataset.src || i4.classList.contains("pagiflow-lazy") || i4.src && (i4.dataset.src = i4.src, i4.src = t, i4.classList.add("pagiflow-lazy"));
        });
      }), !this.grid || this.autoScroll || this.thumbnailsEnabled)
        e2.forEach((t2, i3) => {
          const e3 = document.createElement("div");
          e3.classList.add("pagiflow-slide"), e3.setAttribute("role", "group"), e3.setAttribute("aria-roledescription", "slide"), e3.setAttribute(
            "aria-label",
            `${i3 + 1} of ${this.originalItems.length}`
          ), e3.setAttribute("tabindex", "-1"), e3.setAttribute("data-index", i3), t2.classList.add("pagiflow-item"), e3.appendChild(t2), this.slider.appendChild(e3), this.slides.push(e3);
        });
      else {
        const t2 = this.currentPerSlide, i3 = (this.gap, Math.ceil(e2.length / t2));
        for (let s2 = 0; s2 < e2.length; s2 += t2) {
          const n2 = document.createElement("div");
          n2.classList.add("pagiflow-slide"), n2.setAttribute("role", "group"), n2.setAttribute("aria-roledescription", "slide"), n2.setAttribute("aria-label", `${s2 / t2 + 1} of ${i3}`), n2.setAttribute("data-index", s2), e2.slice(s2, s2 + t2).forEach((t3) => {
            t3.classList.add("pagiflow-item"), t3.classList.add("pagiflow-item-w-full"), n2.appendChild(t3);
          }), this.slider.appendChild(n2), this.slides.push(n2);
        }
      }
      if ((this.loop || this.centerMode) && !this.autoScroll && this.slides.length > 1) {
        const t2 = this.slides.length, i3 = Math.min(this.options.startIndex || 0, t2 - 1);
        this.cloneCount = Math.max(2 * this.currentPerSlide, 3), this.cloneCount = Math.min(this.cloneCount, t2);
        for (let i4 = 0; i4 < this.cloneCount; i4++) {
          const e3 = this.slides[t2 - 1 - i4].cloneNode(true);
          e3.classList.add("pagiflow-cloned"), e3.setAttribute("aria-hidden", "true"), e3.setAttribute("inert", ""), e3.setAttribute("tabindex", "-1"), this._disableFocusable(e3), this.slider.prepend(e3);
        }
        for (let t3 = 0; t3 < this.cloneCount; t3++) {
          const i4 = this.slides[t3].cloneNode(true);
          i4.classList.add("pagiflow-cloned"), i4.setAttribute("aria-hidden", "true"), i4.setAttribute("inert", ""), i4.setAttribute("tabindex", "-1"), this._disableFocusable(i4), this.slider.appendChild(i4);
        }
        this.slides = Array.from(this.slider.children), this.index = this.cloneCount + i3;
      } else
        this.cloneCount = 0, this.index = Math.min(
          this.options.startIndex || 0,
          this.slides.length - 1
        );
    }
    _getItemHeight(t2 = 1) {
      if (!this.height) return null;
      const i2 = this.height;
      return "number" == typeof i2 ? i2 / t2 + "px" : "string" == typeof i2 ? i2.includes("px") ? parseFloat(i2) / t2 + "px" : i2.includes("vh") ? parseFloat(i2) / t2 + "vh" : i2 : null;
    }
    _getHeight() {
      if (!this.height) return null;
      const t2 = this.height;
      return "number" == typeof t2 ? t2 + "px" : "string" == typeof t2 ? (t2.includes("px") || t2.includes("vh"), t2) : null;
    }
    applyLayout() {
      this.slider.classList.remove("pagiflow-row", "pagiflow-column"), this.slider.classList.add(
        "vertical" === this.direction ? "pagiflow-column" : "pagiflow-row"
      ), this.slider.classList.add(
        this.grid ? "pagiflow-grid" : "pagiflow-normal"
      );
      const t2 = this._isFadeActive();
      this.slider.classList.toggle("pagiflow-fade-mode", t2);
      const i2 = this.wrapper.querySelector(".pagiflow-viewport");
      if (t2 && i2) {
        let t3 = this.height;
        "number" == typeof t3 && (t3 += "px"), i2.style.setProperty("--pagiflow-height", t3);
      }
      const e2 = this.currentPerSlide, s2 = this.gap;
      if (this.slider.style.setProperty("--pagiflow-gap", `${s2}px`), !this.grid || this.autoScroll || this.thumbnailsEnabled) {
        let t3 = null, i3 = null;
        if ("vertical" == this.direction) {
          let s3 = this.grid ? Math.ceil(e2 / this.gridColumns) : e2, n2 = this.height;
          if ("number" == typeof n2) t3 = (n2 - this.gap * (s3 - 1)) / s3 + "px";
          else if ("string" == typeof n2 && n2.includes("px")) {
            t3 = (parseFloat(n2) - this.gap * (s3 - 1)) / s3 + "px";
          } else if ("string" == typeof n2 && n2.includes("vh")) {
            t3 = `calc((${parseFloat(n2)}vh - ${this.gap * (s3 - 1)}px) / ${s3})`;
          }
          i3 = "100%";
        } else
          i3 = 1 === this.currentPerSlide ? "100%" : `calc((100% - ${this.gap * (this.currentPerSlide - 1)}px) / ${this.currentPerSlide})`;
        i3 && this.slider.style.setProperty("--pagiflow-item-width", i3), t3 && this.slider.style.setProperty("--pagiflow-item-height", t3);
      } else {
        const t3 = this.gridColumns, i3 = Math.ceil(this.currentPerSlide / t3) * t3;
        this.originalItems.map((t4) => t4.cloneNode(true));
        this.slider.style.setProperty("--pagiflow-columns", t3);
        const e3 = this.originalItems.length;
        let s3 = 0;
        this.slides.forEach((t4) => {
          t4.querySelectorAll("[data-placeholder]").forEach((t5) => t5.remove());
          const n2 = t4.children.length;
          if (n2 < i3) {
            const o2 = i3 - n2;
            for (let i4 = 0; i4 < o2; i4++)
              if (this.gridFill) {
                const n3 = i4 % e3, o3 = this.originalItems[n3].cloneNode(true);
                o3.classList.add("pagiflow-item", "pagiflow-fill-item"), o3.setAttribute("aria-hidden", "true"), o3.setAttribute("data-placeholder", "true"), t4.appendChild(o3), s3++;
              } else {
                const i5 = document.createElement("div");
                i5.className = "pagiflow-placeholder", i5.setAttribute("aria-hidden", "true"), i5.setAttribute("data-placeholder", "true"), t4.appendChild(i5);
              }
          }
        });
      }
      if (this.centerMode && !this.grid && "horizontal" === this.direction) {
        this.wrapper.classList.add("pagiflow-center-enabled");
        const t3 = this._getPaddingValue(this.centerPadding);
        this.slider.style.setProperty("--pagiflow-center-padding", t3);
      } else
        this.wrapper.classList.remove("pagiflow-center-enabled"), this.slider.style.removeProperty("--pagiflow-center-padding");
    }
    buildPagination() {
      if (!this.paginate || this.autoScroll) return;
      this.paginationEl || (this.paginationEl = document.createElement("div"), this.paginationEl.className = "pagiflow-pagination", this.wrapper.appendChild(this.paginationEl));
      const t2 = this.grid ? 1 : this.currentPerSlide, i2 = this.loop || this.cloneCount > 0 ? this.slides.slice(this.cloneCount, -this.cloneCount) : this.slides, e2 = Math.ceil(i2.length / t2);
      this.paginationEl.classList.toggle("pagiflow-pagination-hidden", e2 <= 1), this.paginationEl.innerHTML = "", this.dots = [];
      for (let s2 = 0; s2 < e2; s2++) {
        const e3 = document.createElement("button");
        e3.className = "pagiflow-dot", e3.type = "button", e3.setAttribute("aria-label", `Go to slide ${s2 + 1}`), 0 === s2 && e3.classList.add("active");
        const n2 = () => {
          const e4 = t2;
          let n3 = Math.min(s2 * e4, i2.length - t2);
          this.loop ? this.index = n3 + this.cloneCount : this.index = n3, this.update(this);
        };
        e3.addEventListener("click", (t3) => {
          t3.preventDefault(), t3.stopPropagation(), n2();
        }), e3.addEventListener(
          "touchstart",
          (t3) => {
            t3.preventDefault(), t3.stopPropagation(), n2();
          },
          { passive: false }
        ), this.paginationEl.appendChild(e3), this.dots.push(e3);
      }
    }
    updatePagination() {
      if (!this.dots.length) return;
      const t2 = this._getRealIndex(), i2 = this.grid ? 1 : this.currentPerSlide || 1, e2 = this.loop || this.cloneCount > 0 ? this.slides.length - 2 * this.cloneCount : this.slides.length, s2 = this.dots.length;
      let n2;
      if (this.loop) {
        n2 = Math.floor(t2 / i2);
        t2 >= e2 - i2 && (n2 = s2 - 1);
      } else {
        n2 = t2 >= e2 - i2 ? s2 - 1 : Math.floor(t2 / i2);
      }
      n2 = Math.min(n2, s2 - 1), this.dots.forEach((t3, i3) => t3.classList.toggle("active", i3 === n2));
    }
    buildThumbnails() {
      this.thumbnailsEl && this.thumbnailsEl.remove(), this.thumbnailsEl = document.createElement("div"), this.thumbnailsEl.className = "pagiflow-thumbnails", this.thumbnailsEl.classList.add(
        `pagiflow-position-${this.thumbnailsPosition}`
      ), this.thumbItems = [], this.originalItems.forEach((t3, i3) => {
        const e2 = document.createElement("button");
        e2.className = "pagiflow-thumb", e2.type = "button", e2.setAttribute("aria-label", `Go to slide ${i3 + 1}`);
        const s2 = t3.querySelector("img");
        if (s2) {
          const t4 = document.createElement("img");
          t4.src = s2.src, t4.alt = s2.alt || "", t4.loading = "lazy", e2.appendChild(t4);
        } else e2.textContent = (i3 + 1).toString();
        this.thumbnailsEl.style.setProperty(
          "--pagiflow-thumb-width",
          this.thumbnailsThumbWidth
        ), e2.addEventListener(
          "pointerdown",
          (t4) => {
            "mouse" === t4.pointerType && 0 !== t4.button || (t4.stopPropagation(), this.goTo(i3));
          },
          { passive: false }
        ), e2.addEventListener("click", (t4) => {
          t4.preventDefault(), this.goTo(i3);
        }), this.thumbnailsEl.appendChild(e2), this.thumbItems.push(e2);
      });
      const t2 = this.wrapper.querySelector(".pagiflow-thumbnails-wrapper"), i2 = this.wrapper.querySelector(".pagiflow-viewport");
      switch (this.thumbnailsPosition) {
        case "top":
          i2.insertAdjacentElement("beforebegin", this.thumbnailsEl);
          break;
        case "bottom":
          i2.insertAdjacentElement("afterend", this.thumbnailsEl);
          break;
        case "left":
        case "right":
          t2.appendChild(this.thumbnailsEl);
          break;
        default:
          t2.insertAdjacentElement("afterend", this.thumbnailsEl);
      }
      this.updateThumbnails();
    }
    updateThumbnails() {
      if (!this.thumbnailsEnabled || !this.thumbnailsEl || !this.thumbItems.length)
        return;
      this.thumbItems.forEach((t3, i3) => {
        const e2 = i3 === this._getRealIndex();
        t3.classList.toggle("active", e2), t3.setAttribute("aria-current", e2 ? "true" : "false");
      });
      const t2 = this.thumbItems[this._getRealIndex()];
      if (!t2) return;
      const i2 = this.thumbnailsEl;
      if ("left" === this.thumbnailsPosition || "right" === this.thumbnailsPosition) {
        const e2 = t2.offsetTop - i2.offsetTop - i2.clientHeight / 2 + t2.offsetHeight / 2;
        i2.scrollTo({ top: e2, behavior: "smooth" });
      } else {
        const e2 = t2.offsetLeft - i2.offsetLeft - i2.clientWidth / 2 + t2.offsetWidth / 2;
        i2.scrollTo({ left: e2, behavior: "smooth" });
      }
    }
    update(t2 = null) {
      if (this.isLoopJumping) return;
      if (this.autoScroll) return;
      const i2 = this.loop ? this.slides.length - 1 : Math.max(0, this.slides.length - (this.grid ? 1 : this.currentPerSlide));
      if (!this.loop) {
        if (this.cloneCount > 0) {
          const minI = this.cloneCount;
          const maxI = this.cloneCount + (this.slides.length - 2 * this.cloneCount) - (this.grid ? 1 : this.currentPerSlide);
          this.index = Math.max(minI, Math.min(this.index, maxI));
        } else {
          this.index = Math.max(0, Math.min(this.index, i2));
        }
      }
      if (this.index < this.slides.length)
        if (this._isFadeActive()) this._applyFade();
        else {
          this.slider.style.willChange = "transform", this.slider.style.transform = "translate3d(0,0,0)", this.slider.style.transitionDuration = (false === this.options.animate ? 0 : this.speed) + "ms";
          const t3 = this.getTranslate();
          if (!isFinite(t3)) return;
          const i3 = this.rtl ? 1 : -1, e3 = "vertical" === this.direction ? `translate3d(0, -${t3}px, 0)` : `translate3d(${i3 * t3}px, 0, 0)`;
          if (this.slider.style.transform = e3, !this.options.animate && this.loop && !this.isDragging) {
            const t4 = this.slides.length;
            this.index >= t4 - this.cloneCount ? this._silentJump(this.cloneCount) : this.index < this.cloneCount && this._silentJump(t4 - this.cloneCount - 1);
          }
        }
      this.updatePagination(), this.updateActiveSlide(), this.updateNavState(), this.updateThumbnails(), this.lazyLoadEnabled && !("IntersectionObserver" in window) && this.lazyLoad();
      const e2 = this._getRealIndex();
      if (this._lastEmittedIndex !== e2 && (this._lastEmittedIndex = e2, this._onSlideChange && this._onSlideChange(e2)), this.syncTarget && t2 !== this.syncTarget) {
        this._syncing = true;
        const t3 = this.syncTarget;
        try {
          if (!t3._syncing) {
            t3._syncing = true;
            try {
              const i3 = t3._getRealIndex(), s2 = e2, n2 = this.slides.length - 2 * this.cloneCount;
              let o2 = s2 - i3;
              if (this.loop && t3.loop) {
                if (Math.abs(o2) > n2 / 2 && (o2 = o2 > 0 ? o2 - n2 : o2 + n2), "next" === this._lastDirection && o2 < 0 && (o2 += n2), "prev" === this._lastDirection && o2 > 0 && (o2 -= n2), t3.index += o2, !t3.options.animate && t3.loop) {
                  const i4 = t3.slides.length;
                  t3.index >= i4 - t3.cloneCount ? t3._silentJump(t3.cloneCount) : t3.index < t3.cloneCount && t3._silentJump(i4 - t3.cloneCount - 1);
                }
              } else {
                t3.index = t3.loop ? t3._getLoopTargetIndex(s2) : t3.cloneCount + s2;
              }
              t3.update();
            } finally {
              t3._syncing = false;
            }
          }
        } finally {
          this._syncing = false;
        }
      }
    }
    _applyFade() {
      this.slider.style.setProperty("--pagiflow-speed", `${this.speed}ms`), this.slider.style.transform = "none", this.slider.style.transitionDuration = "0ms", this.slides.forEach((t2, i2) => {
        const e2 = i2 === this.index;
        t2.style.opacity = e2 ? "1" : "0", t2.style.pointerEvents = e2 ? "" : "none", t2.style.transitionDuration = this.isLoopJumping || false === this.options.animate ? "0ms" : `${this.speed}ms`;
      });
    }
    updateActiveSlide() {
      const t2 = this.grid && !this.autoScroll && !this.thumbnailsEnabled, i2 = this.currentPerSlide;
      this.slides.forEach((e2, s2) => {
        let n2;
        if (n2 = t2 ? s2 === this.index : s2 >= this.index && s2 < this.index + i2, e2.classList.toggle("pagiflow-active", n2), n2 ? (e2.setAttribute("aria-hidden", "false"), e2.removeAttribute("inert")) : (e2.contains(document.activeElement) && document.activeElement.blur(), e2.setAttribute("aria-hidden", "true"), e2.setAttribute("inert", "")), e2.classList.remove("pagiflow-center-mode"), this.centerMode) {
          s2 === this.index + Math.floor(i2 / 2) && e2.classList.add("pagiflow-center-mode");
        }
      });
    }
    _scheduleAnimationReset() {
      clearTimeout(this._animationResetTimer), this._animationResetTimer = setTimeout(() => {
        this.isAnimating = false;
      }, this.speed + 100);
    }
    _bindLoopFix() {
      this._transitionEndListener = () => {
        if (clearTimeout(this._animationResetTimer), this.isAnimating = false, !this.loop)
          return;
        if (this.isDragging) return;
        if (false === this.options.animate) return;
        const t2 = this.slides.length;
        this.index >= t2 - this.cloneCount && requestAnimationFrame(() => {
          this._silentJump(this.cloneCount);
        }), this.index < this.cloneCount && requestAnimationFrame(() => {
          this._silentJump(t2 - this.cloneCount - 1);
        });
      };
      this.slider.addEventListener("transitionend", this._transitionEndListener);
    }
    _silentJump(t2) {
      if (this.isLoopJumping = true, this.slider.style.transition = "none", this.index = t2, this._isFadeActive())
        this.slides.forEach((t3, i2) => {
          const e2 = i2 === this.index;
          t3.style.opacity = e2 ? "1" : "0", t3.style.pointerEvents = e2 ? "" : "none", t3.style.transitionDuration = "0ms";
        });
      else {
        const t3 = this.rtl && "vertical" !== this.direction ? 1 : -1, i2 = this.getTranslate();
        this.slider.style.transform = "vertical" === this.direction ? `translate3d(0, -${i2}px, 0)` : `translate3d(${t3 * i2}px, 0, 0)`, this.slider.offsetHeight;
      }
      requestAnimationFrame(() => {
        false !== this.options.animate && (this.slider.style.transition = "");
      }), this.updateActiveSlide(), this.updateNavState(), this.updateThumbnails(), this.isLoopJumping = false;
    }
    initLazyLoad() {
      this.lazyLoadEnabled && ("IntersectionObserver" in window ? this.createLazyObserver() : this.lazyLoad());
    }
    lazyLoad() {
      this.lazyLoadEnabled && [-1, 0, 1].forEach((t2) => {
        const i2 = this.index + t2;
        if (i2 < 0 || i2 >= this.slides.length) return;
        const e2 = this.slides[i2];
        e2 && e2.querySelectorAll("img[data-src]").forEach((t3) => {
          if (t3.classList.contains("pagiflow-lazy-loading")) return;
          const i3 = t3.dataset.src;
          if (!i3) return;
          t3.classList.add("pagiflow-lazy-loading");
          const e3 = new Image();
          e3.src = i3, e3.onload = () => {
            t3.src = i3, t3.removeAttribute("data-src"), t3.classList.remove(
              "pagiflow-lazy",
              "pagiflow-lazy-loading"
            );
          }, e3.onerror = () => {
            t3.removeAttribute("data-src"), t3.classList.remove(
              "pagiflow-lazy",
              "pagiflow-lazy-loading"
            );
          };
        });
      });
    }
    createLazyObserver() {
      this.lazyLoadEnabled && ("IntersectionObserver" in window ? (this.lazyObserver || (this.viewport = this.wrapper.querySelector(".pagiflow-viewport"), this.lazyObserver = new IntersectionObserver(
        (t2) => {
          t2.forEach((t3) => {
            if (!t3.isIntersecting) return;
            const i2 = t3.target, e2 = i2.dataset.src;
            if (!e2) return void this.lazyObserver.unobserve(i2);
            i2.classList.add("pagiflow-lazy-loading");
            const s2 = new Image();
            s2.src = e2, s2.onload = () => {
              i2.src = e2, i2.removeAttribute("data-src"), i2.classList.remove(
                "pagiflow-lazy",
                "pagiflow-lazy-loading"
              ), this.lazyObserver.unobserve(i2);
            }, s2.onerror = () => {
              i2.removeAttribute("data-src"), i2.classList.remove(
                "pagiflow-lazy",
                "pagiflow-lazy-loading"
              ), this.lazyObserver.unobserve(i2);
            };
          });
        },
        {
          root: this.viewport || null,
          rootMargin: "100px",
          threshold: 0.1
        }
      )), this.slider.querySelectorAll("img[data-src]").forEach((t2) => {
        this.lazyObserver.observe(t2);
      })) : this.lazyLoad());
    }
    startAutoScroll() {
      if (this.autoScrollRAF) return;
      if (this.isPaused) return;
      const t2 = "vertical" !== this.direction;
      let i2 = "left" === (this.autoScrollDirection || "left").trim() ? 1 : -1;
      this.rtl && (i2 *= -1);
      const e2 = this.autoScrollSpeed * i2;
      this.slider.classList.add("pagiflow-no-transition");
      const n2 = () => {
        if (this.isPaused || !this.autoScroll)
          return void (this.autoScrollRAF = null);
        const s2 = (t2 ? this.slider.scrollWidth : this.slider.scrollHeight) / 2;
        if (s2 <= 0) return void (this.autoScrollRAF = requestAnimationFrame(n2));
        this.autoScrollOffset += e2, this.autoScrollOffset = (this.autoScrollOffset % s2 + s2) % s2;
        const i3 = t2 ? `translate3d(-${this.autoScrollOffset}px, 0, 0)` : `translate3d(0, -${this.autoScrollOffset}px, 0)`;
        this.slider.style.transform = i3, this.autoScrollRAF = requestAnimationFrame(n2);
      };
      n2();
    }
    startAutoplay() {
      !this.autoplay || this.isPaused || this.slides.length <= 1 || this.autoScroll || (this.stopAutoplay(), this.autoTimer = setInterval(() => {
        this.isDragging || this.next();
      }, this.autoplayDelay));
    }
    stopAutoplay() {
      this.autoTimer && (clearInterval(this.autoTimer), this.autoTimer = null);
    }
    bindEvents() {
      this.prevBtn && this._navPrevPD && this.prevBtn.removeEventListener("pointerdown", this._navPrevPD), this.nextBtn && this._navNextPD && this.nextBtn.removeEventListener("pointerdown", this._navNextPD);
      const t2 = (t3, i2) => {
        if ("mouse" === t3.pointerType && 0 !== t3.button) return;
        t3.preventDefault();
        const e2 = "prev" === i2 ? this.prevBtn : this.nextBtn;
        !e2 || e2.disabled || e2.classList.contains("disabled") || ("prev" === i2 ? this.prev() : this.next(), this.updateNavState());
      };
      this._navPrevPD = (i2) => t2(i2, "prev"), this._navNextPD = (i2) => t2(i2, "next"), this.prevBtn && this.prevBtn.addEventListener("pointerdown", this._navPrevPD, {
        passive: false
      }), this.nextBtn && this.nextBtn.addEventListener("pointerdown", this._navNextPD, {
        passive: false
      });
    }
    bindSwipe() {
      if (this.autoScroll) return;
      if (this.slides.length <= 1) return;
      if (this._swipeInitialized) return;
      this._swipeInitialized = true;
      this.slider.addEventListener("dragstart", (e3) => e3.preventDefault());
      let t2 = 0, i2 = 0, e2 = 0, s2 = 0;
      const n2 = (t3) => t3.touches ? t3.touches[0] : t3, o2 = (o3) => {
        if (this.isDragLocked) return;
        if (!this.isDragging) return;
        if (o3.type === "mousemove" && 0 === o3.buttons)
          return void this._onMouseUp(o3);
        const l2 = n2(o3);
        if (this.currentX = l2.clientX, this.currentY = l2.clientY, this._isFadeActive())
          return;
        if (false === this.options.animate) return;
        const r = "vertical" === this.direction ? this.currentY : this.currentX;
        let a = r - ("vertical" === this.direction ? this.startY : this.startX);
        if (this.syncTarget && !this._syncing) {
          const t3 = r - i2;
          Math.abs(t3) > 0 && (this._lastDirection = t3 < 0 ? "next" : "prev");
        }
        this.rtl && "vertical" !== this.direction && (a *= -1);
        const h = Date.now(), d = h - t2;
        d > 0 && (e2 = (r - i2) / d, i2 = r, t2 = h);
        let u = a;
        const c = this.getSlideSize(), p = this.slides.length - 2 * this.cloneCount, m = (this.slides.length, this.currentPerSlide, c * (this.cloneCount - p)), g = c * (this.cloneCount + p);
        let v = s2 - u;
        this.loop && (v < m && (u = s2 - m + 0.3 * (v - m)), v > g && (u = s2 - g + 0.3 * (v - g))), this.loop || ((this.cloneCount ? this.index <= this.cloneCount : 0 === this.index) && a > 0 || (this.cloneCount ? this.index >= this.slides.length - this.cloneCount - 1 : this.index >= this.slides.length - 1) && a < 0) && (u *= 0.4);
        const y = this.rtl && "vertical" !== this.direction ? 1 : -1, b = "vertical" === this.direction ? `translate3d(0, -${s2 - u}px, 0)` : `translate3d(${y * (s2 - u)}px, 0, 0)`;
        if (this.slider.style.transform = b, this.syncTarget && !this._syncing) {
          const t3 = this.getSlideSize();
          let i3, e3 = s2 - a, n3 = Math.round(e3 / t3);
          if (this.loop) {
            const t4 = this.slides.length - 2 * this.cloneCount;
            i3 = ((n3 - this.cloneCount) % t4 + t4) % t4;
          } else i3 = Math.max(0, Math.min(n3, this.slides.length - 1));
        }
      }, l = () => {
        if (this.wrapper.classList.remove("grabbing"), !this.isDragging)
          return;
        const t3 = "vertical" === this.direction;
        let i3 = (t3 ? this.currentY : this.currentX) - (t3 ? this.startY : this.startX);
        if (Math.abs(i3) > 5) { this._wasDragging = true; setTimeout(() => this._wasDragging = false, 50); }
        this.isDragging = false, window.getSelection().removeAllRanges();
        if (this.rtl && !t3 && (i3 *= -1), this._isFadeActive()) {
          return i3 < -t3 ? this.next() : i3 > t3 && this.prev(), void this.startAutoplay();
        }
        this.syncTarget && !this._syncing && (this._lastDirection = i3 < 0 ? "next" : "prev");
        const s3 = this.getSlideSize(), n3 = this.getTranslate();
        let o3 = 120 * e2;
        o3 = Math.max(-s3, Math.min(o3, s3));
        let l2 = n3 - i3 - o3;
        if (!this.loop) {
          if (this.cloneCount > 0) {
            const minL = this.cloneCount * s3;
            const maxL = (this.cloneCount + (this.slides.length - 2 * this.cloneCount) - (this.grid ? 1 : this.currentPerSlide)) * s3;
            l2 = Math.max(minL, Math.min(l2, maxL));
          } else {
            const t4 = (this.slides.length - (this.grid ? 1 : this.currentPerSlide)) * s3;
            l2 = Math.max(0, Math.min(l2, t4));
          }
        }
        let r, a = l2 / s3;
        const h = 0.15 * s3;
        if (r = Math.abs(i3) > h ? i3 > 0 ? Math.floor(a) : Math.ceil(a) : this.index, this.loop) {
          const t4 = 0, i4 = this.slides.length - 1;
          this.index = Math.max(t4, Math.min(r, i4));
        } else {
          if (this.cloneCount > 0) {
            const minIndex = this.cloneCount;
            const maxIndex = this.cloneCount + (this.slides.length - 2 * this.cloneCount) - (this.grid ? 1 : this.currentPerSlide);
            this.index = Math.max(minIndex, Math.min(r, maxIndex));
          } else {
            const t4 = Math.max(
              0,
              this.slides.length - (this.grid ? 1 : this.currentPerSlide)
            );
            this.index = Math.max(0, Math.min(r, t4));
          }
        }
        this.slider.style.transition = false === this.options.animate ? "none" : `${this.speed}ms ease-out`, this.update(), this.startAutoplay();
      };
      this._onSwipeStart = (o3) => {
        const r = Date.now();
        if (this.dragTimestamps.push(r), this.dragTimestamps = this.dragTimestamps.filter(
          (t3) => r - t3 < 1500
        ), this.dragTimestamps.length > 6 || this.isDragLocked)
          return this.isDragLocked = true, this.isDragging = false, this.wrapper.classList.remove("grabbing"), this.wrapper.classList.add("pagiflow-drag-locked"), this.update(), void setTimeout(() => {
            this.isDragLocked = false, this.wrapper.classList.remove("pagiflow-drag-locked"), this.dragTimestamps = [];
          }, 2500);
        const l2 = n2(o3);
        o3.target.closest("button, .pagiflow-dot") || (this.isDragging = true, this.wrapper.classList.add("grabbing"), this.startX = l2.clientX, this.startY = l2.clientY, this.currentX = this.startX, this.currentY = this.startY, i2 = "vertical" === this.direction ? this.startY : this.startX, e2 = 0, t2 = Date.now(), this._isFadeActive() || (s2 = this.getTranslate(), this.slider.style.transition = "none"), this.stopAutoplay());
      }, this._onMouseMove = o2, this._onMouseUp = l, this._onTouchMove = o2, this._onTouchEnd = l, this.wrapper.addEventListener("mousedown", this._onSwipeStart), this.wrapper.addEventListener("touchstart", this._onSwipeStart, {
        passive: true
      }), window.addEventListener("mousemove", this._onMouseMove), window.addEventListener("mouseup", this._onMouseUp), window.addEventListener("touchmove", this._onTouchMove, {
        passive: true
      }), window.addEventListener("touchend", this._onTouchEnd), window.addEventListener("touchcancel", this._onTouchEnd), this.wrapper.addEventListener("click", (e) => { if (this._wasDragging) { e.preventDefault(); e.stopPropagation(); } }, true);
    }
    _bindResize() {
      if (this._onResize) return;
      this._onResize = /* @__PURE__ */ ((t2, i2) => {
        let e2;
        return (...s2) => {
          clearTimeout(e2), e2 = setTimeout(() => t2(...s2), i2);
        };
      })(() => {
        this.destroyed || this.rebuild();
      }, 120), this._resizeBound || (window.addEventListener("resize", this._onResize), this._resizeBound = true);
      if (!this._onLoad) {
        this._onLoad = () => {
          if (this.destroyed || this.autoScroll) return;
          this.update(this);
        };
        window.addEventListener("load", this._onLoad, { once: true });
      }
      if (!this._resizeObserver && "undefined" != typeof ResizeObserver && this.wrapper) {
        let t2 = null;
        const i2 = () => {
          if (this.destroyed || this.autoScroll || this.isDragging) return;
          clearTimeout(t2), t2 = setTimeout(() => {
            this.destroyed || this.update(this);
          }, 40);
        };
        this._resizeObserver = new ResizeObserver(i2), this._resizeObserver.observe(this.wrapper);
        const e2 = this.wrapper.querySelector(".pagiflow-viewport");
        e2 && this._resizeObserver.observe(e2);
      }
    }
    getSlideSize() {
      if (!this.slides.length) return 0;
      const t2 = this.slides[0].getBoundingClientRect();
      return ("vertical" === this.direction ? t2.height : t2.width) + this.gap;
    }
    getTranslate() {
      if (!this.slides || !this.slides.length) return 0;
      const t2 = this.slides[0];
      if (!t2) return 0;
      const i2 = t2.getBoundingClientRect();
      let e2 = "vertical" === this.direction ? i2.height : i2.width;
      if (this.grid || (e2 += this.gap), !e2 || isNaN(e2) || e2 <= 0) return 0;
      const s2 = this.loop ? this.slides.length - 1 : this.cloneCount > 0 ? this.cloneCount + (this.slides.length - 2 * this.cloneCount) - (this.grid ? 1 : this.currentPerSlide) : Math.max(0, this.slides.length - (this.grid ? 1 : this.currentPerSlide));
      let n2 = this.index;
      this.loop || (n2 = Math.max(this.cloneCount || 0, Math.min(n2, s2)));
      const o2 = n2 * e2;
      return isFinite(o2) ? o2 : 0;
    }
    destroy() {
      return this.slides.length && this.goTo(0), this._animTimer && (clearTimeout(this._animTimer), this._animTimer = null), this._transitionEndListener && (this.slider.removeEventListener("transitionend", this._transitionEndListener), this._transitionEndListener = null), this.lazyObserver && (this.lazyObserver.disconnect(), this.lazyObserver = null), this.stopAutoplay(), this.autoScrollRAF && (cancelAnimationFrame(this.autoScrollRAF), this.autoScrollRAF = null), this.autoScrollOffset = 0, this.wrapper && (this.wrapper.removeEventListener("mouseenter", this._onMouseEnter), this.wrapper.removeEventListener("mouseleave", this._onMouseLeave)), this.prevBtn && this._navPrevPD && this.prevBtn.removeEventListener("pointerdown", this._navPrevPD), this.nextBtn && this._navNextPD && this.nextBtn.removeEventListener("pointerdown", this._navNextPD), this.wrapper && this._swipeInitialized && (this.wrapper.removeEventListener("mousedown", this._onSwipeStart), this.wrapper.removeEventListener("touchstart", this._onSwipeStart)), this._onMouseMove && (window.removeEventListener("mousemove", this._onMouseMove), this._onMouseMove = null), this._onMouseUp && (window.removeEventListener("mouseup", this._onMouseUp), this._onMouseUp = null), this._onTouchMove && (window.removeEventListener("touchmove", this._onTouchMove), this._onTouchMove = null), this._onTouchEnd && (window.removeEventListener("touchend", this._onTouchEnd), this._onTouchEnd = null), this.paginationEl?.parentNode && (this.paginationEl.remove(), this.paginationEl = null), this.wrapper?.parentNode && (this.wrapper.parentNode.insertBefore(this.slider, this.wrapper), this.wrapper.remove()), this._onResize && (window.removeEventListener("resize", this._onResize), this._onResize = null), this._onLoad && (window.removeEventListener("load", this._onLoad), this._onLoad = null), this._resizeObserver && (this._resizeObserver.disconnect(), this._resizeObserver = null), this._onKeyDown && this.wrapper?.removeEventListener("keydown", this._onKeyDown), this.wrapper = null, this.prevBtn = null, this.nextBtn = null, this.slides = [], this.dots = [], this.index = 0, this.isPaused = false, this.isDragging = false, this.isHovering = false, this.isDragLocked = false, this.dragTimestamps = [], this.currentPerSlide = null, this.autoTimer = null, this.autoScrollRAF = null, this.autoScrollOffset = 0, this._onSwipeStart = null, this._swipeInitialized = false, this._resizeBound = false, this.slider.dataset.pagiflowDestroyed = "true", this.destroyed = true, this.slider.style.willChange = "auto", this.slider.classList.add("pagiflow-overflow-hidden"), this._createLoader(this.slider);
    }
    reInit(t2 = {}) {
      !this.destroyed && this.destroy(), this._removeLoader(), this.options = {
        ...this.options,
        ...t2,
        responsive: {
          ...this.options.responsive || {},
          ...t2.responsive || {}
        }
      };
      let i2 = this.slider.closest(".pagiflow-wrapper"), e2 = i2 ? i2.querySelector(".pagiflow-viewport") : null;
      if (i2 && e2 && e2.contains(this.slider)) this.wrapper = i2;
      else {
        i2 && i2.parentNode && (i2.parentNode.insertBefore(this.slider, i2), i2.remove()), i2 = document.createElement("div"), i2.className = "pagiflow-wrapper", e2 = document.createElement("div"), e2.className = "pagiflow-viewport";
        const t3 = this.slider.parentNode;
        t3 && (t3.insertBefore(i2, this.slider), i2.appendChild(e2), e2.appendChild(this.slider)), this.slider.classList.add("pagiflow-track"), this.wrapper = i2;
      }
      return this.index = 0, this.slides = [], this.dots = [], this.currentPerSlide = null, this.isPaused = false, this.isDragging = false, this.isHovering = false, this.isDragLocked = false, this.dragTimestamps = [], this.autoScrollOffset = 0, this.autoScrollRAF = null, this.autoTimer = null, this.paginationEl && this.paginationEl.parentNode && (this.paginationEl.remove(), this.paginationEl = null), this.rebuild(true), this.bindEvents(), this.autoScroll || this.bindSwipe(), this._bindNamedEvents(), this.autoScroll ? this.startAutoScroll() : (this.update(this), this.startAutoplay()), this.destroyed = false, delete this.slider.dataset.pagiflowDestroyed, this.slider.classList.remove("pagiflow-overflow-hidden"), this;
    }
    play() {
      return this.isPaused = false, this.autoplay = true, this.startAutoplay(), this;
    }
    pause() {
      return this.isPaused = true, this.stopAutoplay(), this.autoScroll && this.autoScrollRAF && (cancelAnimationFrame(this.autoScrollRAF), this.autoScrollRAF = null), this;
    }
    resume() {
      return this.isPaused = false, this.autoScroll ? this.startAutoScroll() : this.startAutoplay(), this;
    }
    togglePlayPause() {
      return this.isPaused ? this.play() : this.pause(), this;
    }
    next() {
      if (this.autoScroll || this.slides.length <= 1) return this;
      if (this.isAnimating) return this;
      this.syncTarget && !this._syncing && (this._lastDirection = "next");
      const t2 = this.grid ? 1 : this.slidesToScroll || this.currentPerSlide, i2 = this.loop || this.cloneCount > 0 ? this.slides.length - 2 * this.cloneCount : this.slides.length, e2 = this.grid ? 1 : this.currentPerSlide;
      if (this.loop)
        this.isAnimating = true, this._scheduleAnimationReset(), this.index += t2;
      else {
        const s2 = (this.cloneCount || 0) + Math.max(0, i2 - e2);
        if (this.index >= s2) return this;
        this.isAnimating = true, this._scheduleAnimationReset(), this.index += t2, this.index = Math.min(this.index, s2);
      }
      return this.update(this), this;
    }
    prev() {
      if (this.autoScroll || this.slides.length <= 1) return this;
      if (this.isAnimating) return this;
      if (this.syncTarget && !this._syncing && (this._lastDirection = "prev"), this.loop) {
        if (this.index < this.cloneCount) return this;
      } else {
        const minBound = this.cloneCount || 0;
        if (this.index <= minBound) return this;
      }
      this.isAnimating = true, this._scheduleAnimationReset();
      const t2 = this.grid ? 1 : this.slidesToScroll || this.currentPerSlide;
      return this.index -= t2, this.loop || (this.index = Math.max(this.index, 0)), this.update(this), this;
    }
    _getRealIndex() {
      if (!this.loop) return this.cloneCount ? this.index - this.cloneCount : this.index;
      const t2 = this.slides.length - 2 * this.cloneCount;
      let i2 = this.index - this.cloneCount;
      return i2 = (i2 % t2 + t2) % t2, i2;
    }
    _getLoopTargetIndex(t2) {
      if (!this.loop) return t2;
      const i2 = this.slides.length - 2 * this.cloneCount, e2 = this.cloneCount + t2, s2 = [e2 - i2, e2, e2 + i2].filter((t3) => t3 >= 0 && t3 < this.slides.length);
      return s2.length ? s2.reduce(
        (t3, i3) => Math.abs(i3 - this.index) < Math.abs(t3 - this.index) ? i3 : t3,
        s2[0]
      ) : e2;
    }
    _getPaddingValue(t2) {
      return "number" == typeof t2 ? t2 + "px" : t2 || "0px";
    }
    goTo(t2, i2 = {}) {
      if (this.autoScroll || this.slides.length <= 1) return this;
      const { silent: e2 = false, instant: s2 = false } = i2;
      let n2;
      return n2 = this.loop || this.cloneCount > 0 ? Math.max(0, Math.min(t2, this.slides.length - 2 * this.cloneCount - 1)) + this.cloneCount : Math.max(0, Math.min(t2, this.slides.length - 1)), this.index = n2, e2 || (s2 ? (this.slider.style.transition = "none", this.update(this), this.slider.offsetWidth, this.slider.style.transition = "") : this.update(this)), this;
    }
    setOptions(t2 = {}, i2 = false) {
      this.options = {
        ...this.options,
        ...t2,
        responsive: {
          ...this.options.responsive || {},
          ...t2.responsive || {}
        },
        navigation: t2.navigation || this.options.navigation
      };
      const e2 = i2 || void 0 !== t2.itemsPerSlide || void 0 !== t2.slidesToScroll || void 0 !== t2.layout || void 0 !== t2.gridColumns || void 0 !== t2.gap || void 0 !== t2.autoScroll || void 0 !== t2.autoScrollSpeed || void 0 !== t2.autoScrollDirection || void 0 !== t2.autoplay || void 0 !== t2.paginate || void 0 !== t2.lazyLoad || void 0 !== t2.navigation || void 0 !== t2.nav || void 0 !== t2.prevIcon || void 0 !== t2.nextIcon || void 0 !== t2.prevPosition || void 0 !== t2.nextPosition || void 0 !== t2.fade || void 0 !== t2.centerMode || void 0 !== t2.centerPadding || void 0 !== t2.loop || void 0 !== t2.rtl;
      if (void 0 !== t2.autoplay && (this.autoplay = !!t2.autoplay, this.autoplay ? this.isPaused || this.startAutoplay() : this.stopAutoplay()), void 0 !== t2.pauseOnHover && (this.pauseOnHover = false !== t2.pauseOnHover, this._bindNamedEvents()), e2)
        this.stopAutoplay(), this.autoScrollRAF && (cancelAnimationFrame(this.autoScrollRAF), this.autoScrollRAF = null, this.autoScrollOffset = 0), this.rebuild(true);
      else {
        if (t2.prevIcon || t2.nextIcon || t2.prevPosition || t2.nextPosition || void 0 !== t2.nav) {
          const t3 = this.getResponsiveSettings();
          this.createOrUpdateNav(t3), this.updateNavState();
        }
        t2.paginationPosition && this.paginationEl && n(this.paginationEl, t2.paginationPosition), void 0 !== t2.lazyLoad && (this.lazyLoadEnabled = !!t2.lazyLoad, this.lazyLoadEnabled && this.createLazyObserver());
      }
      return this;
    }
    _bindNamedEvents() {
      this.wrapper.removeEventListener("mouseenter", this._onMouseEnter), this.wrapper.removeEventListener("mouseleave", this._onMouseLeave), this.options.pauseOnHover && (this._onMouseEnter = () => {
        this.isHovering = true, this.isPaused = true, this.autoScrollRAF && (cancelAnimationFrame(this.autoScrollRAF), this.autoScrollRAF = null), this.stopAutoplay();
      }, this._onMouseLeave = () => {
        this.isHovering = false, this.isPaused = false, this.autoScroll ? this.startAutoScroll() : this.startAutoplay();
      }, this.wrapper.addEventListener("mouseenter", this._onMouseEnter), this.wrapper.addEventListener("mouseleave", this._onMouseLeave));
    }
    _setupKeyboard() {
      this._onKeyDown = (t2) => {
        const i2 = this.getResponsiveSettings();
        if (!i2.keyboard) return;
        if (i2.autoScroll) return;
        const e2 = "vertical" === i2.direction, s2 = document.activeElement?.tagName;
        if (!("INPUT" === s2 || "TEXTAREA" === s2 || "SELECT" === s2 || document.activeElement?.isContentEditable))
          if (e2 || "ArrowUp" !== t2.key && "ArrowDown" !== t2.key) {
            if (!e2 || "ArrowLeft" !== t2.key && "ArrowRight" !== t2.key) {
              if (!e2) {
                if ("ArrowLeft" === t2.key)
                  return t2.preventDefault(), void this.prev();
                if ("ArrowRight" === t2.key)
                  return t2.preventDefault(), void this.next();
              }
              if (e2) {
                if ("ArrowUp" === t2.key)
                  return t2.preventDefault(), void this.prev();
                if ("ArrowDown" === t2.key)
                  return t2.preventDefault(), void this.next();
              }
              return "Home" === t2.key ? (t2.preventDefault(), void this.goTo(0)) : "End" === t2.key ? (t2.preventDefault(), void this.goTo(
                this.slides.length - 2 * this.cloneCount - 1
              )) : void 0;
            }
            t2.preventDefault();
          } else t2.preventDefault();
      }, this.wrapper.addEventListener("keydown", this._onKeyDown);
    }
    _createLoader(t2) {
      t2 && (this.loader || (this.loader = document.createElement("div"), this.loader.className = "pagiflow-loader", this.loader.innerHTML = '<span class="pagiflow-spinner"></span>', t2.appendChild(this.loader)));
    }
    _removeLoader() {
      this.loader && (this.loader.classList.add("fade-out"), setTimeout(() => {
        this.loader?.parentNode && this.loader.parentNode.removeChild(this.loader), this.loader = null;
      }, 200));
    }
    onSlideChange(t2) {
      return "function" == typeof t2 && (this._onSlideChange = t2), this;
    }
    html(t2) {
      if (void 0 === t2)
        return this.originalItems.map((t3) => t3.outerHTML).join("");
      if ("dom" === t2) return this.originalItems;
      const i2 = document.createElement("div");
      return i2.innerHTML = Array.isArray(t2) ? t2.join("") : t2, this.originalItems = Array.from(i2.children).map(
        (t3) => t3.cloneNode(true)
      ), this.index = 0, this.rebuild(true), this;
    }
    _isFadeActive() {
      return this.fade && !this.grid && !this.autoScroll && "vertical" !== this.direction && this.currentPerSlide <= 1;
    }
    _initSync() {
      if (!this.options.sync) return;
      let t2 = null;
      if (this.options.sync instanceof o) t2 = this.options.sync;
      else if ("string" == typeof this.options.sync) {
        const i2 = document.querySelector(this.options.sync);
        if (i2) {
          if (!i2.pagiflowInstance)
            return void setTimeout(() => this._initSync(), 50);
          t2 = i2.pagiflowInstance;
        }
      }
      t2 && t2 !== this && this.syncTarget !== t2 && (this.syncTarget = t2, t2.syncTarget = this, this._syncing = false, t2._syncing = false);
    }
    bindSlideClick() {
      this.syncTarget && (this._delegatedClickHandler && this.slider.removeEventListener("click", this._delegatedClickHandler), this._delegatedClickHandler = (t2) => {
        if (this.isDragging || this.isAnimating || this._slideClickLocked)
          return;
        if (t2.target.closest("a, button")) return;
        const i2 = Math.abs(this.currentX - this.startX), e2 = Math.abs(this.currentY - this.startY);
        if (i2 > 5 || e2 > 5) return;
        const s2 = t2.target.closest(".pagiflow-slide");
        if (!s2) return;
        const n2 = Number.parseInt(s2.getAttribute("data-index"), 10);
        if (!Number.isInteger(n2)) return;
        this._slideClickLocked = true, this.isAnimating = true, this.index = this._getLoopTargetIndex(n2), this.update(this.syncTarget);
        const o2 = this.syncTarget;
        o2 && (o2.isAnimating = true, o2.index = o2._getLoopTargetIndex(n2), o2.update(this)), clearTimeout(this._animTimer), this._animTimer = setTimeout(() => {
          this.isAnimating = false, o2 && (o2.isAnimating = false), this._slideClickLocked = false;
        }, this.speed);
      }, this.slider.addEventListener("click", this._delegatedClickHandler));
    }
  }
  return function(t2, i2 = {}) {
    if (t2 && typeof t2 === "object" && !t2.nodeType && typeof t2.length !== "number") {
      i2 = t2;
      t2 = i2.slider;
    }
    if (!t2) return console.warn("Pagiflow: target missing"), null;
    const s2 = [];
    const elements = typeof t2 === "string" ? document.querySelectorAll(t2) : t2.nodeType ? [t2] : Array.from(t2);
    elements.forEach((t3) => {
      if (i2.html && !t3.dataset.pagiflowInjected && (t3.innerHTML = Array.isArray(i2.html) ? i2.html.join("") : i2.html, t3.dataset.pagiflowInjected = "true"), t3.closest(".pagiflow-wrapper"))
        return;
      const n2 = e(i2), l = document.createElement("div");
      l.className = "pagiflow-wrapper", l.setAttribute("role", "region"), l.setAttribute("aria-roledescription", "carousel"), l.setAttribute("aria-label", "Pagiflow Carousel"), l.setAttribute("aria-atomic", "false"), l.setAttribute("tabindex", "0");
      const r = document.createElement("div");
      let a, h;
      r.className = "pagiflow-viewport", r.setAttribute("aria-live", "polite"), t3.parentNode.insertBefore(l, t3);
      let d = null;
      !n2.thumbnails.enabled || n2.autoScroll || n2.grid ? l.appendChild(r) : (d = document.createElement("div"), d.className = "pagiflow-thumbnails-wrapper", l.appendChild(d), d.appendChild(r)), r.appendChild(t3), t3.classList.add("pagiflow", "pagiflow-track"), t3.setAttribute("tabindex", "0"), n2.navigation?.prev && n2.navigation?.next && (a = document.querySelector(n2.navigation.prev), h = document.querySelector(n2.navigation.next), a && h || console.warn("Custom nav buttons not found:", n2.navigation));
      const u = new o(t3, n2);
      t3.pagiflowInstance = u, s2.push(u);
    });
    return 1 === s2.length ? s2[0] : s2;
  };
})();

if (typeof window !== "undefined") {
  window.Pagiflow = Pagiflow;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = Pagiflow;
  module.exports.default = Pagiflow;
}