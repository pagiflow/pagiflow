import 'pagiflow';
export { default as Pagiflow } from './Pagiflow.svelte';
import { writable, get } from 'svelte/store';

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
    }
    catch (_b) {
        return null;
    }
}
// ─── createPagiflow ───────────────────────────────────────────────────────────
/**
 * Creates a reactive Pagiflow controller.
 *
 * @example
 * ```svelte
 * <script>
 *   import { createPagiflow } from 'pagiflow/svelte';
 *   const slider = createPagiflow({ loop: true, nav: true });
 *   $: currentIndex = $slider.currentIndex;
 * </script>
 *
 * <div use:slider.action>
 *   <div>Slide 1</div>
 *   <div>Slide 2</div>
 * </div>
 *
 * <button on:click={slider.prev}>‹</button>
 * <button on:click={slider.next}>›</button>
 * ```
 */
function createPagiflow(options = {}) {
    var _a;
    const store = writable({
        instance: null,
        currentIndex: (_a = options.startIndex) !== null && _a !== void 0 ? _a : 0,
    });
    // ─── Svelte action ─────────────────────────────────────────────────────────
    function action(node) {
        const existing = node.pagiflowInstance;
        if (existing && !existing.destroyed) {
            return { destroy() { } };
        }
        const Pagiflow = getPagiflow();
        if (!Pagiflow) {
            console.error('[createPagiflow] Pagiflow core not found. Install pagiflow or load it via CDN.');
            return { destroy() { } };
        }
        // Use a unique data attribute so the selector is always scoped
        const attrValue = `pf-${Math.random().toString(36).slice(2)}`;
        const selector = `[data-pagiflow-svelte-id="${attrValue}"]`;
        node.setAttribute('data-pagiflow-svelte-id', attrValue);
        const inst = Pagiflow(selector, options);
        if (!inst) {
            node.removeAttribute('data-pagiflow-svelte-id');
            return { destroy() { } };
        }
        const syncLayout = () => { var _a, _b; (_b = (_a = inst).update) === null || _b === void 0 ? void 0 : _b.call(_a); };
        const raf1 = requestAnimationFrame(() => syncLayout());
        const raf2 = requestAnimationFrame(() => syncLayout());
        const timeoutId = setTimeout(() => syncLayout(), 80);
        window.addEventListener('load', syncLayout, { once: true });
        let resizeObserver = null;
        if (typeof ResizeObserver !== 'undefined') {
            resizeObserver = new ResizeObserver(() => syncLayout());
            resizeObserver.observe(node);
        }
        inst.onSlideChange((idx) => {
            store.update((s) => (Object.assign(Object.assign({}, s), { currentIndex: idx })));
        });
        store.update((s) => (Object.assign(Object.assign({}, s), { instance: inst })));
        return {
            destroy() {
                cancelAnimationFrame(raf1);
                cancelAnimationFrame(raf2);
                clearTimeout(timeoutId);
                window.removeEventListener('load', syncLayout);
                resizeObserver === null || resizeObserver === void 0 ? void 0 : resizeObserver.disconnect();
                const current = get(store).instance;
                if (current && !current.destroyed) {
                    try {
                        current.destroy();
                    }
                    catch ( /* ignore */_a) { /* ignore */ }
                }
                delete node.pagiflowInstance;
                store.update((s) => (Object.assign(Object.assign({}, s), { instance: null })));
            },
        };
    }
    // ─── Stable API ────────────────────────────────────────────────────────────
    function getInstance() {
        return get(store).instance;
    }
    return {
        subscribe: store.subscribe,
        action,
        next: () => { var _a; return (_a = getInstance()) === null || _a === void 0 ? void 0 : _a.next(); },
        prev: () => { var _a; return (_a = getInstance()) === null || _a === void 0 ? void 0 : _a.prev(); },
        goTo: (i, o) => { var _a; return (_a = getInstance()) === null || _a === void 0 ? void 0 : _a.goTo(i, o); },
        play: () => { var _a; return (_a = getInstance()) === null || _a === void 0 ? void 0 : _a.play(); },
        pause: () => { var _a; return (_a = getInstance()) === null || _a === void 0 ? void 0 : _a.pause(); },
        togglePlayPause: () => { var _a; return (_a = getInstance()) === null || _a === void 0 ? void 0 : _a.togglePlayPause(); },
        setOptions: (o, r) => { var _a; return (_a = getInstance()) === null || _a === void 0 ? void 0 : _a.setOptions(o, r); },
        reInit: (o) => { var _a; return (_a = getInstance()) === null || _a === void 0 ? void 0 : _a.reInit(o); },
    };
}

export { createPagiflow };
//# sourceMappingURL=index.esm.js.map
