import type { PagiflowInstance, PagiflowOptions } from './types';
export interface PagiflowController {
    /** Attach to your track element: `<div ref={slider.ref}>` */
    ref: (el: HTMLElement) => void;
    /** Reactive current slide index (0-based). Call as `slider.currentIndex()`. */
    currentIndex: () => number;
    /** Raw PagiflowInstance — null until mounted. Call as `slider.instance()`. */
    instance: () => PagiflowInstance | null;
    /** Go to next slide */
    next(): void;
    /** Go to previous slide */
    prev(): void;
    /** Go to a specific slide */
    goTo(index: number, opts?: {
        silent?: boolean;
        instant?: boolean;
    }): void;
    /** Start autoplay */
    play(): void;
    /** Pause autoplay */
    pause(): void;
    /** Resume autoplay */
    resume(): void;
    /** Toggle play / pause */
    togglePlayPause(): void;
    /** Update options (optionally rebuild) */
    setOptions(opts: Partial<PagiflowOptions>, rebuild?: boolean): void;
    /** Destroy and reinitialise */
    reInit(opts?: Partial<PagiflowOptions>): void;
}
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
export declare function createPagiflow(options?: PagiflowOptions): PagiflowController;
