'use strict';

require('pagiflow');
var web = require('solid-js/web');
var solidJs = require('solid-js');

var _tmpl$ = /*#__PURE__*/web.template(`<div class=pagiflow-solid-wrapper style=display:contents><div>`);
function getPagiflow$1() {
  var _a;
  if (typeof window !== 'undefined' && window.Pagiflow) {
    return window.Pagiflow;
  }
  try {
    const mod = require('pagiflow');
    return (_a = mod.default) !== null && _a !== void 0 ? _a : mod;
  } catch (_b) {
    return null;
  }
}
// ─── Component ────────────────────────────────────────────────────────────────
/**
 * Drop-in SolidJS component wrapping the Pagiflow core.
 *
 * @example
 * <Pagiflow loop nav onSlideChange={setIdx}>
 *   <div>Slide 1</div>
 *   <div>Slide 2</div>
 * </Pagiflow>
 */
const Pagiflow = props => {
  var _a, _b, _c;
  // Split component-specific props away from PagiflowOptions
  const [local, options] = solidJs.splitProps(props, ['children', 'class', 'style', 'id', 'onSlideChange', 'renderNav', 'renderPagination']);
  let trackEl;
  let instance = null;
  const [currentIndex, setCurrentIndex] = solidJs.createSignal((_a = options.startIndex) !== null && _a !== void 0 ? _a : 0);
  // ─── Init ──────────────────────────────────────────────────────────────────
  solidJs.onMount(() => {
    const existing = trackEl.pagiflowInstance;
    if (existing && !existing.destroyed) return;
    const PagiflowCtor = getPagiflow$1();
    if (!PagiflowCtor) {
      console.error('[Pagiflow] Core not found. Install pagiflow or load it via CDN.');
      return;
    }
    const attrValue = `pf-${Math.random().toString(36).slice(2)}`;
    const selector = `[data-pagiflow-solid-id="${attrValue}"]`;
    trackEl.setAttribute('data-pagiflow-solid-id', attrValue);
    // options contains all PagiflowOptions after splitProps
    const inst = PagiflowCtor(selector, options);
    if (!inst) {
      trackEl.removeAttribute('data-pagiflow-solid-id');
      return;
    }
    const syncLayout = () => {
      var _a, _b;
      (_b = (_a = inst).update) === null || _b === void 0 ? void 0 : _b.call(_a);
    };
    const raf1 = requestAnimationFrame(() => syncLayout());
    const raf2 = requestAnimationFrame(() => syncLayout());
    const timeoutId = setTimeout(() => syncLayout(), 80);
    window.addEventListener('load', syncLayout, {
      once: true
    });
    let resizeObserver = null;
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => syncLayout());
      resizeObserver.observe(trackEl);
    }
    inst.onSlideChange(idx => {
      var _a;
      setCurrentIndex(idx);
      (_a = local.onSlideChange) === null || _a === void 0 ? void 0 : _a.call(local, idx);
    });
    instance = inst;
    solidJs.onCleanup(() => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
      clearTimeout(timeoutId);
      window.removeEventListener('load', syncLayout);
      resizeObserver === null || resizeObserver === void 0 ? void 0 : resizeObserver.disconnect();
      if (instance && !instance.destroyed) {
        try {
          instance.destroy();
        } catch (/* ignore */_a) {/* ignore */}
      }
      delete trackEl.pagiflowInstance;
      instance = null;
    });
  });
  // Keep core options in sync when Solid props change.
  solidJs.createEffect(() => {
    if (!instance || instance.destroyed) return;
    const latestOptions = options;
    instance.setOptions(Object.assign({}, latestOptions), true);
  });
  // ─── Stable API ────────────────────────────────────────────────────────────
  const next = () => instance === null || instance === void 0 ? void 0 : instance.next();
  const prev = () => instance === null || instance === void 0 ? void 0 : instance.prev();
  const goTo = (index, opts) => instance === null || instance === void 0 ? void 0 : instance.goTo(index, opts);
  // Resolve children to count slides for renderPagination
  const resolvedChildren = solidJs.children(() => local.children);
  const slideCount = () => {
    const c = resolvedChildren();
    return Array.isArray(c) ? c.length : c ? 1 : 0;
  };
  return (() => {
    var _el$ = _tmpl$(),
      _el$2 = _el$.firstChild;
    var _ref$ = trackEl;
    typeof _ref$ === "function" ? web.use(_ref$, _el$2) : trackEl = _el$2;
    web.insert(_el$2, resolvedChildren);
    web.insert(_el$, (() => {
      var _c$ = web.memo(() => !!((_b = local.renderNav) === null || _b === void 0));
      return () => _c$() ? void 0 : _b.call(local, {
        next,
        prev,
        get currentIndex() {
          return currentIndex();
        },
        get instance() {
          return instance;
        }
      });
    })(), null);
    web.insert(_el$, (() => {
      var _c$2 = web.memo(() => !!((_c = local.renderPagination) === null || _c === void 0));
      return () => _c$2() ? void 0 : _c.call(local, {
        goTo,
        get currentIndex() {
          return currentIndex();
        },
        get total() {
          return slideCount();
        },
        get instance() {
          return instance;
        }
      });
    })(), null);
    web.effect(_p$ => {
      var _v$ = local.id,
        _v$2 = ['pagiflow', local.class].filter(Boolean).join(' '),
        _v$3 = local.style;
      _v$ !== _p$.e && web.setAttribute(_el$2, "id", _p$.e = _v$);
      _v$2 !== _p$.t && web.className(_el$2, _p$.t = _v$2);
      _p$.a = web.style(_el$2, _v$3, _p$.a);
      return _p$;
    }, {
      e: undefined,
      t: undefined,
      a: undefined
    });
    return _el$;
  })();
};

// ─── Loader ───────────────────────────────────────────────────────────────────
function getPagiflow() {
  var _a;
  if (typeof window !== 'undefined' && window.Pagiflow) {
    return window.Pagiflow;
  }
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const mod = require('pagiflow');
    return (_a = mod.default) !== null && _a !== void 0 ? _a : mod;
  } catch (_b) {
    return null;
  }
}
// ─── createPagiflow ───────────────────────────────────────────────────────────
/**
 * SolidJS primitive that initialises and controls a Pagiflow slider.
 * Attach `slider.ref` to any DOM element; all other API methods are stable
 * function references safe to pass as event handlers.
 *
 * @example
 * ```tsx
 * function MySlider() {
 *   const slider = createPagiflow({ loop: true, nav: true });
 *   return (
 *     <>
 *       <div ref={slider.ref}>
 *         <div>Slide 1</div>
 *         <div>Slide 2</div>
 *       </div>
 *       <button onClick={slider.prev}>‹</button>
 *       <span>{slider.currentIndex() + 1}</span>
 *       <button onClick={slider.next}>›</button>
 *     </>
 *   );
 * }
 * ```
 */
function createPagiflow(options = {}) {
  var _a;
  const [currentIndex, setCurrentIndex] = solidJs.createSignal((_a = options.startIndex) !== null && _a !== void 0 ? _a : 0);
  const [instance, setInstance] = solidJs.createSignal(null);
  // The ref callback — SolidJS calls this synchronously when the element mounts
  const ref = el => {
    solidJs.onMount(() => {
      const existing = el.pagiflowInstance;
      if (existing && !existing.destroyed) return;
      const Pagiflow = getPagiflow();
      if (!Pagiflow) {
        console.error('[createPagiflow] Pagiflow core not found. Install pagiflow or load it via CDN.');
        return;
      }
      const attrValue = `pf-${Math.random().toString(36).slice(2)}`;
      const selector = `[data-pagiflow-solid-id="${attrValue}"]`;
      el.setAttribute('data-pagiflow-solid-id', attrValue);
      const inst = Pagiflow(selector, options);
      if (!inst) {
        el.removeAttribute('data-pagiflow-solid-id');
        return;
      }
      const syncLayout = () => {
        var _a, _b;
        (_b = (_a = inst).update) === null || _b === void 0 ? void 0 : _b.call(_a);
      };
      const raf1 = requestAnimationFrame(() => syncLayout());
      const raf2 = requestAnimationFrame(() => syncLayout());
      const timeoutId = setTimeout(() => syncLayout(), 80);
      window.addEventListener('load', syncLayout, {
        once: true
      });
      let resizeObserver = null;
      if (typeof ResizeObserver !== 'undefined') {
        resizeObserver = new ResizeObserver(() => syncLayout());
        resizeObserver.observe(el);
      }
      inst.onSlideChange(idx => setCurrentIndex(idx));
      setInstance(inst);
      solidJs.onCleanup(() => {
        cancelAnimationFrame(raf1);
        cancelAnimationFrame(raf2);
        clearTimeout(timeoutId);
        window.removeEventListener('load', syncLayout);
        resizeObserver === null || resizeObserver === void 0 ? void 0 : resizeObserver.disconnect();
        const current = instance();
        if (current && !current.destroyed) {
          try {
            current.destroy();
          } catch (/* ignore */_a) {/* ignore */}
        }
        delete el.pagiflowInstance;
        setInstance(null);
      });
    });
  };
  // ─── Stable API ────────────────────────────────────────────────────────────
  return {
    ref,
    currentIndex,
    instance,
    next: () => {
      var _a;
      return (_a = instance()) === null || _a === void 0 ? void 0 : _a.next();
    },
    prev: () => {
      var _a;
      return (_a = instance()) === null || _a === void 0 ? void 0 : _a.prev();
    },
    goTo: (i, o) => {
      var _a;
      return (_a = instance()) === null || _a === void 0 ? void 0 : _a.goTo(i, o);
    },
    play: () => {
      var _a;
      return (_a = instance()) === null || _a === void 0 ? void 0 : _a.play();
    },
    pause: () => {
      var _a;
      return (_a = instance()) === null || _a === void 0 ? void 0 : _a.pause();
    },
    resume: () => {
      var _a;
      return (_a = instance()) === null || _a === void 0 ? void 0 : _a.resume();
    },
    togglePlayPause: () => {
      var _a;
      return (_a = instance()) === null || _a === void 0 ? void 0 : _a.togglePlayPause();
    },
    setOptions: (o, r) => {
      var _a;
      return (_a = instance()) === null || _a === void 0 ? void 0 : _a.setOptions(o, r);
    },
    reInit: o => {
      var _a;
      return (_a = instance()) === null || _a === void 0 ? void 0 : _a.reInit(o);
    }
  };
}

exports.Pagiflow = Pagiflow;
exports.createPagiflow = createPagiflow;
//# sourceMappingURL=index.cjs.js.map
