import { MutableRefObject } from 'react';
import type { PagiflowInstance, PagiflowOptions } from './types';
export interface UsePagiflowReturn {
    /** Attach this ref to the slider track element */
    sliderRef: MutableRefObject<HTMLElement | null>;
    /** Live Pagiflow instance (null until mounted) */
    instance: PagiflowInstance | null;
    /** Current real slide index (0-based, loop-adjusted) */
    currentIndex: number;
    /** Go to a specific slide */
    goTo: (index: number, opts?: {
        silent?: boolean;
        instant?: boolean;
    }) => void;
    /** Go to next slide */
    next: () => void;
    /** Go to previous slide */
    prev: () => void;
    /** Play autoplay */
    play: () => void;
    /** Pause autoplay */
    pause: () => void;
    /** Resume from paused state */
    resume: () => void;
    /** Toggle play/pause */
    togglePlayPause: () => void;
    /** Rebuild/reinit with new options */
    setOptions: (opts: Partial<PagiflowOptions>, rebuild?: boolean) => void;
    /** Destroy and reinitialize */
    reInit: (opts?: Partial<PagiflowOptions>) => void;
}
/**
 * Core hook to initialize and control a Pagiflow slider.
 *
 * @example
 * const { sliderRef, next, prev, currentIndex } = usePagiflow({ loop: true, nav: true });
 * return (
 *   <div ref={sliderRef as React.Ref<HTMLDivElement>}>
 *     <div>Slide 1</div>
 *     <div>Slide 2</div>
 *   </div>
 * );
 */
export declare function usePagiflow(options?: PagiflowOptions): UsePagiflowReturn;
