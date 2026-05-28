import { PagiflowOptions, PagiflowInstance } from './react/types';

/**
 * Pagiflow - The High-Performance JS Slider Library
 */
export default class Pagiflow implements PagiflowInstance {
    /**
     * Create a new Pagiflow instance
     * @param element Selector string or HTMLElement
     * @param options Configuration options
     */
    constructor(element: string | HTMLElement, options?: PagiflowOptions);

    // Methods from PagiflowInstance
    next(): PagiflowInstance;
    prev(): PagiflowInstance;
    goTo(index: number, options?: { silent?: boolean; instant?: boolean }): PagiflowInstance;
    play(): PagiflowInstance;
    pause(): PagiflowInstance;
    resume(): PagiflowInstance;
    togglePlayPause(): PagiflowInstance;
    destroy(): void;
    reInit(options?: Partial<PagiflowOptions>): PagiflowInstance;
    setOptions(options: Partial<PagiflowOptions>, rebuild?: boolean): PagiflowInstance;
    html(content?: string | string[] | 'dom'): string | Element[] | PagiflowInstance;
    onSlideChange(callback: (index: number) => void): PagiflowInstance;

    // Properties from PagiflowInstance
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

export * from './react/types';

declare module 'pagiflow/css' {}
