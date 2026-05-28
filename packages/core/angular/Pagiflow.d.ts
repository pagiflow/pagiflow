import { EventEmitter, ElementRef, AfterViewInit, OnDestroy, NgZone, Renderer2, OnChanges, SimpleChanges } from '@angular/core';
import type { PagiflowInstance, PagiflowOptions } from './types';
import * as i0 from "@angular/core";
export declare class PagiflowComponent implements AfterViewInit, OnDestroy, OnChanges {
    private platformId;
    private ngZone;
    private renderer;
    private hostRef;
    trackRef: ElementRef<HTMLDivElement>;
    options: PagiflowOptions;
    className?: string;
    style?: Record<string, string | number>;
    slideChange: EventEmitter<number>;
    ready: EventEmitter<PagiflowInstance>;
    private instance;
    private resizeObserver;
    private raf1;
    private raf2;
    private timeoutId;
    private destroyed;
    constructor(platformId: Object, ngZone: NgZone, renderer: Renderer2, hostRef: ElementRef<HTMLElement>);
    ngAfterViewInit(): void;
    ngOnChanges(changes: SimpleChanges): void;
    ngOnDestroy(): void;
    private initPagiflow;
    private scheduleReinit;
    private destroy;
    /**
     * Get the underlying Pagiflow instance.
     */
    getInstance(): PagiflowInstance | null;
    /**
     * Navigate to the next slide.
     */
    next(): void;
    /**
     * Navigate to the previous slide.
     */
    prev(): void;
    /**
     * Go to a specific slide index.
     */
    goTo(index: number, opts?: {
        silent?: boolean;
        instant?: boolean;
    }): void;
    /**
     * Start autoScroll.
     */
    play(): void;
    /**
     * Pause autoScroll.
     */
    pause(): void;
    /**
     * Resume autoScroll after pause.
     */
    resume(): void;
    /**
     * Toggle autoScroll play/pause state.
     */
    togglePlayPause(): void;
    /**
     * Update options and optionally rebuild.
     */
    setOptions(opts: Partial<PagiflowOptions>, rebuild?: boolean): void;
    /**
     * Reinitialize with new or updated options.
     */
    reInit(opts?: Partial<PagiflowOptions>): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<PagiflowComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<PagiflowComponent, "pf-pagiflow", never, { "options": { "alias": "options"; "required": false; }; "className": { "alias": "className"; "required": false; }; "style": { "alias": "style"; "required": false; }; }, { "slideChange": "slideChange"; "ready": "ready"; }, never, ["*"], true, never>;
}
/**
 * Component or directive to wrap individual slides.
 * Use \`<pf-slide>\` to create a wrapper element, or use \`[pf-slide]\` as an attribute
 * on your own element to avoid an extra DOM wrapper.
 */
export declare class PagiflowSlideComponent {
    className?: string;
    style?: string | Record<string, string | number>;
    static ɵfac: i0.ɵɵFactoryDeclaration<PagiflowSlideComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<PagiflowSlideComponent, "pf-slide, [pf-slide]", never, { "className": { "alias": "className"; "required": false; }; "style": { "alias": "style"; "required": false; }; }, {}, never, ["*"], true, never>;
}
