'use strict';

var PagiflowCore = require('pagiflow');
var jsxRuntime = require('react/jsx-runtime');
var React = require('react');

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
const Slot = React.forwardRef((_a, ref) => {
    var { children } = _a, props = __rest(_a, ["children"]);
    if (React.isValidElement(children)) {
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
const PagiflowSlide = React.forwardRef((_a, ref) => {
    var { children, className, style, asChild = true } = _a, rest = __rest(_a, ["children", "className", "style", "asChild"]);
    const Comp = asChild && React.isValidElement(children) ? Slot : 'div';
    return (jsxRuntime.jsx(Comp, Object.assign({ ref: ref, className: className, style: style }, rest, { children: children })));
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
const Pagiflow = React.forwardRef((_a, ref) => {
    var { children, className, style, onSlideChange, renderNav, renderPagination, id, 
    // Extract all PagiflowOptions — anything left goes to the track div
    direction, fade, grid, gridColumns, gridFill, animate, itemsPerSlide, slidesToScroll, gap, height, startIndex, loop, speed, swipeThreshold, nav, navDisabledEnd, navigation, prevIcon, nextIcon, prevPosition, nextPosition, thumbnails, autoplay, autoplayDelay, pauseOnHover, paginate, paginationPosition, autoScroll, autoScrollSpeed, autoScrollDirection, lazyLoad, keyboard, centerMode, centerPadding, rtl, sync, responsive } = _a, rest = __rest(_a, ["children", "className", "style", "onSlideChange", "renderNav", "renderPagination", "id", "direction", "fade", "grid", "gridColumns", "gridFill", "animate", "itemsPerSlide", "slidesToScroll", "gap", "height", "startIndex", "loop", "speed", "swipeThreshold", "nav", "navDisabledEnd", "navigation", "prevIcon", "nextIcon", "prevPosition", "nextPosition", "thumbnails", "autoplay", "autoplayDelay", "pauseOnHover", "paginate", "paginationPosition", "autoScroll", "autoScrollSpeed", "autoScrollDirection", "lazyLoad", "keyboard", "centerMode", "centerPadding", "rtl", "sync", "responsive"]);
    const trackRef = React.useRef(null);
    const instanceRef = React.useRef(null);
    const onSlideChangeRef = React.useRef(onSlideChange);
    const currentIndexRef = React.useRef(startIndex !== null && startIndex !== void 0 ? startIndex : 0);
    const [, setUiTick] = React.useState(0);
    // Keep callback ref fresh
    onSlideChangeRef.current = onSlideChange;
    // Collect all Pagiflow options into one object
    const buildOptions = React.useCallback(() => {
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
            paginate, paginationPosition, autoScroll, autoScrollSpeed,
            autoScrollDirection, lazyLoad, keyboard, centerMode, centerPadding,
            rtl, sync, responsive,
        })
    ]);
    // ─── Init ──────────────────────────────────────────────────────────────────
    React.useEffect(() => {
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
    React.useEffect(() => {
        if (!instanceRef.current || instanceRef.current.destroyed)
            return;
        instanceRef.current.setOptions(buildOptions(), true);
    }, [buildOptions]);
    // ─── Imperative API ────────────────────────────────────────────────────────
    React.useImperativeHandle(ref, () => ({
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
    const next = React.useCallback(() => { var _a; return (_a = instanceRef.current) === null || _a === void 0 ? void 0 : _a.next(); }, []);
    const prev = React.useCallback(() => { var _a; return (_a = instanceRef.current) === null || _a === void 0 ? void 0 : _a.prev(); }, []);
    const goTo = React.useCallback((i, o) => { var _a; return (_a = instanceRef.current) === null || _a === void 0 ? void 0 : _a.goTo(i, o); }, []);
    // Count real slides (ignore non-element children)
    const slideCount = React.Children.count(React.Children.toArray(children).filter(React.isValidElement));
    return (jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [jsxRuntime.jsx("div", Object.assign({ ref: trackRef, id: id, className: ['pagiflow', className].filter(Boolean).join(' '), style: style }, rest, { children: children })), renderNav &&
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
    const sliderRef = React.useRef(null);
    const instanceRef = React.useRef(null);
    const optionsRef = React.useRef(options);
    const [currentIndex, setCurrentIndex] = React.useState((_a = options.startIndex) !== null && _a !== void 0 ? _a : 0);
    const [, forceUpdate] = React.useState(0);
    // Keep options ref in sync without triggering re-init
    optionsRef.current = options;
    // ─── Initialize ────────────────────────────────────────────────────────────
    React.useEffect(() => {
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
    const goTo = React.useCallback((index, opts) => {
        var _a;
        (_a = instanceRef.current) === null || _a === void 0 ? void 0 : _a.goTo(index, opts);
    }, []);
    const next = React.useCallback(() => {
        var _a;
        (_a = instanceRef.current) === null || _a === void 0 ? void 0 : _a.next();
    }, []);
    const prev = React.useCallback(() => {
        var _a;
        (_a = instanceRef.current) === null || _a === void 0 ? void 0 : _a.prev();
    }, []);
    const play = React.useCallback(() => {
        var _a;
        (_a = instanceRef.current) === null || _a === void 0 ? void 0 : _a.play();
    }, []);
    const pause = React.useCallback(() => {
        var _a;
        (_a = instanceRef.current) === null || _a === void 0 ? void 0 : _a.pause();
    }, []);
    const resume = React.useCallback(() => {
        var _a;
        (_a = instanceRef.current) === null || _a === void 0 ? void 0 : _a.resume();
    }, []);
    const togglePlayPause = React.useCallback(() => {
        var _a;
        (_a = instanceRef.current) === null || _a === void 0 ? void 0 : _a.togglePlayPause();
    }, []);
    const setOptions = React.useCallback((opts, rebuild = false) => {
        var _a;
        (_a = instanceRef.current) === null || _a === void 0 ? void 0 : _a.setOptions(opts, rebuild);
    }, []);
    const reInit = React.useCallback((opts = {}) => {
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

exports.Pagiflow = Pagiflow;
exports.PagiflowSlide = PagiflowSlide;
exports.usePagiflow = usePagiflow;
//# sourceMappingURL=index.cjs.js.map
