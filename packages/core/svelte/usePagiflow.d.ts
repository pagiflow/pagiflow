import type { Readable } from 'svelte/store';
import type { PagiflowInstance, PagiflowOptions } from './types';
export interface PagiflowState {
    instance: PagiflowInstance | null;
    currentIndex: number;
}
export interface PagiflowController extends Readable<PagiflowState> {
    /** Svelte action — attach with `use:slider.action` on the track element */
    action(node: HTMLElement): {
        destroy(): void;
    };
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
    /** Toggle play / pause */
    togglePlayPause(): void;
    /** Update options (optionally rebuild) */
    setOptions(opts: Partial<PagiflowOptions>, rebuild?: boolean): void;
    /** Destroy and reinitialise */
    reInit(opts?: Partial<PagiflowOptions>): void;
}
/**
 * Creates a reactive Pagiflow controller.
 *
 * @example
 * ```svelte
 * <script>
 *   import { createPagiflow } from 'pagiflow/svelte';
 *   const slider = createPagiflow({ loop: true, nav: true });
 *   $: currentIndex = $slider.currentIndex;
 * </script>
 *
 * <div use:slider.action>
 *   <div>Slide 1</div>
 *   <div>Slide 2</div>
 * </div>
 *
 * <button on:click={slider.prev}>‹</button>
 * <button on:click={slider.next}>›</button>
 * ```
 */
export declare function createPagiflow(options?: PagiflowOptions): PagiflowController;
