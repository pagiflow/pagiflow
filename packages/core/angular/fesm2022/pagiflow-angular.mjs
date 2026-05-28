import PagiflowCore from 'pagiflow';
import * as i0 from '@angular/core';
import { EventEmitter, PLATFORM_ID, ElementRef, Output, Input, ViewChild, Inject, ViewEncapsulation, Component, inject, Injector, signal, effect, untracked, NgModule } from '@angular/core';
import * as i1 from '@angular/common';
import { isPlatformBrowser, CommonModule } from '@angular/common';

function getPagiflow$1() {
    if (typeof window !== 'undefined' && window.Pagiflow) {
        return window.Pagiflow;
    }
    return PagiflowCore.default ?? PagiflowCore;
}
function initPagiflowFromElement$1(ctor, el, opts, renderer) {
    const attrValue = `pf-${Math.random().toString(36).slice(2)}`;
    const selector = `[data-pagiflow-angular-id="${attrValue}"]`;
    renderer.setAttribute(el, 'data-pagiflow-angular-id', attrValue);
    const bySelector = ctor(selector, opts);
    if (!bySelector) {
        renderer.removeAttribute(el, 'data-pagiflow-angular-id');
        return null;
    }
    return bySelector;
}
// ─── Pagiflow Component ───────────────────────────────────────────────────────
class PagiflowComponent {
    platformId;
    ngZone;
    renderer;
    hostRef;
    trackRef;
    // Input options
    options = {};
    className;
    style;
    // Output events
    slideChange = new EventEmitter();
    ready = new EventEmitter();
    instance = null;
    resizeObserver = null;
    raf1 = 0;
    raf2 = 0;
    timeoutId = 0;
    destroyed = false;
    constructor(platformId, ngZone, renderer, hostRef) {
        this.platformId = platformId;
        this.ngZone = ngZone;
        this.renderer = renderer;
        this.hostRef = hostRef;
    }
    ngAfterViewInit() {
        this.destroyed = false;
        if (!isPlatformBrowser(this.platformId))
            return;
        // Wait one frame so projected slide content is fully rendered before core snapshots children.
        this.ngZone.runOutsideAngular(() => {
            requestAnimationFrame(() => {
                if (!this.destroyed)
                    this.initPagiflow();
            });
        });
    }
    ngOnChanges(changes) {
        if (!changes['options'] || !this.instance || changes['options'].firstChange)
            return;
        // Reconfigure existing instance when Angular input object changes.
        this.scheduleReinit();
    }
    ngOnDestroy() {
        this.destroyed = true;
        this.destroy();
    }
    initPagiflow() {
        if (!isPlatformBrowser(this.platformId))
            return;
        const el = this.trackRef.nativeElement;
        const existing = el.pagiflowInstance;
        let inst = null;
        if (existing && !existing.destroyed) {
            inst = existing;
        }
        else {
            const ctor = getPagiflow$1();
            if (!ctor) {
                console.error('[PagiflowComponent] Pagiflow core not found. Install pagiflow or load it via CDN.');
                return;
            }
            inst = initPagiflowFromElement$1(ctor, el, this.options, this.renderer);
        }
        if (!inst)
            return;
        this.instance = inst;
        el.pagiflowInstance = inst;
        this.hostRef.nativeElement.pagiflowInstance = inst;
        this.ready.emit(inst);
        // Listen to slide changes via the instance API
        inst.onSlideChange((idx) => {
            this.ngZone.run(() => {
                this.slideChange.emit(idx);
            });
        });
        const syncLayout = () => {
            const api = this.instance;
            api?.update?.();
        };
        // Setup resize observer for responsive behavior
        this.ngZone.runOutsideAngular(() => {
            this.resizeObserver = new ResizeObserver(() => {
                syncLayout();
            });
            this.resizeObserver.observe(el);
        });
        // Keep behavior aligned with other wrappers so sync/thumbnails settle after mount.
        this.raf1 = requestAnimationFrame(() => syncLayout());
        this.raf2 = requestAnimationFrame(() => syncLayout());
        this.timeoutId = window.setTimeout(() => syncLayout(), 80);
        window.addEventListener('load', syncLayout, { once: true });
        // Keep a final layout sync after mount without resetting slide index.
        this.raf1 = requestAnimationFrame(() => syncLayout());
    }
    scheduleReinit() {
        if (!isPlatformBrowser(this.platformId))
            return;
        cancelAnimationFrame(this.raf1);
        this.raf1 = requestAnimationFrame(() => {
            cancelAnimationFrame(this.raf2);
            this.raf2 = requestAnimationFrame(() => {
                const host = this.trackRef?.nativeElement;
                if (this.destroyed || !this.instance || !host || !host.isConnected)
                    return;
                try {
                    this.instance.reInit(this.options);
                }
                catch {
                    // Ignore transient rebuild errors during rapid teardown/remount.
                }
            });
        });
    }
    destroy() {
        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
            this.resizeObserver = null;
        }
        if (isPlatformBrowser(this.platformId)) {
            cancelAnimationFrame(this.raf1);
            cancelAnimationFrame(this.raf2);
            clearTimeout(this.timeoutId);
        }
        if (this.instance && !this.instance.destroyed) {
            this.instance.destroy();
        }
        delete this.hostRef.nativeElement.pagiflowInstance;
        this.instance = null;
    }
    // Public API methods
    /**
     * Get the underlying Pagiflow instance.
     */
    getInstance() {
        return this.instance;
    }
    /**
     * Navigate to the next slide.
     */
    next() {
        this.instance?.next();
    }
    /**
     * Navigate to the previous slide.
     */
    prev() {
        this.instance?.prev();
    }
    /**
     * Go to a specific slide index.
     */
    goTo(index, opts) {
        this.instance?.goTo(index, opts);
    }
    /**
     * Start autoScroll.
     */
    play() {
        this.instance?.play();
    }
    /**
     * Pause autoScroll.
     */
    pause() {
        this.instance?.pause();
    }
    /**
     * Resume autoScroll after pause.
     */
    resume() {
        this.instance?.resume();
    }
    /**
     * Toggle autoScroll play/pause state.
     */
    togglePlayPause() {
        this.instance?.togglePlayPause();
    }
    /**
     * Update options and optionally rebuild.
     */
    setOptions(opts, rebuild) {
        this.instance?.setOptions(opts, rebuild);
    }
    /**
     * Reinitialize with new or updated options.
     */
    reInit(opts) {
        this.instance?.reInit(opts);
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.14", ngImport: i0, type: PagiflowComponent, deps: [{ token: PLATFORM_ID }, { token: i0.NgZone }, { token: i0.Renderer2 }, { token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "18.2.14", type: PagiflowComponent, isStandalone: true, selector: "pf-pagiflow", inputs: { options: "options", className: "className", style: "style" }, outputs: { slideChange: "slideChange", ready: "ready" }, viewQueries: [{ propertyName: "trackRef", first: true, predicate: ["track"], descendants: true, read: ElementRef }], usesOnChanges: true, ngImport: i0, template: `
    <div
      #track
      [ngClass]="['pagiflow', className || '']"
      [style]="style"
    >
      <ng-content></ng-content>
    </div>
  `, isInline: true, dependencies: [{ kind: "ngmodule", type: CommonModule }, { kind: "directive", type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }], encapsulation: i0.ViewEncapsulation.None });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.14", ngImport: i0, type: PagiflowComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'pf-pagiflow',
                    standalone: true,
                    imports: [CommonModule],
                    template: `
    <div
      #track
      [ngClass]="['pagiflow', className || '']"
      [style]="style"
    >
      <ng-content></ng-content>
    </div>
  `,
                    encapsulation: ViewEncapsulation.None,
                }]
        }], ctorParameters: () => [{ type: Object, decorators: [{
                    type: Inject,
                    args: [PLATFORM_ID]
                }] }, { type: i0.NgZone }, { type: i0.Renderer2 }, { type: i0.ElementRef }], propDecorators: { trackRef: [{
                type: ViewChild,
                args: ['track', { read: ElementRef }]
            }], options: [{
                type: Input
            }], className: [{
                type: Input
            }], style: [{
                type: Input
            }], slideChange: [{
                type: Output
            }], ready: [{
                type: Output
            }] } });
// ─── Pagiflow Slide Component ─────────────────────────────────────────────────
/**
 * Component or directive to wrap individual slides.
 * Use \`<pf-slide>\` to create a wrapper element, or use \`[pf-slide]\` as an attribute
 * on your own element to avoid an extra DOM wrapper.
 */
class PagiflowSlideComponent {
    className;
    style;
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.14", ngImport: i0, type: PagiflowSlideComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "18.2.14", type: PagiflowSlideComponent, isStandalone: true, selector: "pf-slide, [pf-slide]", inputs: { className: "className", style: "style" }, host: { properties: { "class": "className ? 'pf-slide ' + className : 'pf-slide'", "style": "style" } }, ngImport: i0, template: `<ng-content></ng-content>`, isInline: true, encapsulation: i0.ViewEncapsulation.None });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.14", ngImport: i0, type: PagiflowSlideComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'pf-slide, [pf-slide]',
                    standalone: true,
                    template: `<ng-content></ng-content>`,
                    host: {
                        '[class]': "className ? 'pf-slide ' + className : 'pf-slide'",
                        '[style]': 'style'
                    },
                    encapsulation: ViewEncapsulation.None,
                }]
        }], propDecorators: { className: [{
                type: Input
            }], style: [{
                type: Input
            }] } });

function getPagiflow() {
    if (typeof window !== 'undefined' && window.Pagiflow) {
        return window.Pagiflow;
    }
    return PagiflowCore.default ?? PagiflowCore;
}
function initPagiflowFromElement(ctor, el, opts) {
    const attrValue = `pf-${Math.random().toString(36).slice(2)}`;
    const selector = `[data-pagiflow-angular-id="${attrValue}"]`;
    el.setAttribute('data-pagiflow-angular-id', attrValue);
    const bySelector = ctor(selector, opts);
    if (!bySelector) {
        el.removeAttribute('data-pagiflow-angular-id');
        return null;
    }
    return bySelector;
}
/**
 * Angular composable (using signals) for Pagiflow slider integration.
 * Usage:
 *   export class SliderComponent {
 *     pagi = usePagiflow({ direction: 'horizontal' });
 *
 *     onMount() {
 *       this.pagi.sliderRef.set(this.elementRef.nativeElement);
 *     }
 *   }
 */
function usePagiflow(options = {}) {
    const injector = inject(Injector);
    const sliderRef = signal(null);
    const instance = signal(null);
    const currentIndex = signal(options.startIndex ?? 0);
    let resizeObserver = null;
    let raf1 = 0;
    let raf2 = 0;
    let timeoutId = 0;
    // Setup effect to initialize Pagiflow when sliderRef changes
    effect(() => {
        if (typeof window === 'undefined')
            return;
        const el = sliderRef();
        if (!el)
            return;
        const existing = el.pagiflowInstance;
        if (existing && !existing.destroyed) {
            instance.set(existing);
            return;
        }
        const ctor = getPagiflow();
        if (!ctor) {
            console.error('[usePagiflow] Pagiflow core not found. Install pagiflow or load it via CDN.');
            return;
        }
        const inst = initPagiflowFromElement(ctor, el, options);
        if (!inst)
            return;
        instance.set(inst);
        el.pagiflowInstance = inst;
        const syncLayout = () => {
            const api = inst;
            api.update?.();
        };
        // Setup resize observer
        if (typeof ResizeObserver !== 'undefined') {
            resizeObserver = new ResizeObserver(() => {
                syncLayout();
                if (typeof cancelAnimationFrame !== 'undefined') {
                    cancelAnimationFrame(raf1);
                    raf1 = requestAnimationFrame(() => {
                        cancelAnimationFrame(raf2);
                        raf2 = requestAnimationFrame(() => {
                            inst.reInit();
                        });
                    });
                }
            });
            resizeObserver.observe(el);
        }
        if (typeof requestAnimationFrame !== 'undefined') {
            raf1 = requestAnimationFrame(() => syncLayout());
            raf2 = requestAnimationFrame(() => syncLayout());
        }
        if (typeof window !== 'undefined') {
            timeoutId = window.setTimeout(() => syncLayout(), 80);
            window.addEventListener('load', syncLayout, { once: true });
        }
        // Listen to slide changes via instance API
        inst.onSlideChange((idx) => {
            currentIndex.set(idx);
        });
        return () => {
            cleanup();
            if (inst && !inst.destroyed)
                inst.destroy();
            instance.set(null);
        };
    }, { allowSignalWrites: true });
    const cleanup = () => {
        if (resizeObserver) {
            resizeObserver.disconnect();
            resizeObserver = null;
        }
        if (typeof cancelAnimationFrame !== 'undefined') {
            cancelAnimationFrame(raf1);
            cancelAnimationFrame(raf2);
        }
        if (typeof window !== 'undefined') {
            clearTimeout(timeoutId);
        }
    };
    const goTo = (index, opts) => {
        const inst = untracked(() => instance());
        inst?.goTo(index, opts);
    };
    const next = () => {
        const inst = untracked(() => instance());
        inst?.next();
    };
    const prev = () => {
        const inst = untracked(() => instance());
        inst?.prev();
    };
    const play = () => {
        const inst = untracked(() => instance());
        inst?.play();
    };
    const pause = () => {
        const inst = untracked(() => instance());
        inst?.pause();
    };
    const togglePlayPause = () => {
        const inst = untracked(() => instance());
        inst?.togglePlayPause();
    };
    const setOptions = (opts, rebuild) => {
        const inst = untracked(() => instance());
        inst?.setOptions(opts, rebuild);
    };
    const reInit = (opts) => {
        const inst = untracked(() => instance());
        inst?.reInit(opts);
    };
    return {
        sliderRef,
        instance,
        currentIndex,
        goTo,
        next,
        prev,
        play,
        pause,
        togglePlayPause,
        setOptions,
        reInit,
    };
}

class PagiflowModule {
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.14", ngImport: i0, type: PagiflowModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
    static ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "18.2.14", ngImport: i0, type: PagiflowModule, imports: [PagiflowComponent, PagiflowSlideComponent], exports: [PagiflowComponent, PagiflowSlideComponent] });
    static ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "18.2.14", ngImport: i0, type: PagiflowModule, imports: [PagiflowComponent] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.14", ngImport: i0, type: PagiflowModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [PagiflowComponent, PagiflowSlideComponent],
                    exports: [PagiflowComponent, PagiflowSlideComponent],
                }]
        }] });

/**
 * Generated bundle index. Do not edit.
 */

export { PagiflowComponent, PagiflowModule, PagiflowSlideComponent, usePagiflow };
//# sourceMappingURL=pagiflow-angular.mjs.map
