import PagiflowCore from 'pagiflow';
import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import React, { forwardRef, isValidElement, useRef, useState, useCallback, useEffect, useImperativeHandle, Children } from 'react';

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol, Iterator */


function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

// ─── Pagiflow loader (same as hook, kept local to avoid circular) ─────────────
function getPagiflow$1() {
    var _a;
    if (typeof window !== 'undefined' && window.Pagiflow) {
        return window.Pagiflow;
    }
    return ((_a = PagiflowCore.default) !== null && _a !== void 0 ? _a : PagiflowCore);
}
function initPagiflowFromElement$1(ctor, el, opts) {
    const attrValue = `pf-${Math.random().toString(36).slice(2)}`;
    const selector = `[data-pagiflow-react-id="${attrValue}"]`;
    el.setAttribute('data-pagiflow-react-id', attrValue);
    const bySelector = ctor(selector, opts);
    if (!bySelector) {
        el.removeAttribute('data-pagiflow-react-id');
        return null;
    }
    return bySelector;
}
// ─── Slot Component for asChild pattern ──────────────────────────────────────────
const Slot = forwardRef((_a, ref) => {
    var { children } = _a, props = __rest(_a, ["children"]);
    if (isValidElement(children)) {
        const clonedProps = Object.assign(Object.assign(Object.assign({}, props), children.props), { style: Object.assign(Object.assign({}, props.style), children.props.style), className: [props.className, children.props.className].filter(Boolean).join(' ') || undefined });
        const childRef = children.ref;
        if (ref || childRef) {
            clonedProps.ref = (node) => {
                if (typeof childRef === 'function')
                    childRef(node);
                else if (childRef && 'current' in childRef)
                    childRef.current = node;
                if (typeof ref === 'function')
                    ref(node);
                else if (ref && 'current' in ref)
                    ref.current = node;
            };
        }
        return React.cloneElement(children, clonedProps);
    }
    return null;
});
Slot.displayName = 'Slot';
/**
 * Wrapper for individual slides. Each direct child of `<Pagiflow>` becomes
 * a slide. By default (`asChild: true`), this acts as a Slot and merges
 * its props into the child element to avoid an extra wrapper `<div>`.
 * Pass `asChild={false}` to explicitly render a wrapper `<div>`.
 */
const PagiflowSlide = forwardRef((_a, ref) => {
    var { children, className, style, asChild = true } = _a, rest = __rest(_a, ["children", "className", "style", "asChild"]);
    const Comp = asChild && isValidElement(children) ? Slot : 'div';
    return (jsx(Comp, Object.assign({ ref: ref, className: className, style: style }, rest, { children: children })));
});
PagiflowSlide.displayName = 'PagiflowSlide';
// ─── <Pagiflow> component ─────────────────────────────────────────────────────
/**
 * Drop-in React component wrapping the Pagiflow core.
 *
 * @example
 * <Pagiflow loop nav paginate onSlideChange={setIdx}>
 *   <PagiflowSlide><img src="..." /></PagiflowSlide>
 *   <PagiflowSlide><img src="..." /></PagiflowSlide>
 * </Pagiflow>
 */
const Pagiflow = forwardRef((_a, ref) => {
    var { children, className, style, onSlideChange, renderNav, renderPagination, id, 
    // Extract all PagiflowOptions — anything left goes to the track div
    direction, fade, grid, gridColumns, gridFill, animate, itemsPerSlide, slidesToScroll, gap, height, startIndex, loop, speed, swipeThreshold, nav, navDisabledEnd, navigation, prevIcon, nextIcon, prevPosition, nextPosition, thumbnails, autoplay, autoplayDelay, pauseOnHover, paginate, paginationPosition, paginationType, autoplayProgress, freeMode, freeModeMomentum, draggable, on, autoScroll, autoScrollSpeed, autoScrollDirection, lazyLoad, keyboard, centerMode, centerPadding, rtl, sync, responsive } = _a, rest = __rest(_a, ["children", "className", "style", "onSlideChange", "renderNav", "renderPagination", "id", "direction", "fade", "grid", "gridColumns", "gridFill", "animate", "itemsPerSlide", "slidesToScroll", "gap", "height", "startIndex", "loop", "speed", "swipeThreshold", "nav", "navDisabledEnd", "navigation", "prevIcon", "nextIcon", "prevPosition", "nextPosition", "thumbnails", "autoplay", "autoplayDelay", "pauseOnHover", "paginate", "paginationPosition", "paginationType", "autoplayProgress", "freeMode", "freeModeMomentum", "draggable", "on", "autoScroll", "autoScrollSpeed", "autoScrollDirection", "lazyLoad", "keyboard", "centerMode", "centerPadding", "rtl", "sync", "responsive"]);
    const trackRef = useRef(null);
    const instanceRef = useRef(null);
    const onSlideChangeRef = useRef(onSlideChange);
    const currentIndexRef = useRef(startIndex !== null && startIndex !== void 0 ? startIndex : 0);
    const [, setUiTick] = useState(0);
    // Keep callback ref fresh
    onSlideChangeRef.current = onSlideChange;
    // Collect all Pagiflow options into one object
    const buildOptions = useCallback(() => {
        const opts = {};
        if (direction !== undefined)
            opts.direction = direction;
        if (fade !== undefined)
            opts.fade = fade;
        if (grid !== undefined)
            opts.grid = grid;
        if (gridColumns !== undefined)
            opts.gridColumns = gridColumns;
        if (gridFill !== undefined)
            opts.gridFill = gridFill;
        if (animate !== undefined)
            opts.animate = animate;
        if (itemsPerSlide !== undefined)
            opts.itemsPerSlide = itemsPerSlide;
        if (slidesToScroll !== undefined)
            opts.slidesToScroll = slidesToScroll;
        if (gap !== undefined)
            opts.gap = gap;
        if (height !== undefined)
            opts.height = height;
        if (startIndex !== undefined)
            opts.startIndex = startIndex;
        if (loop !== undefined)
            opts.loop = loop;
        if (speed !== undefined)
            opts.speed = speed;
        if (swipeThreshold !== undefined)
            opts.swipeThreshold = swipeThreshold;
        if (nav !== undefined)
            opts.nav = nav;
        if (navDisabledEnd !== undefined)
            opts.navDisabledEnd = navDisabledEnd;
        if (navigation !== undefined)
            opts.navigation = navigation;
        if (prevIcon !== undefined)
            opts.prevIcon = prevIcon;
        if (nextIcon !== undefined)
            opts.nextIcon = nextIcon;
        if (prevPosition !== undefined)
            opts.prevPosition = prevPosition;
        if (nextPosition !== undefined)
            opts.nextPosition = nextPosition;
        if (thumbnails !== undefined)
            opts.thumbnails = thumbnails;
        if (autoplay !== undefined)
            opts.autoplay = autoplay;
        if (autoplayDelay !== undefined)
            opts.autoplayDelay = autoplayDelay;
        if (pauseOnHover !== undefined)
            opts.pauseOnHover = pauseOnHover;
        if (paginate !== undefined)
            opts.paginate = paginate;
        if (paginationPosition !== undefined)
            opts.paginationPosition = paginationPosition;
        if (paginationType !== undefined)
            opts.paginationType = paginationType;
        if (autoplayProgress !== undefined)
            opts.autoplayProgress = autoplayProgress;
        if (freeMode !== undefined)
            opts.freeMode = freeMode;
        if (freeModeMomentum !== undefined)
            opts.freeModeMomentum = freeModeMomentum;
        if (draggable !== undefined)
            opts.draggable = draggable;
        if (on !== undefined)
            opts.on = on;
        if (autoScroll !== undefined)
            opts.autoScroll = autoScroll;
        if (autoScrollSpeed !== undefined)
            opts.autoScrollSpeed = autoScrollSpeed;
        if (autoScrollDirection !== undefined)
            opts.autoScrollDirection = autoScrollDirection;
        if (lazyLoad !== undefined)
            opts.lazyLoad = lazyLoad;
        if (keyboard !== undefined)
            opts.keyboard = keyboard;
        if (centerMode !== undefined)
            opts.centerMode = centerMode;
        if (centerPadding !== undefined)
            opts.centerPadding = centerPadding;
        if (rtl !== undefined)
            opts.rtl = rtl;
        if (sync !== undefined)
            opts.sync = sync;
        if (responsive !== undefined)
            opts.responsive = responsive;
        return opts;
    }, [
        // Only recreate buildOptions when the serialized options change
        // eslint-disable-next-line react-hooks/exhaustive-deps
        JSON.stringify({
            direction, fade, grid, gridColumns, gridFill, animate, itemsPerSlide,
            slidesToScroll, gap, height, startIndex, loop, speed, swipeThreshold,
            nav, navDisabledEnd, navigation, prevIcon, nextIcon, prevPosition,
            nextPosition, thumbnails, autoplay, autoplayDelay, pauseOnHover,
            paginate, paginationPosition, paginationType, autoScroll, autoScrollSpeed,
            autoplayProgress, freeMode, freeModeMomentum, draggable, on,
            autoScrollDirection, lazyLoad, keyboard, centerMode, centerPadding,
            rtl, sync, responsive,
        })
    ]);
    // ─── Init ──────────────────────────────────────────────────────────────────
    useEffect(() => {
        const el = trackRef.current;
        if (!el)
            return;
        const existing = el.pagiflowInstance;
        if (existing && !existing.destroyed)
            return;
        // Save complete pristine React DOM state
        const originalChildren = Array.from(el.children);
        const originalClasses = el.className;
        const originalStyle = el.getAttribute('style');
        const PagiflowCtor = getPagiflow$1();
        if (!PagiflowCtor) {
            console.error('[Pagiflow] Core not found. Install pagiflow or load it via CDN.');
            return;
        }
        const inst = initPagiflowFromElement$1(PagiflowCtor, el, buildOptions());
        if (!inst)
            return;
        el.pagiflowInstance = inst;
        const syncLayout = () => {
            var _a;
            const api = inst;
            (_a = api.update) === null || _a === void 0 ? void 0 : _a.call(api);
        };
        // Ensure correct sizing after React paints and fonts/layout settle.
        const raf1 = window.requestAnimationFrame(() => syncLayout());
        const raf2 = window.requestAnimationFrame(() => syncLayout());
        const timeoutId = window.setTimeout(() => syncLayout(), 80);
        window.addEventListener('load', syncLayout, { once: true });
        let resizeObserver = null;
        if (typeof ResizeObserver !== 'undefined') {
            resizeObserver = new ResizeObserver(() => syncLayout());
            resizeObserver.observe(el);
        }
        inst.onSlideChange((idx) => {
            var _a;
            currentIndexRef.current = idx;
            (_a = onSlideChangeRef.current) === null || _a === void 0 ? void 0 : _a.call(onSlideChangeRef, idx);
            if (renderNav || renderPagination) {
                setUiTick((n) => n + 1);
            }
        });
        instanceRef.current = inst;
        if (renderNav || renderPagination) {
            setUiTick((n) => n + 1);
        }
        return () => {
            window.cancelAnimationFrame(raf1);
            window.cancelAnimationFrame(raf2);
            window.clearTimeout(timeoutId);
            window.removeEventListener('load', syncLayout);
            resizeObserver === null || resizeObserver === void 0 ? void 0 : resizeObserver.disconnect();
            if (instanceRef.current && !instanceRef.current.destroyed) {
                try {
                    instanceRef.current.destroy();
                }
                catch ( /* ignore */_a) { /* ignore */ }
            }
            delete el.pagiflowInstance;
            instanceRef.current = null;
            // Fully restore DOM to pristine React state
            el.innerHTML = '';
            originalChildren.forEach(child => el.appendChild(child));
            el.className = originalClasses;
            if (originalStyle !== null) {
                el.setAttribute('style', originalStyle);
            }
            else {
                el.removeAttribute('style');
            }
            el.removeAttribute('data-pagiflow-react-id');
            delete el.dataset.pagiflowDestroyed;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    // Keep core options in sync with prop changes after initial mount.
    useEffect(() => {
        if (!instanceRef.current || instanceRef.current.destroyed)
            return;
        instanceRef.current.setOptions(buildOptions(), true);
    }, [buildOptions]);
    // ─── Imperative API ────────────────────────────────────────────────────────
    useImperativeHandle(ref, () => ({
        get instance() { return instanceRef.current; },
        next: () => { var _a; return (_a = instanceRef.current) === null || _a === void 0 ? void 0 : _a.next(); },
        prev: () => { var _a; return (_a = instanceRef.current) === null || _a === void 0 ? void 0 : _a.prev(); },
        goTo: (i, o) => { var _a; return (_a = instanceRef.current) === null || _a === void 0 ? void 0 : _a.goTo(i, o); },
        play: () => { var _a; return (_a = instanceRef.current) === null || _a === void 0 ? void 0 : _a.play(); },
        pause: () => { var _a; return (_a = instanceRef.current) === null || _a === void 0 ? void 0 : _a.pause(); },
        resume: () => { var _a; return (_a = instanceRef.current) === null || _a === void 0 ? void 0 : _a.resume(); },
        togglePlayPause: () => { var _a; return (_a = instanceRef.current) === null || _a === void 0 ? void 0 : _a.togglePlayPause(); },
        setOptions: (o, r) => { var _a; return (_a = instanceRef.current) === null || _a === void 0 ? void 0 : _a.setOptions(o, r); },
        reInit: (o) => { var _a; return (_a = instanceRef.current) === null || _a === void 0 ? void 0 : _a.reInit(o); },
    }), []);
    // ─── Helpers ───────────────────────────────────────────────────────────────
    const next = useCallback(() => { var _a; return (_a = instanceRef.current) === null || _a === void 0 ? void 0 : _a.next(); }, []);
    const prev = useCallback(() => { var _a; return (_a = instanceRef.current) === null || _a === void 0 ? void 0 : _a.prev(); }, []);
    const goTo = useCallback((i, o) => { var _a; return (_a = instanceRef.current) === null || _a === void 0 ? void 0 : _a.goTo(i, o); }, []);
    // Count real slides (ignore non-element children)
    const slideCount = Children.count(Children.toArray(children).filter(isValidElement));
    return (jsxs(Fragment, { children: [jsx("div", Object.assign({ ref: trackRef, id: id, className: ['pagiflow', className].filter(Boolean).join(' '), style: style }, rest, { children: children })), renderNav &&
                renderNav({
                    next,
                    prev,
                    currentIndex: currentIndexRef.current,
                    instance: instanceRef.current,
                }), renderPagination &&
                renderPagination({
                    goTo: (i) => goTo(i),
                    currentIndex: currentIndexRef.current,
                    total: slideCount,
                    instance: instanceRef.current,
                })] }));
});
Pagiflow.displayName = 'Pagiflow';

// ─── Pagiflow loader ─────────────────────────────────────────────────────────
// Resolves the Pagiflow constructor from window (CDN) or require('pagiflow')
function getPagiflow() {
    var _a;
    if (typeof window !== 'undefined' && window.Pagiflow) {
        return window.Pagiflow;
    }
    return (_a = PagiflowCore.default) !== null && _a !== void 0 ? _a : PagiflowCore;
}
function initPagiflowFromElement(ctor, el, opts) {
    const attrValue = `pf-${Math.random().toString(36).slice(2)}`;
    const selector = `[data-pagiflow-react-id="${attrValue}"]`;
    el.setAttribute('data-pagiflow-react-id', attrValue);
    const bySelector = ctor(selector, opts);
    if (!bySelector) {
        el.removeAttribute('data-pagiflow-react-id');
        return null;
    }
    return bySelector;
}
// ─── usePagiflow ─────────────────────────────────────────────────────────────
/**
 * Core hook to initialize and control a Pagiflow slider.
 *
 * @example
 * const { sliderRef, next, prev, currentIndex } = usePagiflow({ loop: true, nav: true });
 * return (
 *   <div ref={sliderRef as React.Ref<HTMLDivElement>}>
 *     <div>Slide 1</div>
 *     <div>Slide 2</div>
 *   </div>
 * );
 */
function usePagiflow(options = {}) {
    var _a;
    const sliderRef = useRef(null);
    const instanceRef = useRef(null);
    const optionsRef = useRef(options);
    const [currentIndex, setCurrentIndex] = useState((_a = options.startIndex) !== null && _a !== void 0 ? _a : 0);
    const [, forceUpdate] = useState(0);
    // Keep options ref in sync without triggering re-init
    optionsRef.current = options;
    // ─── Initialize ────────────────────────────────────────────────────────────
    useEffect(() => {
        const el = sliderRef.current;
        if (!el)
            return;
        const existing = el.pagiflowInstance;
        if (existing && !existing.destroyed)
            return;
        // Save complete pristine React DOM state
        const originalChildren = Array.from(el.children);
        const originalClasses = el.className;
        const originalStyle = el.getAttribute('style');
        let inst;
        const Pagiflow = getPagiflow();
        if (!Pagiflow) {
            console.error('[usePagiflow] Pagiflow core not found. Install pagiflow or load it via CDN.');
            return;
        }
        inst = initPagiflowFromElement(Pagiflow, el, optionsRef.current);
        if (!inst)
            return;
        el.pagiflowInstance = inst;
        const syncLayout = () => {
            var _a;
            const api = inst;
            (_a = api.update) === null || _a === void 0 ? void 0 : _a.call(api);
        };
        const raf1 = window.requestAnimationFrame(() => syncLayout());
        const raf2 = window.requestAnimationFrame(() => syncLayout());
        const timeoutId = window.setTimeout(() => syncLayout(), 80);
        window.addEventListener('load', syncLayout, { once: true });
        let resizeObserver = null;
        if (typeof ResizeObserver !== 'undefined') {
            resizeObserver = new ResizeObserver(() => syncLayout());
            resizeObserver.observe(el);
        }
        // Track slide changes
        inst.onSlideChange((idx) => {
            setCurrentIndex(idx);
        });
        instanceRef.current = inst;
        forceUpdate((n) => n + 1); // expose instance to consumers
        return () => {
            window.cancelAnimationFrame(raf1);
            window.cancelAnimationFrame(raf2);
            window.clearTimeout(timeoutId);
            window.removeEventListener('load', syncLayout);
            resizeObserver === null || resizeObserver === void 0 ? void 0 : resizeObserver.disconnect();
            if (instanceRef.current && !instanceRef.current.destroyed) {
                try {
                    instanceRef.current.destroy();
                }
                catch (_a) {
                    // ignore destroy errors on unmount
                }
            }
            delete el.pagiflowInstance;
            instanceRef.current = null;
            // Fully restore DOM to pristine React state
            el.innerHTML = '';
            originalChildren.forEach(child => el.appendChild(child));
            el.className = originalClasses;
            if (originalStyle !== null) {
                el.setAttribute('style', originalStyle);
            }
            else {
                el.removeAttribute('style');
            }
            el.removeAttribute('data-pagiflow-react-id');
            delete el.dataset.pagiflowDestroyed;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // intentionally empty — init once on mount
    // ─── Stable API ────────────────────────────────────────────────────────────
    const goTo = useCallback((index, opts) => {
        var _a;
        (_a = instanceRef.current) === null || _a === void 0 ? void 0 : _a.goTo(index, opts);
    }, []);
    const next = useCallback(() => {
        var _a;
        (_a = instanceRef.current) === null || _a === void 0 ? void 0 : _a.next();
    }, []);
    const prev = useCallback(() => {
        var _a;
        (_a = instanceRef.current) === null || _a === void 0 ? void 0 : _a.prev();
    }, []);
    const play = useCallback(() => {
        var _a;
        (_a = instanceRef.current) === null || _a === void 0 ? void 0 : _a.play();
    }, []);
    const pause = useCallback(() => {
        var _a;
        (_a = instanceRef.current) === null || _a === void 0 ? void 0 : _a.pause();
    }, []);
    const resume = useCallback(() => {
        var _a;
        (_a = instanceRef.current) === null || _a === void 0 ? void 0 : _a.resume();
    }, []);
    const togglePlayPause = useCallback(() => {
        var _a;
        (_a = instanceRef.current) === null || _a === void 0 ? void 0 : _a.togglePlayPause();
    }, []);
    const setOptions = useCallback((opts, rebuild = false) => {
        var _a;
        (_a = instanceRef.current) === null || _a === void 0 ? void 0 : _a.setOptions(opts, rebuild);
    }, []);
    const reInit = useCallback((opts = {}) => {
        var _a;
        (_a = instanceRef.current) === null || _a === void 0 ? void 0 : _a.reInit(opts);
    }, []);
    return {
        sliderRef,
        instance: instanceRef.current,
        currentIndex,
        goTo,
        next,
        prev,
        play,
        pause,
        resume,
        togglePlayPause,
        setOptions,
        reInit,
    };
}

export { Pagiflow, PagiflowSlide, usePagiflow };
//# sourceMappingURL=index.esm.js.map
