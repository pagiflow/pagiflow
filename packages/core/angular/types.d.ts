export interface PagiflowThumbnailOptions {
    enabled?: boolean;
    position?: 'top' | 'bottom' | 'left' | 'right';
    thumbWidth?: number | string;
    gap?: number | string;
    sidebarHeight?: number | string | null;
}
export interface PagiflowNavigationOptions {
    prev: string;
    next: string;
}
export type PagiflowDirection = 'horizontal' | 'vertical';
export type PagiflowAutoScrollDirection = 'left' | 'right';
export interface PagiflowResponsiveOptions extends Partial<PagiflowOptions> {
}
export interface PagiflowOptions {
    direction?: PagiflowDirection;
    fade?: boolean;
    grid?: boolean;
    gridColumns?: number;
    gridFill?: boolean;
    animate?: boolean;
    itemsPerSlide?: number;
    slidesToScroll?: number;
    gap?: number;
    height?: number | string;
    startIndex?: number;
    loop?: boolean;
    speed?: number;
    swipeThreshold?: number;
    nav?: boolean;
    navDisabledEnd?: boolean;
    navigation?: PagiflowNavigationOptions | null;
    prevIcon?: string;
    nextIcon?: string;
    prevPosition?: string | Record<string, number | string> | null;
    nextPosition?: string | Record<string, number | string> | null;
    thumbnails?: PagiflowThumbnailOptions;
    autoplay?: boolean;
    autoplayDelay?: number;
    pauseOnHover?: boolean;
    paginate?: boolean;
    paginationPosition?: string | Record<string, number | string> | null;
    paginationType?: string | null;
    autoplayProgress?: boolean;
    freeMode?: boolean;
    freeModeMomentum?: boolean;
    draggable?: boolean;
    on?: Record<string, (...args: any[]) => void>;
    autoScroll?: boolean;
    autoScrollSpeed?: number;
    autoScrollDirection?: PagiflowAutoScrollDirection;
    lazyLoad?: boolean;
    keyboard?: boolean;
    centerMode?: boolean;
    centerPadding?: number | string;
    rtl?: boolean;
    sync?: any;
    responsive?: Record<number, Partial<PagiflowOptions>>;
    html?: string | string[];
}
export interface PagiflowInstance {
    /**
     * Register a callback for slide changes.
     */
    onSlideChange(callback: (index: number) => void): void;
    /**
     * Destroy instance and cleanup.
     */
    destroy(): void;
    /**
     * Whether the instance has been destroyed.
     */
    destroyed: boolean;
    /**
     * Current slide index.
     */
    currentIndex: number;
    /**
     * Total number of slides.
     */
    slideCount: number;
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
     * Stop autoScroll.
     */
    pause(): void;
    /**
     * Resume autoScroll after pause.
     */
    resume(): void;
    /**
     * Toggle autoScroll state.
     */
    togglePlayPause(): void;
    /**
     * Update options and optionally rebuild.
     */
    setOptions(opts: Partial<PagiflowOptions>, rebuild?: boolean): void;
    /**
     * Rebuild with new or updated options.
     */
    reInit(opts?: Partial<PagiflowOptions>): void;
}
