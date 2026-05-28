import { createSignal, onMount, onCleanup } from 'solid-js';
// ─── Loader ───────────────────────────────────────────────────────────────────
function getPagiflow() {
    if (typeof window !== 'undefined' && window.Pagiflow) {
        return window.Pagiflow;
    }
    try {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const mod = require('pagiflow');
        return mod.default ?? mod;
    }
    catch {
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
export function createPagiflow(options = {}) {
    const [currentIndex, setCurrentIndex] = createSignal(options.startIndex ?? 0);
    const [instance, setInstance] = createSignal(null);
    // The ref callback — SolidJS calls this synchronously when the element mounts
    const ref = (el) => {
        onMount(() => {
            const existing = el.pagiflowInstance;
            if (existing && !existing.destroyed)
                return;
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
            const syncLayout = () => { inst.update?.(); };
            const raf1 = requestAnimationFrame(() => syncLayout());
            const raf2 = requestAnimationFrame(() => syncLayout());
            const timeoutId = setTimeout(() => syncLayout(), 80);
            window.addEventListener('load', syncLayout, { once: true });
            let resizeObserver = null;
            if (typeof ResizeObserver !== 'undefined') {
                resizeObserver = new ResizeObserver(() => syncLayout());
                resizeObserver.observe(el);
            }
            inst.onSlideChange((idx) => setCurrentIndex(idx));
            setInstance(inst);
            onCleanup(() => {
                cancelAnimationFrame(raf1);
                cancelAnimationFrame(raf2);
                clearTimeout(timeoutId);
                window.removeEventListener('load', syncLayout);
                resizeObserver?.disconnect();
                const current = instance();
                if (current && !current.destroyed) {
                    try {
                        current.destroy();
                    }
                    catch { /* ignore */ }
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
        next: () => instance()?.next(),
        prev: () => instance()?.prev(),
        goTo: (i, o) => instance()?.goTo(i, o),
        play: () => instance()?.play(),
        pause: () => instance()?.pause(),
        resume: () => instance()?.resume(),
        togglePlayPause: () => instance()?.togglePlayPause(),
        setOptions: (o, r) => instance()?.setOptions(o, r),
        reInit: (o) => instance()?.reInit(o),
    };
}
