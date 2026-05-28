'use strict';

require('pagiflow');
var core = require('@angular/core');
var common = require('@angular/common');

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


function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

function __param(paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
}

function __metadata(metadataKey, metadataValue) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

// Pagiflow.ts
function getPagiflow$1() {
    var _a;
    if (typeof window !== 'undefined' && window.Pagiflow) {
        return window.Pagiflow;
    }
    try {
        const mod = require('pagiflow');
        return ((_a = mod.default) !== null && _a !== void 0 ? _a : mod);
    }
    catch (_b) {
        return null;
    }
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
exports.PagiflowComponent = class PagiflowComponent {
    constructor(platformId, ngZone, renderer) {
        this.platformId = platformId;
        this.ngZone = ngZone;
        this.renderer = renderer;
        // Input options
        this.options = {};
        // Output events
        this.slideChange = new core.EventEmitter();
        this.ready = new core.EventEmitter();
        this.instance = null;
        this.resizeObserver = null;
        this.raf1 = 0;
        this.raf2 = 0;
    }
    ngAfterViewInit() {
        this.initPagiflow();
    }
    ngOnDestroy() {
        this.destroy();
    }
    initPagiflow() {
        if (!common.isPlatformBrowser(this.platformId))
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
        this.ready.emit(inst);
        // Listen to slide changes via the instance API
        inst.onSlideChange((idx) => {
            this.ngZone.run(() => {
                this.slideChange.emit(idx);
            });
        });
        // Setup resize observer for responsive behavior
        this.ngZone.runOutsideAngular(() => {
            this.resizeObserver = new ResizeObserver(() => {
                cancelAnimationFrame(this.raf1);
                this.raf1 = requestAnimationFrame(() => {
                    cancelAnimationFrame(this.raf2);
                    this.raf2 = requestAnimationFrame(() => {
                        if (this.instance)
                            this.instance.reInit();
                    });
                });
            });
            this.resizeObserver.observe(el);
        });
    }
    destroy() {
        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
            this.resizeObserver = null;
        }
        cancelAnimationFrame(this.raf1);
        cancelAnimationFrame(this.raf2);
        if (this.instance && !this.instance.destroyed) {
            this.instance.destroy();
        }
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
        var _a;
        (_a = this.instance) === null || _a === void 0 ? void 0 : _a.next();
    }
    /**
     * Navigate to the previous slide.
     */
    prev() {
        var _a;
        (_a = this.instance) === null || _a === void 0 ? void 0 : _a.prev();
    }
    /**
     * Go to a specific slide index.
     */
    goTo(index, opts) {
        var _a;
        (_a = this.instance) === null || _a === void 0 ? void 0 : _a.goTo(index, opts);
    }
    /**
     * Start autoScroll.
     */
    play() {
        var _a;
        (_a = this.instance) === null || _a === void 0 ? void 0 : _a.play();
    }
    /**
     * Pause autoScroll.
     */
    pause() {
        var _a;
        (_a = this.instance) === null || _a === void 0 ? void 0 : _a.pause();
    }
    /**
     * Resume autoScroll after pause.
     */
    resume() {
        var _a;
        (_a = this.instance) === null || _a === void 0 ? void 0 : _a.resume();
    }
    /**
     * Toggle autoScroll play/pause state.
     */
    togglePlayPause() {
        var _a;
        (_a = this.instance) === null || _a === void 0 ? void 0 : _a.togglePlayPause();
    }
    /**
     * Update options and optionally rebuild.
     */
    setOptions(opts, rebuild) {
        var _a;
        (_a = this.instance) === null || _a === void 0 ? void 0 : _a.setOptions(opts, rebuild);
    }
    /**
     * Reinitialize with new or updated options.
     */
    reInit(opts) {
        var _a;
        (_a = this.instance) === null || _a === void 0 ? void 0 : _a.reInit(opts);
    }
};
__decorate([
    core.ViewChild('track', { read: core.ElementRef }),
    __metadata("design:type", core.ElementRef)
], exports.PagiflowComponent.prototype, "trackRef", void 0);
__decorate([
    core.Input(),
    __metadata("design:type", Object)
], exports.PagiflowComponent.prototype, "options", void 0);
__decorate([
    core.Input(),
    __metadata("design:type", String)
], exports.PagiflowComponent.prototype, "className", void 0);
__decorate([
    core.Input(),
    __metadata("design:type", Object)
], exports.PagiflowComponent.prototype, "style", void 0);
__decorate([
    core.Output(),
    __metadata("design:type", Object)
], exports.PagiflowComponent.prototype, "slideChange", void 0);
__decorate([
    core.Output(),
    __metadata("design:type", Object)
], exports.PagiflowComponent.prototype, "ready", void 0);
exports.PagiflowComponent = __decorate([
    core.Component({
        selector: 'pf-pagiflow',
        standalone: true,
        imports: [common.CommonModule],
        template: `
    <div
      #track
      [ngClass]="['pf-track', className || '']"
      [style]="style"
    >
      <ng-content></ng-content>
    </div>
  `,
        encapsulation: core.ViewEncapsulation.None,
    }),
    __param(0, core.Inject(core.PLATFORM_ID)),
    __metadata("design:paramtypes", [Object,
        core.NgZone,
        core.Renderer2])
], exports.PagiflowComponent);
// ─── Pagiflow Slide Component ─────────────────────────────────────────────────
exports.PagiflowSlideComponent = class PagiflowSlideComponent {
};
__decorate([
    core.Input(),
    __metadata("design:type", String)
], exports.PagiflowSlideComponent.prototype, "className", void 0);
__decorate([
    core.Input(),
    __metadata("design:type", Object)
], exports.PagiflowSlideComponent.prototype, "style", void 0);
exports.PagiflowSlideComponent = __decorate([
    core.Component({
        selector: 'pf-slide',
        standalone: true,
        template: `<ng-content></ng-content>`,
        host: {
            'class': 'pf-slide',
            '[class]': 'className',
            '[style]': 'style'
        },
        encapsulation: core.ViewEncapsulation.None,
    })
], exports.PagiflowSlideComponent);

// usePagiflow.ts
function getPagiflow() {
    var _a;
    if (typeof window !== 'undefined' && window.Pagiflow) {
        return window.Pagiflow;
    }
    try {
        const mod = require('pagiflow');
        return ((_a = mod.default) !== null && _a !== void 0 ? _a : mod);
    }
    catch (_b) {
        return null;
    }
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
    var _a;
    core.inject(core.Injector);
    const sliderRef = core.signal(null);
    const instance = core.signal(null);
    const currentIndex = core.signal((_a = options.startIndex) !== null && _a !== void 0 ? _a : 0);
    let resizeObserver = null;
    let raf1 = 0;
    let raf2 = 0;
    let timeoutId = 0;
    // Setup effect to initialize Pagiflow when sliderRef changes
    core.effect(() => {
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
        // Setup resize observer
        resizeObserver = new ResizeObserver(() => {
            cancelAnimationFrame(raf1);
            raf1 = requestAnimationFrame(() => {
                cancelAnimationFrame(raf2);
                raf2 = requestAnimationFrame(() => {
                    inst.reInit();
                });
            });
        });
        resizeObserver.observe(el);
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
    });
    const cleanup = () => {
        if (resizeObserver) {
            resizeObserver.disconnect();
            resizeObserver = null;
        }
        cancelAnimationFrame(raf1);
        cancelAnimationFrame(raf2);
        clearTimeout(timeoutId);
    };
    const goTo = (index, opts) => {
        const inst = core.untracked(() => instance());
        inst === null || inst === void 0 ? void 0 : inst.goTo(index, opts);
    };
    const next = () => {
        const inst = core.untracked(() => instance());
        inst === null || inst === void 0 ? void 0 : inst.next();
    };
    const prev = () => {
        const inst = core.untracked(() => instance());
        inst === null || inst === void 0 ? void 0 : inst.prev();
    };
    const play = () => {
        const inst = core.untracked(() => instance());
        inst === null || inst === void 0 ? void 0 : inst.play();
    };
    const pause = () => {
        const inst = core.untracked(() => instance());
        inst === null || inst === void 0 ? void 0 : inst.pause();
    };
    const togglePlayPause = () => {
        const inst = core.untracked(() => instance());
        inst === null || inst === void 0 ? void 0 : inst.togglePlayPause();
    };
    const setOptions = (opts, rebuild) => {
        const inst = core.untracked(() => instance());
        inst === null || inst === void 0 ? void 0 : inst.setOptions(opts, rebuild);
    };
    const reInit = (opts) => {
        const inst = core.untracked(() => instance());
        inst === null || inst === void 0 ? void 0 : inst.reInit(opts);
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

exports.PagiflowModule = class PagiflowModule {
};
exports.PagiflowModule = __decorate([
    core.NgModule({
        imports: [exports.PagiflowComponent, exports.PagiflowSlideComponent],
        exports: [exports.PagiflowComponent, exports.PagiflowSlideComponent],
    })
], exports.PagiflowModule);

exports.usePagiflow = usePagiflow;
//# sourceMappingURL=index.cjs.js.map
