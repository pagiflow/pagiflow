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
    autoScroll?: boolean;
    autoScrollSpeed?: number;
    autoScrollDirection?: PagiflowAutoScrollDirection;
    lazyLoad?: boolean;
    keyboard?: boolean;
    centerMode?: boolean;
    centerPadding?: number | string;
    rtl?: boolean;
    sync?: PagiflowInstance | string | null;
    responsive?: Record<number, Partial<PagiflowOptions>>;
    html?: string | string[];
}
export interface PagiflowInstance {
    next(): PagiflowInstance;
    prev(): PagiflowInstance;
    goTo(index: number, options?: {
        silent?: boolean;
        instant?: boolean;
    }): PagiflowInstance;
    play(): PagiflowInstance;
    pause(): PagiflowInstance;
    resume(): PagiflowInstance;
    togglePlayPause(): PagiflowInstance;
    destroy(): void;
    reInit(options?: Partial<PagiflowOptions>): PagiflowInstance;
    setOptions(options: Partial<PagiflowOptions>, rebuild?: boolean): PagiflowInstance;
    html(content?: string | string[] | 'dom'): string | Element[] | PagiflowInstance;
    onSlideChange(callback: (index: number) => void): PagiflowInstance;
    index: number;
    slides: Element[];
    originalItems: Element[];
    currentPerSlide: number;
    loop: boolean;
    autoScroll: boolean;
    destroyed: boolean;
    syncTarget: PagiflowInstance | null;
    _getRealIndex(): number;
}
