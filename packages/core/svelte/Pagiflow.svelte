<svelte:options accessors />
<script lang="ts">
  import { onMount, onDestroy, createEventDispatcher } from 'svelte';
  import type { PagiflowInstance, PagiflowOptions } from './types';

  // ─── Props ─────────────────────────────────────────────────────────────────
  export let id: string | undefined = undefined;
  export let className: string = '';

  // PagiflowOptions props
  export let direction: PagiflowOptions['direction'] = undefined;
  export let fade: boolean | undefined = undefined;
  export let grid: boolean | undefined = undefined;
  export let gridColumns: number | undefined = undefined;
  export let gridFill: boolean | undefined = undefined;
  export let animate: boolean | undefined = undefined;
  export let itemsPerSlide: number | undefined = undefined;
  export let slidesToScroll: number | undefined = undefined;
  export let gap: number | undefined = undefined;
  export let height: number | string | undefined = undefined;
  export let startIndex: number | undefined = undefined;
  export let loop: boolean | undefined = undefined;
  export let speed: number | undefined = undefined;
  export let swipeThreshold: number | undefined = undefined;
  export let nav: boolean | undefined = undefined;
  export let navDisabledEnd: boolean | undefined = undefined;
  export let navigation: PagiflowOptions['navigation'] = undefined;
  export let prevIcon: string | undefined = undefined;
  export let nextIcon: string | undefined = undefined;
  export let prevPosition: PagiflowOptions['prevPosition'] = undefined;
  export let nextPosition: PagiflowOptions['nextPosition'] = undefined;
  export let thumbnails: PagiflowOptions['thumbnails'] = undefined;
  export let autoplay: boolean | undefined = undefined;
  export let autoplayDelay: number | undefined = undefined;
  export let pauseOnHover: boolean | undefined = undefined;
  export let paginate: boolean | undefined = undefined;
  export let paginationPosition: PagiflowOptions['paginationPosition'] = undefined;
  export let autoScroll: boolean | undefined = undefined;
  export let autoScrollSpeed: number | undefined = undefined;
  export let autoScrollDirection: PagiflowOptions['autoScrollDirection'] = undefined;
  export let lazyLoad: boolean | undefined = undefined;
  export let keyboard: boolean | undefined = undefined;
  export let centerMode: boolean | undefined = undefined;
  export let centerPadding: number | string | undefined = undefined;
  export let rtl: boolean | undefined = undefined;
  export let sync: PagiflowOptions['sync'] = undefined;
  export let responsive: PagiflowOptions['responsive'] = undefined;

  // ─── Exposed instance (bind:instance) ─────────────────────────────────────
  export let instance: PagiflowInstance | null = null;
  let currentIndex = startIndex ?? 0;

  export let onSlideChange: ((index: number) => void) | undefined = undefined;

  export const next = () => { instance?.next(); }
  export const prev = () => { instance?.prev(); }
  export const goTo = (index: number, opts?: { silent?: boolean; instant?: boolean }) => {
    instance?.goTo(index, opts);
  }
  export const play = () => { instance?.play(); }
  export const pause = () => { instance?.pause(); }
  export const resume = () => { instance?.resume(); }
  export const togglePlayPause = () => { instance?.togglePlayPause(); }
  export const destroy = () => { instance?.destroy(); }
  export const setOptions = (opts: Partial<PagiflowOptions>, rebuild?: boolean) => {
    instance?.setOptions(opts, rebuild);
  }
  export const reInit = (opts?: Partial<PagiflowOptions>) => {
    instance?.reInit(opts);
  }

  // ─── Internal ──────────────────────────────────────────────────────────────
  const dispatch = createEventDispatcher<{ slideChange: { index: number } }>();

  let trackEl: HTMLDivElement;
  let raf1: number, raf2: number, timeoutId: ReturnType<typeof setTimeout>;
  let resizeObserver: ResizeObserver | null = null;

  function buildOptions(): PagiflowOptions {
    const opts: PagiflowOptions = {};
    if (direction !== undefined) opts.direction = direction;
    if (fade !== undefined) opts.fade = fade;
    if (grid !== undefined) opts.grid = grid;
    if (gridColumns !== undefined) opts.gridColumns = gridColumns;
    if (gridFill !== undefined) opts.gridFill = gridFill;
    if (animate !== undefined) opts.animate = animate;
    if (itemsPerSlide !== undefined) opts.itemsPerSlide = itemsPerSlide;
    if (slidesToScroll !== undefined) opts.slidesToScroll = slidesToScroll;
    if (gap !== undefined) opts.gap = gap;
    if (height !== undefined) opts.height = height;
    if (startIndex !== undefined) opts.startIndex = startIndex;
    if (loop !== undefined) opts.loop = loop;
    if (speed !== undefined) opts.speed = speed;
    if (swipeThreshold !== undefined) opts.swipeThreshold = swipeThreshold;
    if (nav !== undefined) opts.nav = nav;
    if (navDisabledEnd !== undefined) opts.navDisabledEnd = navDisabledEnd;
    if (navigation !== undefined) opts.navigation = navigation;
    if (prevIcon !== undefined) opts.prevIcon = prevIcon;
    if (nextIcon !== undefined) opts.nextIcon = nextIcon;
    if (prevPosition !== undefined) opts.prevPosition = prevPosition;
    if (nextPosition !== undefined) opts.nextPosition = nextPosition;
    if (thumbnails !== undefined) opts.thumbnails = thumbnails;
    if (autoplay !== undefined) opts.autoplay = autoplay;
    if (autoplayDelay !== undefined) opts.autoplayDelay = autoplayDelay;
    if (pauseOnHover !== undefined) opts.pauseOnHover = pauseOnHover;
    if (paginate !== undefined) opts.paginate = paginate;
    if (paginationPosition !== undefined) opts.paginationPosition = paginationPosition;
    if (autoScroll !== undefined) opts.autoScroll = autoScroll;
    if (autoScrollSpeed !== undefined) opts.autoScrollSpeed = autoScrollSpeed;
    if (autoScrollDirection !== undefined) opts.autoScrollDirection = autoScrollDirection;
    if (lazyLoad !== undefined) opts.lazyLoad = lazyLoad;
    if (keyboard !== undefined) opts.keyboard = keyboard;
    if (centerMode !== undefined) opts.centerMode = centerMode;
    if (centerPadding !== undefined) opts.centerPadding = centerPadding;
    if (rtl !== undefined) opts.rtl = rtl;
    if (sync !== undefined) opts.sync = sync;
    if (responsive !== undefined) opts.responsive = responsive;
    return opts;
  }

  function getPagiflow() {
    if (typeof window !== 'undefined' && (window as any).Pagiflow) {
      return (window as any).Pagiflow;
    }
    try {
      const mod = require('pagiflow');
      return mod.default ?? mod;
    } catch {
      return null;
    }
  }

  onMount(() => {
    const existing = (trackEl as any).pagiflowInstance as PagiflowInstance | undefined;
    if (existing && !existing.destroyed) return;

    const PagiflowCtor = getPagiflow();
    if (!PagiflowCtor) {
      console.error('[Pagiflow] Core not found. Install pagiflow or load it via CDN.');
      return;
    }

    const attrValue = `pf-${Math.random().toString(36).slice(2)}`;
    const selector = `[data-pagiflow-svelte-id="${attrValue}"]`;
    trackEl.setAttribute('data-pagiflow-svelte-id', attrValue);

    const inst: PagiflowInstance | null = PagiflowCtor(selector, buildOptions());
    if (!inst) {
      trackEl.removeAttribute('data-pagiflow-svelte-id');
      return;
    }

    const syncLayout = () => {
      (inst as any).update?.();
    };

    raf1 = requestAnimationFrame(() => syncLayout());
    raf2 = requestAnimationFrame(() => syncLayout());
    timeoutId = setTimeout(() => syncLayout(), 80);
    window.addEventListener('load', syncLayout, { once: true });

    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => syncLayout());
      resizeObserver.observe(trackEl);
    }

    inst.onSlideChange((idx) => {
      instance = inst; // keep reference fresh
      currentIndex = idx;
      dispatch('slideChange', { index: idx });
      if (onSlideChange) onSlideChange(idx);
    });

    instance = inst;
  });

  onDestroy(() => {
    if (typeof window !== 'undefined') {
      if (typeof cancelAnimationFrame !== 'undefined') {
        cancelAnimationFrame(raf1);
        cancelAnimationFrame(raf2);
      }
      resizeObserver?.disconnect();
    }
    clearTimeout(timeoutId);
    if (instance && !instance.destroyed) {
      try { instance.destroy(); } catch { /* ignore */ }
    }
    if (trackEl) delete (trackEl as any).pagiflowInstance;
    instance = null;
  });
</script>

<div
  bind:this={trackEl}
  {id}
  class={['pagiflow', className].filter(Boolean).join(' ')}
>
  <!-- Default slot: place your slide elements here -->
  <slot />
</div>

<!-- Named slot for custom navigation -->
<!-- Usage: <svelte:fragment slot="nav">...</svelte:fragment> -->
{#if $$slots.nav}
  <slot name="nav" {next} {prev} {currentIndex} {instance} />
{/if}

<!-- Named slot for custom pagination -->
<!-- Usage: <svelte:fragment slot="pagination">...</svelte:fragment> -->
{#if $$slots.pagination}
  <slot
    name="pagination"
    {goTo}
    {currentIndex}
    {instance}
  />
{/if}
