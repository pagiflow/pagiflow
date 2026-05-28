import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, ViewEncapsulation, Inject, PLATFORM_ID, } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
// @ts-ignore
import PagiflowCore from 'pagiflow';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
function getPagiflow() {
    if (typeof window !== 'undefined' && window.Pagiflow) {
        return window.Pagiflow;
    }
    return PagiflowCore.default ?? PagiflowCore;
}
function initPagiflowFromElement(ctor, el, opts, renderer) {
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
export class PagiflowComponent {
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
            const ctor = getPagiflow();
            if (!ctor) {
                console.error('[PagiflowComponent] Pagiflow core not found. Install pagiflow or load it via CDN.');
                return;
            }
            inst = initPagiflowFromElement(ctor, el, this.options, this.renderer);
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
export class PagiflowSlideComponent {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGFnaWZsb3cuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvUGFnaWZsb3cudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUNMLFNBQVMsRUFDVCxLQUFLLEVBQ0wsTUFBTSxFQUNOLFlBQVksRUFDWixTQUFTLEVBQ1QsVUFBVSxFQUdWLGlCQUFpQixFQUNqQixNQUFNLEVBQ04sV0FBVyxHQUtaLE1BQU0sZUFBZSxDQUFDO0FBRXZCLE9BQU8sRUFBRSxZQUFZLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUdsRSxhQUFhO0FBQ2IsT0FBTyxZQUFZLE1BQU0sVUFBVSxDQUFDOzs7QUFPcEMsU0FBUyxXQUFXO0lBQ2xCLElBQUksT0FBTyxNQUFNLEtBQUssV0FBVyxJQUFLLE1BQWMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUM5RCxPQUFRLE1BQWMsQ0FBQyxRQUF3QixDQUFDO0lBQ2xELENBQUM7SUFDRCxPQUFRLFlBQW9CLENBQUMsT0FBTyxJQUFJLFlBQVksQ0FBQztBQUN2RCxDQUFDO0FBRUQsU0FBUyx1QkFBdUIsQ0FDOUIsSUFBa0IsRUFDbEIsRUFBZSxFQUNmLElBQXFCLEVBQ3JCLFFBQW1CO0lBRW5CLE1BQU0sU0FBUyxHQUFHLE1BQU0sSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztJQUM5RCxNQUFNLFFBQVEsR0FBRyw4QkFBOEIsU0FBUyxJQUFJLENBQUM7SUFDN0QsUUFBUSxDQUFDLFlBQVksQ0FBQyxFQUFFLEVBQUUsMEJBQTBCLEVBQUUsU0FBUyxDQUFDLENBQUM7SUFFakUsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQTRCLENBQUM7SUFDbkUsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO1FBQ2hCLFFBQVEsQ0FBQyxlQUFlLENBQUMsRUFBRSxFQUFFLDBCQUEwQixDQUFDLENBQUM7UUFDekQsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBQ0QsT0FBTyxVQUFVLENBQUM7QUFDcEIsQ0FBQztBQUVELGlGQUFpRjtBQWdCakYsTUFBTSxPQUFPLGlCQUFpQjtJQW9CRztJQUNyQjtJQUNBO0lBQ0E7SUF0QmdDLFFBQVEsQ0FBOEI7SUFFaEYsZ0JBQWdCO0lBQ1AsT0FBTyxHQUFvQixFQUFFLENBQUM7SUFDOUIsU0FBUyxDQUFVO0lBQ25CLEtBQUssQ0FBbUM7SUFFakQsZ0JBQWdCO0lBQ04sV0FBVyxHQUFHLElBQUksWUFBWSxFQUFVLENBQUM7SUFDekMsS0FBSyxHQUFHLElBQUksWUFBWSxFQUFvQixDQUFDO0lBRS9DLFFBQVEsR0FBNEIsSUFBSSxDQUFDO0lBQ3pDLGNBQWMsR0FBMEIsSUFBSSxDQUFDO0lBQzdDLElBQUksR0FBRyxDQUFDLENBQUM7SUFDVCxJQUFJLEdBQUcsQ0FBQyxDQUFDO0lBQ1QsU0FBUyxHQUFHLENBQUMsQ0FBQztJQUNkLFNBQVMsR0FBRyxLQUFLLENBQUM7SUFFMUIsWUFDK0IsVUFBa0IsRUFDdkMsTUFBYyxFQUNkLFFBQW1CLEVBQ25CLE9BQWdDO1FBSFgsZUFBVSxHQUFWLFVBQVUsQ0FBUTtRQUN2QyxXQUFNLEdBQU4sTUFBTSxDQUFRO1FBQ2QsYUFBUSxHQUFSLFFBQVEsQ0FBVztRQUNuQixZQUFPLEdBQVAsT0FBTyxDQUF5QjtJQUN2QyxDQUFDO0lBRUosZUFBZTtRQUNiLElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDO1lBQUUsT0FBTztRQUNoRCw4RkFBOEY7UUFDOUYsSUFBSSxDQUFDLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLEVBQUU7WUFDakMscUJBQXFCLENBQUMsR0FBRyxFQUFFO2dCQUN6QixJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVM7b0JBQUUsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO1lBQzNDLENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQsV0FBVyxDQUFDLE9BQXNCO1FBQ2hDLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxJQUFJLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQyxXQUFXO1lBQUUsT0FBTztRQUVwRixtRUFBbUU7UUFDbkUsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO0lBQ3hCLENBQUM7SUFFRCxXQUFXO1FBQ1QsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7UUFDdEIsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBQ2pCLENBQUM7SUFFTyxZQUFZO1FBQ2xCLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDO1lBQUUsT0FBTztRQUVoRCxNQUFNLEVBQUUsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQztRQUN2QyxNQUFNLFFBQVEsR0FBSSxFQUFVLENBQUMsZ0JBQWdELENBQUM7UUFFOUUsSUFBSSxJQUFJLEdBQTRCLElBQUksQ0FBQztRQUV6QyxJQUFJLFFBQVEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLEVBQUUsQ0FBQztZQUNwQyxJQUFJLEdBQUcsUUFBUSxDQUFDO1FBQ2xCLENBQUM7YUFBTSxDQUFDO1lBQ04sTUFBTSxJQUFJLEdBQUcsV0FBVyxFQUFFLENBQUM7WUFDM0IsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO2dCQUNWLE9BQU8sQ0FBQyxLQUFLLENBQUMsbUZBQW1GLENBQUMsQ0FBQztnQkFDbkcsT0FBTztZQUNULENBQUM7WUFDRCxJQUFJLEdBQUcsdUJBQXVCLENBQUMsSUFBSSxFQUFFLEVBQUUsRUFBRSxJQUFJLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUN4RSxDQUFDO1FBRUQsSUFBSSxDQUFDLElBQUk7WUFBRSxPQUFPO1FBRWxCLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO1FBQ3BCLEVBQVUsQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUM7UUFDbkMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFxQixDQUFDLGdCQUFnQixHQUFHLElBQUksQ0FBQztRQUM1RCxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUV0QiwrQ0FBK0M7UUFDL0MsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFO1lBQ3pCLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRTtnQkFDbkIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDN0IsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUVILE1BQU0sVUFBVSxHQUFHLEdBQUcsRUFBRTtZQUN0QixNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsUUFBK0QsQ0FBQztZQUNqRixHQUFHLEVBQUUsTUFBTSxFQUFFLEVBQUUsQ0FBQztRQUNsQixDQUFDLENBQUM7UUFFRixnREFBZ0Q7UUFDaEQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLEVBQUU7WUFDakMsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLGNBQWMsQ0FBQyxHQUFHLEVBQUU7Z0JBQzVDLFVBQVUsRUFBRSxDQUFDO1lBQ2YsQ0FBQyxDQUFDLENBQUM7WUFDSCxJQUFJLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUNsQyxDQUFDLENBQUMsQ0FBQztRQUVILG1GQUFtRjtRQUNuRixJQUFJLENBQUMsSUFBSSxHQUFHLHFCQUFxQixDQUFDLEdBQUcsRUFBRSxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUM7UUFDdEQsSUFBSSxDQUFDLElBQUksR0FBRyxxQkFBcUIsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFDO1FBQ3RELElBQUksQ0FBQyxTQUFTLEdBQUcsTUFBTSxDQUFDLFVBQVUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxVQUFVLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUMzRCxNQUFNLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxFQUFFLFVBQVUsRUFBRSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO1FBRTVELHNFQUFzRTtRQUN0RSxJQUFJLENBQUMsSUFBSSxHQUFHLHFCQUFxQixDQUFDLEdBQUcsRUFBRSxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUM7SUFDeEQsQ0FBQztJQUVPLGNBQWM7UUFDcEIsSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxVQUFVLENBQUM7WUFBRSxPQUFPO1FBQ2hELG9CQUFvQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNoQyxJQUFJLENBQUMsSUFBSSxHQUFHLHFCQUFxQixDQUFDLEdBQUcsRUFBRTtZQUNyQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDaEMsSUFBSSxDQUFDLElBQUksR0FBRyxxQkFBcUIsQ0FBQyxHQUFHLEVBQUU7Z0JBQ3JDLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxRQUFRLEVBQUUsYUFBYSxDQUFDO2dCQUMxQyxJQUFJLElBQUksQ0FBQyxTQUFTLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVc7b0JBQUUsT0FBTztnQkFDM0UsSUFBSSxDQUFDO29CQUNILElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztnQkFDckMsQ0FBQztnQkFBQyxNQUFNLENBQUM7b0JBQ1AsaUVBQWlFO2dCQUNuRSxDQUFDO1lBQ0gsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFTyxPQUFPO1FBQ2IsSUFBSSxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7WUFDeEIsSUFBSSxDQUFDLGNBQWMsQ0FBQyxVQUFVLEVBQUUsQ0FBQztZQUNqQyxJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQztRQUM3QixDQUFDO1FBQ0QsSUFBSSxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQztZQUN2QyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDaEMsb0JBQW9CLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ2hDLFlBQVksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDL0IsQ0FBQztRQUVELElBQUksSUFBSSxDQUFDLFFBQVEsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxFQUFFLENBQUM7WUFDOUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUMxQixDQUFDO1FBQ0QsT0FBUSxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQXFCLENBQUMsZ0JBQWdCLENBQUM7UUFDNUQsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7SUFDdkIsQ0FBQztJQUVELHFCQUFxQjtJQUVyQjs7T0FFRztJQUNILFdBQVc7UUFDVCxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUM7SUFDdkIsQ0FBQztJQUVEOztPQUVHO0lBQ0gsSUFBSTtRQUNGLElBQUksQ0FBQyxRQUFRLEVBQUUsSUFBSSxFQUFFLENBQUM7SUFDeEIsQ0FBQztJQUVEOztPQUVHO0lBQ0gsSUFBSTtRQUNGLElBQUksQ0FBQyxRQUFRLEVBQUUsSUFBSSxFQUFFLENBQUM7SUFDeEIsQ0FBQztJQUVEOztPQUVHO0lBQ0gsSUFBSSxDQUFDLEtBQWEsRUFBRSxJQUE4QztRQUNoRSxJQUFJLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDbkMsQ0FBQztJQUVEOztPQUVHO0lBQ0gsSUFBSTtRQUNGLElBQUksQ0FBQyxRQUFRLEVBQUUsSUFBSSxFQUFFLENBQUM7SUFDeEIsQ0FBQztJQUVEOztPQUVHO0lBQ0gsS0FBSztRQUNILElBQUksQ0FBQyxRQUFRLEVBQUUsS0FBSyxFQUFFLENBQUM7SUFDekIsQ0FBQztJQUVEOztPQUVHO0lBQ0gsTUFBTTtRQUNKLElBQUksQ0FBQyxRQUFRLEVBQUUsTUFBTSxFQUFFLENBQUM7SUFDMUIsQ0FBQztJQUVEOztPQUVHO0lBQ0gsZUFBZTtRQUNiLElBQUksQ0FBQyxRQUFRLEVBQUUsZUFBZSxFQUFFLENBQUM7SUFDbkMsQ0FBQztJQUVEOztPQUVHO0lBQ0gsVUFBVSxDQUFDLElBQThCLEVBQUUsT0FBaUI7UUFDMUQsSUFBSSxDQUFDLFFBQVEsRUFBRSxVQUFVLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQzNDLENBQUM7SUFFRDs7T0FFRztJQUNILE1BQU0sQ0FBQyxJQUErQjtRQUNwQyxJQUFJLENBQUMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUM5QixDQUFDO3dHQWxOVSxpQkFBaUIsa0JBb0JsQixXQUFXOzRGQXBCVixpQkFBaUIsc1JBQ0EsVUFBVSxrREFaNUI7Ozs7Ozs7O0dBUVQsMkRBVFMsWUFBWTs7NEZBWVgsaUJBQWlCO2tCQWY3QixTQUFTO21CQUFDO29CQUNULFFBQVEsRUFBRSxhQUFhO29CQUN2QixVQUFVLEVBQUUsSUFBSTtvQkFDaEIsT0FBTyxFQUFFLENBQUMsWUFBWSxDQUFDO29CQUN2QixRQUFRLEVBQUU7Ozs7Ozs7O0dBUVQ7b0JBQ0QsYUFBYSxFQUFFLGlCQUFpQixDQUFDLElBQUk7aUJBQ3RDOzswQkFxQkksTUFBTTsyQkFBQyxXQUFXOytHQW5CcUIsUUFBUTtzQkFBakQsU0FBUzt1QkFBQyxPQUFPLEVBQUUsRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFO2dCQUcvQixPQUFPO3NCQUFmLEtBQUs7Z0JBQ0csU0FBUztzQkFBakIsS0FBSztnQkFDRyxLQUFLO3NCQUFiLEtBQUs7Z0JBR0ksV0FBVztzQkFBcEIsTUFBTTtnQkFDRyxLQUFLO3NCQUFkLE1BQU07O0FBMk1ULGlGQUFpRjtBQUNqRjs7OztHQUlHO0FBV0gsTUFBTSxPQUFPLHNCQUFzQjtJQUN4QixTQUFTLENBQVU7SUFDbkIsS0FBSyxDQUE0Qzt3R0FGL0Msc0JBQXNCOzRGQUF0QixzQkFBc0IsNk9BUHZCLDJCQUEyQjs7NEZBTzFCLHNCQUFzQjtrQkFWbEMsU0FBUzttQkFBQztvQkFDVCxRQUFRLEVBQUUsc0JBQXNCO29CQUNoQyxVQUFVLEVBQUUsSUFBSTtvQkFDaEIsUUFBUSxFQUFFLDJCQUEyQjtvQkFDckMsSUFBSSxFQUFFO3dCQUNKLFNBQVMsRUFBRSxrREFBa0Q7d0JBQzdELFNBQVMsRUFBRSxPQUFPO3FCQUNuQjtvQkFDRCxhQUFhLEVBQUUsaUJBQWlCLENBQUMsSUFBSTtpQkFDdEM7OEJBRVUsU0FBUztzQkFBakIsS0FBSztnQkFDRyxLQUFLO3NCQUFiLEtBQUsiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBDb21wb25lbnQsXG4gIElucHV0LFxuICBPdXRwdXQsXG4gIEV2ZW50RW1pdHRlcixcbiAgVmlld0NoaWxkLFxuICBFbGVtZW50UmVmLFxuICBBZnRlclZpZXdJbml0LFxuICBPbkRlc3Ryb3ksXG4gIFZpZXdFbmNhcHN1bGF0aW9uLFxuICBJbmplY3QsXG4gIFBMQVRGT1JNX0lELFxuICBOZ1pvbmUsXG4gIFJlbmRlcmVyMixcbiAgT25DaGFuZ2VzLFxuICBTaW1wbGVDaGFuZ2VzLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgQ29tbW9uTW9kdWxlLCBpc1BsYXRmb3JtQnJvd3NlciB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgdHlwZSB7IFBhZ2lmbG93SW5zdGFuY2UsIFBhZ2lmbG93T3B0aW9ucyB9IGZyb20gJy4vdHlwZXMnO1xuXG4vLyBAdHMtaWdub3JlXG5pbXBvcnQgUGFnaWZsb3dDb3JlIGZyb20gJ3BhZ2lmbG93JztcblxudHlwZSBQYWdpZmxvd0N0b3IgPSAoXG4gIHNlbGVjdG9yOiBzdHJpbmcgfCBIVE1MRWxlbWVudCxcbiAgb3B0cz86IFBhZ2lmbG93T3B0aW9uc1xuKSA9PiBQYWdpZmxvd0luc3RhbmNlO1xuXG5mdW5jdGlvbiBnZXRQYWdpZmxvdygpOiBQYWdpZmxvd0N0b3IgfCBudWxsIHtcbiAgaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmICh3aW5kb3cgYXMgYW55KS5QYWdpZmxvdykge1xuICAgIHJldHVybiAod2luZG93IGFzIGFueSkuUGFnaWZsb3cgYXMgUGFnaWZsb3dDdG9yO1xuICB9XG4gIHJldHVybiAoUGFnaWZsb3dDb3JlIGFzIGFueSkuZGVmYXVsdCA/PyBQYWdpZmxvd0NvcmU7XG59XG5cbmZ1bmN0aW9uIGluaXRQYWdpZmxvd0Zyb21FbGVtZW50KFxuICBjdG9yOiBQYWdpZmxvd0N0b3IsXG4gIGVsOiBIVE1MRWxlbWVudCxcbiAgb3B0czogUGFnaWZsb3dPcHRpb25zLFxuICByZW5kZXJlcjogUmVuZGVyZXIyXG4pOiBQYWdpZmxvd0luc3RhbmNlIHwgbnVsbCB7XG4gIGNvbnN0IGF0dHJWYWx1ZSA9IGBwZi0ke01hdGgucmFuZG9tKCkudG9TdHJpbmcoMzYpLnNsaWNlKDIpfWA7XG4gIGNvbnN0IHNlbGVjdG9yID0gYFtkYXRhLXBhZ2lmbG93LWFuZ3VsYXItaWQ9XCIke2F0dHJWYWx1ZX1cIl1gO1xuICByZW5kZXJlci5zZXRBdHRyaWJ1dGUoZWwsICdkYXRhLXBhZ2lmbG93LWFuZ3VsYXItaWQnLCBhdHRyVmFsdWUpO1xuXG4gIGNvbnN0IGJ5U2VsZWN0b3IgPSBjdG9yKHNlbGVjdG9yLCBvcHRzKSBhcyBQYWdpZmxvd0luc3RhbmNlIHwgbnVsbDtcbiAgaWYgKCFieVNlbGVjdG9yKSB7XG4gICAgcmVuZGVyZXIucmVtb3ZlQXR0cmlidXRlKGVsLCAnZGF0YS1wYWdpZmxvdy1hbmd1bGFyLWlkJyk7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgcmV0dXJuIGJ5U2VsZWN0b3I7XG59XG5cbi8vIOKUgOKUgOKUgCBQYWdpZmxvdyBDb21wb25lbnQg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdwZi1wYWdpZmxvdycsXG4gIHN0YW5kYWxvbmU6IHRydWUsXG4gIGltcG9ydHM6IFtDb21tb25Nb2R1bGVdLFxuICB0ZW1wbGF0ZTogYFxuICAgIDxkaXZcbiAgICAgICN0cmFja1xuICAgICAgW25nQ2xhc3NdPVwiWydwYWdpZmxvdycsIGNsYXNzTmFtZSB8fCAnJ11cIlxuICAgICAgW3N0eWxlXT1cInN0eWxlXCJcbiAgICA+XG4gICAgICA8bmctY29udGVudD48L25nLWNvbnRlbnQ+XG4gICAgPC9kaXY+XG4gIGAsXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG59KVxuZXhwb3J0IGNsYXNzIFBhZ2lmbG93Q29tcG9uZW50IGltcGxlbWVudHMgQWZ0ZXJWaWV3SW5pdCwgT25EZXN0cm95LCBPbkNoYW5nZXMge1xuICBAVmlld0NoaWxkKCd0cmFjaycsIHsgcmVhZDogRWxlbWVudFJlZiB9KSB0cmFja1JlZiE6IEVsZW1lbnRSZWY8SFRNTERpdkVsZW1lbnQ+O1xuXG4gIC8vIElucHV0IG9wdGlvbnNcbiAgQElucHV0KCkgb3B0aW9uczogUGFnaWZsb3dPcHRpb25zID0ge307XG4gIEBJbnB1dCgpIGNsYXNzTmFtZT86IHN0cmluZztcbiAgQElucHV0KCkgc3R5bGU/OiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmcgfCBudW1iZXI+O1xuXG4gIC8vIE91dHB1dCBldmVudHNcbiAgQE91dHB1dCgpIHNsaWRlQ2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcjxudW1iZXI+KCk7XG4gIEBPdXRwdXQoKSByZWFkeSA9IG5ldyBFdmVudEVtaXR0ZXI8UGFnaWZsb3dJbnN0YW5jZT4oKTtcblxuICBwcml2YXRlIGluc3RhbmNlOiBQYWdpZmxvd0luc3RhbmNlIHwgbnVsbCA9IG51bGw7XG4gIHByaXZhdGUgcmVzaXplT2JzZXJ2ZXI6IFJlc2l6ZU9ic2VydmVyIHwgbnVsbCA9IG51bGw7XG4gIHByaXZhdGUgcmFmMSA9IDA7XG4gIHByaXZhdGUgcmFmMiA9IDA7XG4gIHByaXZhdGUgdGltZW91dElkID0gMDtcbiAgcHJpdmF0ZSBkZXN0cm95ZWQgPSBmYWxzZTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBASW5qZWN0KFBMQVRGT1JNX0lEKSBwcml2YXRlIHBsYXRmb3JtSWQ6IE9iamVjdCxcbiAgICBwcml2YXRlIG5nWm9uZTogTmdab25lLFxuICAgIHByaXZhdGUgcmVuZGVyZXI6IFJlbmRlcmVyMixcbiAgICBwcml2YXRlIGhvc3RSZWY6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+XG4gICkge31cblxuICBuZ0FmdGVyVmlld0luaXQoKTogdm9pZCB7XG4gICAgdGhpcy5kZXN0cm95ZWQgPSBmYWxzZTtcbiAgICBpZiAoIWlzUGxhdGZvcm1Ccm93c2VyKHRoaXMucGxhdGZvcm1JZCkpIHJldHVybjtcbiAgICAvLyBXYWl0IG9uZSBmcmFtZSBzbyBwcm9qZWN0ZWQgc2xpZGUgY29udGVudCBpcyBmdWxseSByZW5kZXJlZCBiZWZvcmUgY29yZSBzbmFwc2hvdHMgY2hpbGRyZW4uXG4gICAgdGhpcy5uZ1pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgICAgaWYgKCF0aGlzLmRlc3Ryb3llZCkgdGhpcy5pbml0UGFnaWZsb3coKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcyk6IHZvaWQge1xuICAgIGlmICghY2hhbmdlc1snb3B0aW9ucyddIHx8ICF0aGlzLmluc3RhbmNlIHx8IGNoYW5nZXNbJ29wdGlvbnMnXS5maXJzdENoYW5nZSkgcmV0dXJuO1xuXG4gICAgLy8gUmVjb25maWd1cmUgZXhpc3RpbmcgaW5zdGFuY2Ugd2hlbiBBbmd1bGFyIGlucHV0IG9iamVjdCBjaGFuZ2VzLlxuICAgIHRoaXMuc2NoZWR1bGVSZWluaXQoKTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgIHRoaXMuZGVzdHJveWVkID0gdHJ1ZTtcbiAgICB0aGlzLmRlc3Ryb3koKTtcbiAgfVxuXG4gIHByaXZhdGUgaW5pdFBhZ2lmbG93KCk6IHZvaWQge1xuICAgIGlmICghaXNQbGF0Zm9ybUJyb3dzZXIodGhpcy5wbGF0Zm9ybUlkKSkgcmV0dXJuO1xuXG4gICAgY29uc3QgZWwgPSB0aGlzLnRyYWNrUmVmLm5hdGl2ZUVsZW1lbnQ7XG4gICAgY29uc3QgZXhpc3RpbmcgPSAoZWwgYXMgYW55KS5wYWdpZmxvd0luc3RhbmNlIGFzIFBhZ2lmbG93SW5zdGFuY2UgfCB1bmRlZmluZWQ7XG5cbiAgICBsZXQgaW5zdDogUGFnaWZsb3dJbnN0YW5jZSB8IG51bGwgPSBudWxsO1xuXG4gICAgaWYgKGV4aXN0aW5nICYmICFleGlzdGluZy5kZXN0cm95ZWQpIHtcbiAgICAgIGluc3QgPSBleGlzdGluZztcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgY3RvciA9IGdldFBhZ2lmbG93KCk7XG4gICAgICBpZiAoIWN0b3IpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcignW1BhZ2lmbG93Q29tcG9uZW50XSBQYWdpZmxvdyBjb3JlIG5vdCBmb3VuZC4gSW5zdGFsbCBwYWdpZmxvdyBvciBsb2FkIGl0IHZpYSBDRE4uJyk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGluc3QgPSBpbml0UGFnaWZsb3dGcm9tRWxlbWVudChjdG9yLCBlbCwgdGhpcy5vcHRpb25zLCB0aGlzLnJlbmRlcmVyKTtcbiAgICB9XG5cbiAgICBpZiAoIWluc3QpIHJldHVybjtcblxuICAgIHRoaXMuaW5zdGFuY2UgPSBpbnN0O1xuICAgIChlbCBhcyBhbnkpLnBhZ2lmbG93SW5zdGFuY2UgPSBpbnN0O1xuICAgICh0aGlzLmhvc3RSZWYubmF0aXZlRWxlbWVudCBhcyBhbnkpLnBhZ2lmbG93SW5zdGFuY2UgPSBpbnN0O1xuICAgIHRoaXMucmVhZHkuZW1pdChpbnN0KTtcblxuICAgIC8vIExpc3RlbiB0byBzbGlkZSBjaGFuZ2VzIHZpYSB0aGUgaW5zdGFuY2UgQVBJXG4gICAgaW5zdC5vblNsaWRlQ2hhbmdlKChpZHgpID0+IHtcbiAgICAgIHRoaXMubmdab25lLnJ1bigoKSA9PiB7XG4gICAgICAgIHRoaXMuc2xpZGVDaGFuZ2UuZW1pdChpZHgpO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBjb25zdCBzeW5jTGF5b3V0ID0gKCkgPT4ge1xuICAgICAgY29uc3QgYXBpID0gdGhpcy5pbnN0YW5jZSBhcyAoUGFnaWZsb3dJbnN0YW5jZSAmIHsgdXBkYXRlPzogKCkgPT4gdm9pZCB9KSB8IG51bGw7XG4gICAgICBhcGk/LnVwZGF0ZT8uKCk7XG4gICAgfTtcblxuICAgIC8vIFNldHVwIHJlc2l6ZSBvYnNlcnZlciBmb3IgcmVzcG9uc2l2ZSBiZWhhdmlvclxuICAgIHRoaXMubmdab25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgIHRoaXMucmVzaXplT2JzZXJ2ZXIgPSBuZXcgUmVzaXplT2JzZXJ2ZXIoKCkgPT4ge1xuICAgICAgICBzeW5jTGF5b3V0KCk7XG4gICAgICB9KTtcbiAgICAgIHRoaXMucmVzaXplT2JzZXJ2ZXIub2JzZXJ2ZShlbCk7XG4gICAgfSk7XG5cbiAgICAvLyBLZWVwIGJlaGF2aW9yIGFsaWduZWQgd2l0aCBvdGhlciB3cmFwcGVycyBzbyBzeW5jL3RodW1ibmFpbHMgc2V0dGxlIGFmdGVyIG1vdW50LlxuICAgIHRoaXMucmFmMSA9IHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiBzeW5jTGF5b3V0KCkpO1xuICAgIHRoaXMucmFmMiA9IHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiBzeW5jTGF5b3V0KCkpO1xuICAgIHRoaXMudGltZW91dElkID0gd2luZG93LnNldFRpbWVvdXQoKCkgPT4gc3luY0xheW91dCgpLCA4MCk7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBzeW5jTGF5b3V0LCB7IG9uY2U6IHRydWUgfSk7XG5cbiAgICAvLyBLZWVwIGEgZmluYWwgbGF5b3V0IHN5bmMgYWZ0ZXIgbW91bnQgd2l0aG91dCByZXNldHRpbmcgc2xpZGUgaW5kZXguXG4gICAgdGhpcy5yYWYxID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHN5bmNMYXlvdXQoKSk7XG4gIH1cblxuICBwcml2YXRlIHNjaGVkdWxlUmVpbml0KCk6IHZvaWQge1xuICAgIGlmICghaXNQbGF0Zm9ybUJyb3dzZXIodGhpcy5wbGF0Zm9ybUlkKSkgcmV0dXJuO1xuICAgIGNhbmNlbEFuaW1hdGlvbkZyYW1lKHRoaXMucmFmMSk7XG4gICAgdGhpcy5yYWYxID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgIGNhbmNlbEFuaW1hdGlvbkZyYW1lKHRoaXMucmFmMik7XG4gICAgICB0aGlzLnJhZjIgPSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgICAgICBjb25zdCBob3N0ID0gdGhpcy50cmFja1JlZj8ubmF0aXZlRWxlbWVudDtcbiAgICAgICAgaWYgKHRoaXMuZGVzdHJveWVkIHx8ICF0aGlzLmluc3RhbmNlIHx8ICFob3N0IHx8ICFob3N0LmlzQ29ubmVjdGVkKSByZXR1cm47XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgdGhpcy5pbnN0YW5jZS5yZUluaXQodGhpcy5vcHRpb25zKTtcbiAgICAgICAgfSBjYXRjaCB7XG4gICAgICAgICAgLy8gSWdub3JlIHRyYW5zaWVudCByZWJ1aWxkIGVycm9ycyBkdXJpbmcgcmFwaWQgdGVhcmRvd24vcmVtb3VudC5cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIGRlc3Ryb3koKTogdm9pZCB7XG4gICAgaWYgKHRoaXMucmVzaXplT2JzZXJ2ZXIpIHtcbiAgICAgIHRoaXMucmVzaXplT2JzZXJ2ZXIuZGlzY29ubmVjdCgpO1xuICAgICAgdGhpcy5yZXNpemVPYnNlcnZlciA9IG51bGw7XG4gICAgfVxuICAgIGlmIChpc1BsYXRmb3JtQnJvd3Nlcih0aGlzLnBsYXRmb3JtSWQpKSB7XG4gICAgICBjYW5jZWxBbmltYXRpb25GcmFtZSh0aGlzLnJhZjEpO1xuICAgICAgY2FuY2VsQW5pbWF0aW9uRnJhbWUodGhpcy5yYWYyKTtcbiAgICAgIGNsZWFyVGltZW91dCh0aGlzLnRpbWVvdXRJZCk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuaW5zdGFuY2UgJiYgIXRoaXMuaW5zdGFuY2UuZGVzdHJveWVkKSB7XG4gICAgICB0aGlzLmluc3RhbmNlLmRlc3Ryb3koKTtcbiAgICB9XG4gICAgZGVsZXRlICh0aGlzLmhvc3RSZWYubmF0aXZlRWxlbWVudCBhcyBhbnkpLnBhZ2lmbG93SW5zdGFuY2U7XG4gICAgdGhpcy5pbnN0YW5jZSA9IG51bGw7XG4gIH1cblxuICAvLyBQdWJsaWMgQVBJIG1ldGhvZHNcblxuICAvKipcbiAgICogR2V0IHRoZSB1bmRlcmx5aW5nIFBhZ2lmbG93IGluc3RhbmNlLlxuICAgKi9cbiAgZ2V0SW5zdGFuY2UoKTogUGFnaWZsb3dJbnN0YW5jZSB8IG51bGwge1xuICAgIHJldHVybiB0aGlzLmluc3RhbmNlO1xuICB9XG5cbiAgLyoqXG4gICAqIE5hdmlnYXRlIHRvIHRoZSBuZXh0IHNsaWRlLlxuICAgKi9cbiAgbmV4dCgpOiB2b2lkIHtcbiAgICB0aGlzLmluc3RhbmNlPy5uZXh0KCk7XG4gIH1cblxuICAvKipcbiAgICogTmF2aWdhdGUgdG8gdGhlIHByZXZpb3VzIHNsaWRlLlxuICAgKi9cbiAgcHJldigpOiB2b2lkIHtcbiAgICB0aGlzLmluc3RhbmNlPy5wcmV2KCk7XG4gIH1cblxuICAvKipcbiAgICogR28gdG8gYSBzcGVjaWZpYyBzbGlkZSBpbmRleC5cbiAgICovXG4gIGdvVG8oaW5kZXg6IG51bWJlciwgb3B0cz86IHsgc2lsZW50PzogYm9vbGVhbjsgaW5zdGFudD86IGJvb2xlYW4gfSk6IHZvaWQge1xuICAgIHRoaXMuaW5zdGFuY2U/LmdvVG8oaW5kZXgsIG9wdHMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFN0YXJ0IGF1dG9TY3JvbGwuXG4gICAqL1xuICBwbGF5KCk6IHZvaWQge1xuICAgIHRoaXMuaW5zdGFuY2U/LnBsYXkoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBQYXVzZSBhdXRvU2Nyb2xsLlxuICAgKi9cbiAgcGF1c2UoKTogdm9pZCB7XG4gICAgdGhpcy5pbnN0YW5jZT8ucGF1c2UoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXN1bWUgYXV0b1Njcm9sbCBhZnRlciBwYXVzZS5cbiAgICovXG4gIHJlc3VtZSgpOiB2b2lkIHtcbiAgICB0aGlzLmluc3RhbmNlPy5yZXN1bWUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUb2dnbGUgYXV0b1Njcm9sbCBwbGF5L3BhdXNlIHN0YXRlLlxuICAgKi9cbiAgdG9nZ2xlUGxheVBhdXNlKCk6IHZvaWQge1xuICAgIHRoaXMuaW5zdGFuY2U/LnRvZ2dsZVBsYXlQYXVzZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZSBvcHRpb25zIGFuZCBvcHRpb25hbGx5IHJlYnVpbGQuXG4gICAqL1xuICBzZXRPcHRpb25zKG9wdHM6IFBhcnRpYWw8UGFnaWZsb3dPcHRpb25zPiwgcmVidWlsZD86IGJvb2xlYW4pOiB2b2lkIHtcbiAgICB0aGlzLmluc3RhbmNlPy5zZXRPcHRpb25zKG9wdHMsIHJlYnVpbGQpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlaW5pdGlhbGl6ZSB3aXRoIG5ldyBvciB1cGRhdGVkIG9wdGlvbnMuXG4gICAqL1xuICByZUluaXQob3B0cz86IFBhcnRpYWw8UGFnaWZsb3dPcHRpb25zPik6IHZvaWQge1xuICAgIHRoaXMuaW5zdGFuY2U/LnJlSW5pdChvcHRzKTtcbiAgfVxufVxuXG4vLyDilIDilIDilIAgUGFnaWZsb3cgU2xpZGUgQ29tcG9uZW50IOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuLyoqXG4gKiBDb21wb25lbnQgb3IgZGlyZWN0aXZlIHRvIHdyYXAgaW5kaXZpZHVhbCBzbGlkZXMuXG4gKiBVc2UgXFxgPHBmLXNsaWRlPlxcYCB0byBjcmVhdGUgYSB3cmFwcGVyIGVsZW1lbnQsIG9yIHVzZSBcXGBbcGYtc2xpZGVdXFxgIGFzIGFuIGF0dHJpYnV0ZVxuICogb24geW91ciBvd24gZWxlbWVudCB0byBhdm9pZCBhbiBleHRyYSBET00gd3JhcHBlci5cbiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAncGYtc2xpZGUsIFtwZi1zbGlkZV0nLFxuICBzdGFuZGFsb25lOiB0cnVlLFxuICB0ZW1wbGF0ZTogYDxuZy1jb250ZW50PjwvbmctY29udGVudD5gLFxuICBob3N0OiB7XG4gICAgJ1tjbGFzc10nOiBcImNsYXNzTmFtZSA/ICdwZi1zbGlkZSAnICsgY2xhc3NOYW1lIDogJ3BmLXNsaWRlJ1wiLFxuICAgICdbc3R5bGVdJzogJ3N0eWxlJ1xuICB9LFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxufSlcbmV4cG9ydCBjbGFzcyBQYWdpZmxvd1NsaWRlQ29tcG9uZW50IHtcbiAgQElucHV0KCkgY2xhc3NOYW1lPzogc3RyaW5nO1xuICBASW5wdXQoKSBzdHlsZT86IHN0cmluZyB8IFJlY29yZDxzdHJpbmcsIHN0cmluZyB8IG51bWJlcj47XG59XG4iXX0=