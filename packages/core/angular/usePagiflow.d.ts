import { WritableSignal } from '@angular/core';
import type { PagiflowInstance, PagiflowOptions } from './types';
export interface UsePagiflowReturn {
    /** Signal for the slider ref */
    sliderRef: WritableSignal<HTMLElement | null>;
    /** Signal for Pagiflow instance */
    instance: WritableSignal<PagiflowInstance | null>;
    /** Signal for current slide index */
    currentIndex: WritableSignal<number>;
    /** Navigate to a specific slide */
    goTo: (index: number, opts?: {
        silent?: boolean;
        instant?: boolean;
    }) => void;
    /** Go to next slide */
    next: () => void;
    /** Go to previous slide */
    prev: () => void;
    /** Start autoScroll */
    play: () => void;
    /** Pause autoScroll */
    pause: () => void;
    /** Toggle play/pause */
    togglePlayPause: () => void;
    /** Update options */
    setOptions: (opts: Partial<PagiflowOptions>, rebuild?: boolean) => void;
    /** Reinitialize with new options */
    reInit: (opts?: Partial<PagiflowOptions>) => void;
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
export declare function usePagiflow(options?: PagiflowOptions): UsePagiflowReturn;
