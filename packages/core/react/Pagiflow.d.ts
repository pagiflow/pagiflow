import React, { type ReactNode, type HTMLAttributes, type CSSProperties } from 'react';
import type { PagiflowInstance, PagiflowOptions } from './types';
export interface PagiflowSlideProps extends HTMLAttributes<HTMLDivElement> {
    children?: ReactNode;
    /**
     * If true, changes the element rendered to the direct child element,
     * merging their props and behavior.
     */
    asChild?: boolean;
}
/**
 * Wrapper for individual slides. Each direct child of `<Pagiflow>` becomes
 * a slide. By default (`asChild: true`), this acts as a Slot and merges
 * its props into the child element to avoid an extra wrapper `<div>`.
 * Pass `asChild={false}` to explicitly render a wrapper `<div>`.
 */
export declare const PagiflowSlide: React.ForwardRefExoticComponent<PagiflowSlideProps & React.RefAttributes<HTMLElement>>;
export interface PagiflowHandle {
    instance: PagiflowInstance | null;
    next(): void;
    prev(): void;
    goTo(index: number, opts?: {
        silent?: boolean;
        instant?: boolean;
    }): void;
    play(): void;
    pause(): void;
    resume(): void;
    togglePlayPause(): void;
    setOptions(opts: Partial<PagiflowOptions>, rebuild?: boolean): void;
    reInit(opts?: Partial<PagiflowOptions>): void;
}
export interface PagiflowProps extends PagiflowOptions {
    /** Slide content — accepts any React children */
    children?: ReactNode;
    /** CSS class applied to the track element */
    className?: string;
    /** Inline style for the track element */
    style?: CSSProperties;
    /** Called when the active slide changes (real index, 0-based) */
    onSlideChange?: (index: number) => void;
    /**
     * Render prop for custom navigation.
     * Receives `{ next, prev, currentIndex, instance }`.
     */
    renderNav?: (props: {
        next: () => void;
        prev: () => void;
        currentIndex: number;
        instance: PagiflowInstance | null;
    }) => ReactNode;
    /**
     * Render prop for custom pagination.
     * Receives `{ goTo, currentIndex, total, instance }`.
     */
    renderPagination?: (props: {
        goTo: (i: number) => void;
        currentIndex: number;
        total: number;
        instance: PagiflowInstance | null;
    }) => ReactNode;
    /** ID applied to the underlying track element */
    id?: string;
}
/**
 * Drop-in React component wrapping the Pagiflow core.
 *
 * @example
 * <Pagiflow loop nav paginate onSlideChange={setIdx}>
 *   <PagiflowSlide><img src="..." /></PagiflowSlide>
 *   <PagiflowSlide><img src="..." /></PagiflowSlide>
 * </Pagiflow>
 */
export declare const Pagiflow: React.ForwardRefExoticComponent<PagiflowProps & React.RefAttributes<PagiflowHandle>>;
