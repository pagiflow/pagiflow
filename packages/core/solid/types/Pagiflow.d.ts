import { type JSX, type Component } from 'solid-js';
import type { PagiflowInstance, PagiflowOptions } from './types';
export interface PagiflowProps extends PagiflowOptions {
    /** Slide content */
    children?: JSX.Element;
    /** CSS class on the track element */
    class?: string;
    /** Inline style on the track element */
    style?: JSX.CSSProperties | string;
    /** ID on the track element */
    id?: string;
    /** Called when the active slide changes (0-based real index) */
    onSlideChange?: (index: number) => void;
    /**
     * Render prop for custom navigation.
     * Receives { next, prev, currentIndex, instance }.
     */
    renderNav?: (props: {
        next: () => void;
        prev: () => void;
        currentIndex: number;
        instance: PagiflowInstance | null;
    }) => JSX.Element;
    /**
     * Render prop for custom pagination.
     * Receives { goTo, currentIndex, total, instance }.
     */
    renderPagination?: (props: {
        goTo: (index: number, opts?: {
            silent?: boolean;
            instant?: boolean;
        }) => void;
        currentIndex: number;
        total: number;
        instance: PagiflowInstance | null;
    }) => JSX.Element;
}
/**
 * Drop-in SolidJS component wrapping the Pagiflow core.
 *
 * @example
 * <Pagiflow loop nav onSlideChange={setIdx}>
 *   <div>Slide 1</div>
 *   <div>Slide 2</div>
 * </Pagiflow>
 */
export declare const Pagiflow: Component<PagiflowProps>;
