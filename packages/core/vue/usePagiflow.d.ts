import { type Ref } from 'vue';
import type { PagiflowInstance, PagiflowOptions } from './types';
export interface UsePagiflowReturn {
    sliderRef: Ref<HTMLElement | null>;
    instance: Ref<PagiflowInstance | null>;
    currentIndex: Ref<number>;
    goTo: (index: number, opts?: {
        silent?: boolean;
        instant?: boolean;
    }) => void;
    next: () => void;
    prev: () => void;
    play: () => void;
    pause: () => void;
    togglePlayPause: () => void;
    setOptions: (opts: Partial<PagiflowOptions>, rebuild?: boolean) => void;
    reInit: (opts?: Partial<PagiflowOptions>) => void;
}
export declare function usePagiflow(options?: PagiflowOptions): UsePagiflowReturn;
