import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { describe, expect, it, vi, afterEach } from 'vitest';
import { Pagiflow } from '../packages/react/src/Pagiflow';

type Call = { options: Record<string, unknown> };

function installMockPagiflow(calls: Call[]) {
  const instance = {
    destroyed: false,
    setOptions: vi.fn(),
    onSlideChange: vi.fn(() => instance),
    destroy: vi.fn(() => {
      instance.destroyed = true;
    }),
    next: vi.fn(),
    prev: vi.fn(),
    goTo: vi.fn(),
    play: vi.fn(),
    pause: vi.fn(),
    resume: vi.fn(),
    togglePlayPause: vi.fn(),
    reInit: vi.fn(),
  } as any;

  (window as any).Pagiflow = vi.fn((_selector: string, opts: Record<string, unknown>) => {
    calls.push({ options: { ...opts } });
    return instance;
  });
  return instance;
}

describe('React wrapper', () => {
  afterEach(() => {
    cleanup();
    delete (window as any).Pagiflow;
  });

  it('re-applies options after prop update and destroys on unmount', () => {
    const calls: Call[] = [];
    const instance = installMockPagiflow(calls);

    const { rerender, unmount } = render(
      <Pagiflow loop={false} itemsPerSlide={1}>
        <div>Slide 1</div>
      </Pagiflow>
    );

    rerender(
      <Pagiflow loop itemsPerSlide={2}>
        <div>Slide 1</div>
      </Pagiflow>
    );

    expect(instance.setOptions).toHaveBeenCalled();
    const lastCall = instance.setOptions.mock.calls.at(-1);
    expect(lastCall?.[0]).toMatchObject({ loop: true, itemsPerSlide: 2 });
    expect(lastCall?.[1]).toBe(true);

    unmount();
    expect(instance.destroy).toHaveBeenCalledTimes(1);
  });
});
