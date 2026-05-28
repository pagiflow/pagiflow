import { createSignal, onMount, onCleanup, splitProps, children, createEffect, } from 'solid-js';
function getPagiflow() {
    if (typeof window !== 'undefined' && window.Pagiflow) {
        return window.Pagiflow;
    }
    try {
        const mod = require('pagiflow');
        return mod.default ?? mod;
    }
    catch {
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
export const Pagiflow = (props) => {
    // Split component-specific props away from PagiflowOptions
    const [local, options] = splitProps(props, [
        'children',
        'class',
        'style',
        'id',
        'onSlideChange',
        'renderNav',
        'renderPagination',
    ]);
    let trackEl;
    let instance = null;
    const [currentIndex, setCurrentIndex] = createSignal(options.startIndex ?? 0);
    // ─── Init ──────────────────────────────────────────────────────────────────
    onMount(() => {
        const existing = trackEl.pagiflowInstance;
        if (existing && !existing.destroyed)
            return;
        const PagiflowCtor = getPagiflow();
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
        const syncLayout = () => { inst.update?.(); };
        const raf1 = requestAnimationFrame(() => syncLayout());
        const raf2 = requestAnimationFrame(() => syncLayout());
        const timeoutId = setTimeout(() => syncLayout(), 80);
        window.addEventListener('load', syncLayout, { once: true });
        let resizeObserver = null;
        if (typeof ResizeObserver !== 'undefined') {
            resizeObserver = new ResizeObserver(() => syncLayout());
            resizeObserver.observe(trackEl);
        }
        inst.onSlideChange((idx) => {
            setCurrentIndex(idx);
            local.onSlideChange?.(idx);
        });
        instance = inst;
        onCleanup(() => {
            cancelAnimationFrame(raf1);
            cancelAnimationFrame(raf2);
            clearTimeout(timeoutId);
            window.removeEventListener('load', syncLayout);
            resizeObserver?.disconnect();
            if (instance && !instance.destroyed) {
                try {
                    instance.destroy();
                }
                catch { /* ignore */ }
            }
            delete trackEl.pagiflowInstance;
            instance = null;
        });
    });
    // Keep core options in sync when Solid props change.
    createEffect(() => {
        if (!instance || instance.destroyed)
            return;
        const latestOptions = options;
        instance.setOptions({ ...latestOptions }, true);
    });
    // ─── Stable API ────────────────────────────────────────────────────────────
    const next = () => instance?.next();
    const prev = () => instance?.prev();
    const goTo = (index, opts) => instance?.goTo(index, opts);
    // Resolve children to count slides for renderPagination
    const resolvedChildren = children(() => local.children);
    const slideCount = () => {
        const c = resolvedChildren();
        return Array.isArray(c) ? c.length : c ? 1 : 0;
    };
    return (<div class="pagiflow-solid-wrapper" style={{ display: 'contents' }}>
      <div ref={trackEl} id={local.id} class={['pagiflow', local.class].filter(Boolean).join(' ')} style={local.style}>
        {resolvedChildren()}
      </div>

      {local.renderNav?.({
            next,
            prev,
            get currentIndex() { return currentIndex(); },
            get instance() { return instance; },
        })}

      {local.renderPagination?.({
            goTo,
            get currentIndex() { return currentIndex(); },
            get total() { return slideCount(); },
            get instance() { return instance; },
        })}
    </div>);
};
